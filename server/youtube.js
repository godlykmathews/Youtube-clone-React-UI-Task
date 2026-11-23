const API_HOST = 'youtube-v31.p.rapidapi.com';
const VIDEO_ID = /^[\w-]{11}$/;
const CACHE_TTL = 60_000;
const MAX_CACHE_ENTRIES = 100;
const MAX_REQUESTS_PER_MINUTE = 60;

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function upstreamUrl(url) {
  const endpoint = url.pathname.slice('/api/youtube/'.length);
  const params = url.searchParams;
  const target = new URL(`https://${API_HOST}/${endpoint}`);

  if (endpoint === 'search') {
    const query = (params.get('q') || '').trim();
    const order = params.get('order') || 'relevance';
    const pageToken = params.get('pageToken');
    if (!query || query.length > 200) {
      throw new ApiError(400, 'Enter a search between 1 and 200 characters.');
    }
    if (!['relevance', 'date', 'viewCount'].includes(order)) {
      throw new ApiError(400, 'Unsupported search order.');
    }
    if (pageToken && pageToken.length > 500) {
      throw new ApiError(400, 'Invalid page token.');
    }
    target.search = new URLSearchParams({
      part: 'snippet',
      type: 'video',
      maxResults: '24',
      q: query,
      order,
      videoEmbeddable: 'true',
    });
    if (pageToken) target.searchParams.set('pageToken', pageToken);
    if (params.get('eventType') === 'live') target.searchParams.set('eventType', 'live');
  } else if (endpoint === 'videos') {
    const id = params.get('id') || '';
    if (!VIDEO_ID.test(id)) throw new ApiError(400, 'Invalid video ID.');
    target.search = new URLSearchParams({ part: 'snippet,statistics,contentDetails', id });
  } else {
    throw new ApiError(404, 'Unknown video API endpoint.');
  }

  return target;
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(body));
}

// Shared by Vite's development/preview servers and the production Node server.
// Only these two read-only endpoints can use the server's RapidAPI credential.
export function createYoutubeHandler({ apiKey, fetchImpl = fetch } = {}) {
  const cache = new Map();
  const pending = new Map();
  let windowStart = Date.now();
  let requestCount = 0;

  async function fetchYoutube(target) {
    if (Date.now() - windowStart >= 60_000) {
      windowStart = Date.now();
      requestCount = 0;
    }
    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
      throw new ApiError(429, 'Too many video requests. Please try again in a minute.');
    }
    requestCount += 1;

    let response;
    let data;
    try {
      response = await fetchImpl(target, {
        headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': API_HOST },
        signal: AbortSignal.timeout(15_000),
        redirect: 'error',
      });
      if (response.status === 401 || response.status === 403) {
        throw new ApiError(503, 'Video access is unavailable. Check the RapidAPI key and Youtube v3 subscription on the server.');
      }
      if (response.status === 429) {
        throw new ApiError(429, 'The video service request limit was reached. Please try again later.');
      }
      if (!response.ok) throw new ApiError(502, 'The video service is unavailable. Please try again.');
      data = await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        throw new ApiError(504, 'The video service took too long to respond. Please try again.');
      }
      throw new ApiError(502, 'Could not reach the video service. Please try again.');
    }
    if (data?.error || !Array.isArray(data?.items)) {
      throw new ApiError(502, 'The video service returned an unexpected response. Please try again.');
    }

    const result = {
      items: data.items,
      nextPageToken: typeof data.nextPageToken === 'string' ? data.nextPageToken : null,
    };
    if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value);
    cache.set(target.href, { expiresAt: Date.now() + CACHE_TTL, data: result });
    return result;
  }

  return async function youtubeHandler(req, res, next) {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith('/api/youtube/')) {
      if (next) return next();
      return sendJson(res, 404, { error: 'Not found.' });
    }
    try {
      if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        throw new ApiError(405, 'Only GET requests are supported.');
      }
      const target = upstreamUrl(url);
      if (!apiKey?.trim()) {
        throw new ApiError(503, 'Video service is not configured. Set RAPIDAPI_KEY on the server and restart it.');
      }
      const cached = cache.get(target.href);
      if (cached?.expiresAt > Date.now()) return sendJson(res, 200, cached.data);
      if (cached) cache.delete(target.href);

      // React StrictMode and simultaneous visitors share an in-flight request.
      if (!pending.has(target.href)) {
        pending.set(target.href, fetchYoutube(target).finally(() => pending.delete(target.href)));
      }
      sendJson(res, 200, await pending.get(target.href));
    } catch (error) {
      sendJson(res, error.status || 500, {
        error: error instanceof ApiError ? error.message : 'Unable to load videos. Please try again.',
      });
    }
  };
}
