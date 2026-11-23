import assert from 'node:assert/strict';
import test from 'node:test';
import { formatPublishedAt, getVideo, normalizeVideo, searchVideos } from '../src/api/youtube.js';

const video = {
  id: { videoId: 'FHTbsZEJspU' },
  snippet: {
    title: 'React &amp; Material UI', channelTitle: 'Example channel',
    publishedAt: '2026-11-01T00:00:00Z', description: 'API-supplied description',
    thumbnails: { high: { url: 'https://i.ytimg.com/vi/FHTbsZEJspU/hqdefault.jpg' } },
  },
};

test('search uses the local API, preserves special characters and filters non-video entries', async (t) => {
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(new URL(url, 'http://localhost').searchParams.get('q'), 'React & UI + hooks');
    assert.ok(url.startsWith('/api/youtube/search?'));
    assert.equal(options.signal, controller.signal);
    assert.equal(options.headers, undefined, 'No credential belongs in a browser request');
    return Response.json({
      items: [video, { id: { channelId: 'channel' }, snippet: video.snippet }, null, { id: 'invalid' }],
      nextPageToken: 'page-two',
    });
  });
  const result = await searchVideos({ q: 'React & UI + hooks' }, controller.signal);
  assert.equal(result.videos.length, 1);
  assert.equal(result.videos[0].title, 'React & Material UI');
  assert.equal(result.videos[0].thumbnail, video.snippet.thumbnails.high.url);
  assert.equal(result.nextPageToken, 'page-two');
});

test('partial video data is usable without inventing views or images', () => {
  const result = normalizeVideo({ id: 'FHTbsZEJspU', snippet: { title: 'Video', liveBroadcastContent: 'live' } });
  assert.equal(result.channel, 'Unknown channel');
  assert.equal(result.viewCount, undefined);
  assert.equal(result.thumbnail, null);
  assert.equal(result.isLive, true);
  assert.equal(normalizeVideo({ id: '../bad', snippet: { title: 'Video' } }), null);
});

test('details use the selected video ID and report unavailable videos', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(url, '/api/youtube/videos?id=FHTbsZEJspU');
    return Response.json({ items: [{ ...video, id: 'FHTbsZEJspU', statistics: { viewCount: '42' } }] });
  });
  assert.equal((await getVideo('FHTbsZEJspU')).viewCount, '42');
  globalThis.fetch = async () => Response.json({ items: [] });
  await assert.rejects(getVideo('FHTbsZEJspU'), /no longer available/);
});

test('client distinguishes no results, API errors, malformed responses, and cancellations', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ items: [] }));
  assert.deepEqual(await searchVideos({ q: 'nothing' }), { videos: [], nextPageToken: null });
  globalThis.fetch = async () => Response.json({ error: 'Request limit reached' }, { status: 429 });
  await assert.rejects(searchVideos({ q: 'React' }), /Request limit reached/);
  globalThis.fetch = async () => new Response('<html>Not the API</html>');
  await assert.rejects(searchVideos({ q: 'React' }), /unreadable response/);
  globalThis.fetch = async () => Response.json({ unexpected: true });
  await assert.rejects(searchVideos({ q: 'React' }), /unexpected response/);
  globalThis.fetch = async () => { throw new TypeError('Network failed'); };
  await assert.rejects(searchVideos({ q: 'React' }), /Check your connection/);
  globalThis.fetch = async () => { throw new DOMException('Canceled', 'AbortError'); };
  await assert.rejects(searchVideos({ q: 'React' }), { name: 'AbortError' });
});

test('published dates come from the API and tolerate missing/invalid values', () => {
  const now = Date.parse('2026-11-24T00:00:00Z');
  assert.equal(formatPublishedAt('2026-11-23T00:00:00Z', now), '1 day ago');
  assert.equal(formatPublishedAt('', now), '');
  assert.equal(formatPublishedAt('invalid', now), '');
});
