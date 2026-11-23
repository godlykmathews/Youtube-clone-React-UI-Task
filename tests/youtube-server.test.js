import assert from 'node:assert/strict';
import test from 'node:test';
import { createYoutubeHandler } from '../server/youtube.js';

async function call(handler, url = '/api/youtube/search?q=React', method = 'GET') {
  const result = { headers: {} };
  await handler({ url, method }, {
    setHeader(name, value) { result.headers[name] = value; },
    writeHead(status, headers) { result.status = status; Object.assign(result.headers, headers); },
    end(body) { result.body = JSON.parse(body); },
  });
  return result;
}

const reply = (data = { items: [] }, status = 200) => new Response(JSON.stringify(data), { status });

test('missing credentials return an actionable error without calling RapidAPI', async () => {
  const handler = createYoutubeHandler({ fetchImpl: () => assert.fail('Unexpected upstream request') });
  const result = await call(handler);
  assert.equal(result.status, 503);
  assert.match(result.body.error, /RAPIDAPI_KEY/);
});

test('search forwards query/pagination/headers, coalesces requests and caches results', async () => {
  let calls = 0;
  const handler = createYoutubeHandler({ apiKey: 'test-only-secret', fetchImpl: async (url, options) => {
    calls += 1;
    assert.equal(url.origin, 'https://youtube-v31.p.rapidapi.com');
    assert.equal(url.pathname, '/search');
    assert.equal(url.searchParams.get('q'), 'React & hooks + API');
    assert.equal(url.searchParams.get('pageToken'), 'page/2+=');
    assert.equal(url.searchParams.get('type'), 'video');
    assert.equal(url.searchParams.get('maxResults'), '24');
    assert.equal(url.searchParams.get('order'), 'date');
    assert.equal(url.searchParams.get('eventType'), 'live');
    assert.equal(url.searchParams.get('url'), null);
    assert.deepEqual(options.headers, {
      'X-RapidAPI-Key': 'test-only-secret',
      'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
    });
    assert.ok(options.signal instanceof AbortSignal);
    return reply({ items: [{ id: { videoId: 'FHTbsZEJspU' } }], nextPageToken: 'next-page' });
  } });
  const params = new URLSearchParams({
    q: 'React & hooks + API', pageToken: 'page/2+=', order: 'date',
    eventType: 'live', url: 'https://example.com',
  });
  const url = `/api/youtube/search?${params}`;
  const [first, second] = await Promise.all([call(handler, url), call(handler, url)]);
  assert.equal(first.status, 200);
  assert.deepEqual(first, second);
  assert.equal(first.body.nextPageToken, 'next-page');
  assert.equal(calls, 1, 'Concurrent requests should share a single upstream call');
  assert.deepEqual(await call(handler, url), first);
  assert.equal(calls, 1, 'Repeated requests should use the cache');
  assert.doesNotMatch(JSON.stringify(first), /test-only-secret/);
});

test('video details request the selected API video and real metadata', async () => {
  const handler = createYoutubeHandler({ apiKey: 'test-only-secret', fetchImpl: async (url) => {
    assert.equal(url.pathname, '/videos');
    assert.equal(url.searchParams.get('id'), 'FHTbsZEJspU');
    assert.equal(url.searchParams.get('part'), 'snippet,statistics,contentDetails');
    return reply({ items: [{ id: 'FHTbsZEJspU', statistics: { viewCount: '321' } }] });
  } });
  const result = await call(handler, '/api/youtube/videos?id=FHTbsZEJspU');
  assert.equal(result.body.items[0].statistics.viewCount, '321');
});

test('invalid input and unsupported routes never consume API quota', async () => {
  const handler = createYoutubeHandler({
    apiKey: 'test-only-secret', fetchImpl: () => assert.fail('Unexpected upstream request'),
  });
  for (const [url, status] of [
    ['/api/youtube/search?q=%20', 400],
    [`/api/youtube/search?q=${'a'.repeat(201)}`, 400],
    ['/api/youtube/search?q=React&order=invalid', 400],
    [`/api/youtube/search?q=React&pageToken=${'a'.repeat(501)}`, 400],
    ['/api/youtube/videos?id=bad', 400],
    ['/api/youtube/channels', 404],
    ['/api/unknown', 404],
  ]) assert.equal((await call(handler, url)).status, status, url);
  const result = await call(handler, '/api/youtube/search?q=React', 'POST');
  assert.equal(result.status, 405);
  assert.equal(result.headers.Allow, 'GET');
});

test('authentication, quota, upstream and timeout errors are sanitized and retryable', async () => {
  for (const [upstreamStatus, status, message] of [
    [401, 503, /subscription/], [403, 503, /subscription/],
    [429, 429, /limit/], [500, 502, /unavailable/],
  ]) {
    let attempts = 0;
    const handler = createYoutubeHandler({ apiKey: 'test-only-secret', fetchImpl: async () => {
      attempts += 1;
      return attempts === 1 ? reply({ error: 'test-only-secret' }, upstreamStatus) : reply();
    } });
    const result = await call(handler);
    assert.equal(result.status, status);
    assert.match(result.body.error, message);
    assert.doesNotMatch(result.body.error, /test-only-secret/);
    assert.equal((await call(handler)).status, 200, 'Failed requests must not be cached');
  }
  const timeout = createYoutubeHandler({ apiKey: 'test-only-secret', fetchImpl: () => {
    throw new DOMException('test-only-secret', 'TimeoutError');
  } });
  assert.equal((await call(timeout)).status, 504);
});

test('empty results stay empty and malformed upstream responses are errors', async () => {
  for (const data of [null, {}, { items: 'bad' }, { error: 'upstream error', items: [] }]) {
    const handler = createYoutubeHandler({ apiKey: 'test-only-secret', fetchImpl: async () => reply(data) });
    assert.equal((await call(handler)).status, 502);
  }
  const invalidJson = createYoutubeHandler({
    apiKey: 'test-only-secret', fetchImpl: async () => new Response('not json'),
  });
  assert.equal((await call(invalidJson)).status, 502);
  const empty = createYoutubeHandler({ apiKey: 'test-only-secret', fetchImpl: async () => reply() });
  assert.deepEqual((await call(empty)).body, { items: [], nextPageToken: null });
});

test('uncached request bursts are bounded to protect API quota', async () => {
  let calls = 0;
  const handler = createYoutubeHandler({
    apiKey: 'test-only-secret', fetchImpl: async () => { calls += 1; return reply(); },
  });
  for (let index = 0; index < 60; index += 1) {
    assert.equal((await call(handler, `/api/youtube/search?q=${index}`)).status, 200);
  }
  assert.equal((await call(handler, '/api/youtube/search?q=one-more')).status, 429);
  assert.equal(calls, 60);
  assert.equal((await call(handler, '/api/youtube/search?q=0')).status, 200);
});
