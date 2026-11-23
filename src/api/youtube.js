function decodeText(value) {
  if (typeof value !== 'string') return '';
  const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', '#39': "'" };
  return value.replace(/&(amp|quot|apos|lt|gt|#39);/g, (_, entity) => entities[entity]);
}

export function normalizeVideo(item) {
  const id = typeof item?.id === 'string' ? item.id : item?.id?.videoId;
  if (!/^[\w-]{11}$/.test(id || '') || !item?.snippet?.title) return null;
  const { snippet, statistics } = item;
  const thumbnails = snippet.thumbnails || {};
  const thumbnail = thumbnails.maxres?.url || thumbnails.standard?.url || thumbnails.high?.url
    || thumbnails.medium?.url || thumbnails.default?.url;

  return {
    id,
    title: decodeText(snippet.title),
    channel: decodeText(snippet.channelTitle) || 'Unknown channel',
    thumbnail: typeof thumbnail === 'string' && thumbnail.startsWith('https://') ? thumbnail : null,
    publishedAt: snippet.publishedAt || '',
    description: decodeText(snippet.description),
    isLive: snippet.liveBroadcastContent === 'live',
    viewCount: statistics?.viewCount,
  };
}

export function formatPublishedAt(value, now = Date.now()) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return '';
  const seconds = Math.max(0, (now - date.getTime()) / 1000);
  const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
  const unit = units.find(([, size]) => seconds >= size);
  if (!unit) return 'Just now';
  return new Intl.RelativeTimeFormat('en', { numeric: 'always' }).format(-Math.floor(seconds / unit[1]), unit[0]);
}

async function request(endpoint, params, signal) {
  let response;
  try {
    response = await fetch(`/api/youtube/${endpoint}?${new URLSearchParams(params)}`, { signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Could not load videos. Check your connection and try again.');
  }
  let data;
  try {
    data = await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('The video service returned an unreadable response. Please try again.');
  }
  if (!response.ok) throw new Error(data?.error || 'Could not load videos. Please try again.');
  if (!Array.isArray(data?.items)) throw new Error('The video service returned an unexpected response.');
  return data;
}

export async function searchVideos(params, signal) {
  const data = await request('search', params, signal);
  return {
    videos: data.items.map(normalizeVideo).filter(Boolean),
    nextPageToken: data.nextPageToken || null,
  };
}

export async function getVideo(id, signal) {
  const data = await request('videos', { id }, signal);
  const video = data.items.map(normalizeVideo).find((item) => item?.id === id);
  if (!video) throw new Error('This video is no longer available. Please choose another video.');
  return video;
}
