# YouTube Clone — React, Material UI and RapidAPI

A responsive YouTube-inspired app that fetches videos from **[Youtube v3 on RapidAPI](https://rapidapi.com/ytdlfree/api/youtube-v31)**. The home feed, category filters, search results and video details use live API responses. There is no hard-coded video list or fallback demo feed.

Based on the API used in JavaScript Mastery's [YouTube clone tutorial](https://www.youtube.com/watch?v=FHTbsZEJspU) and its [source repository](https://github.com/adrianhajdin/project_youtube_clone).

## Run locally

Use Node.js 22 or newer.

```sh
npm install
cp .env.example .env.local
```

Subscribe to **Youtube v3 by ytdlfree** in RapidAPI, then copy the `X-RapidAPI-Key` from its endpoint example into `.env.local`:

```dotenv
RAPIDAPI_KEY=your_rapidapi_key_here
```

```sh
npm run dev
```

Open the local URL printed by Vite. Restart the server after changing the key. The required RapidAPI host is `youtube-v31.p.rapidapi.com`; keys subscribed only to a different YouTube API will not work with these endpoints.

The key stays on the server. Do **not** prefix it with `VITE_` or put it in React source: [Vite embeds prefixed environment values in the browser bundle](https://vite.dev/guide/env-and-mode). Local environment files are ignored by Git.

## Features

- Responsive React 18 and Material UI 5 layout.
- API-backed home feed and category filters, including live and recent uploads.
- Search with Enter or the search button, including a mobile search dialog.
- API-supplied titles, thumbnails, channels and publication dates.
- Load more results using the API's next-page token.
- In-app YouTube player using the selected API video ID, with fetched descriptions and view counts.
- Loading indicators, empty states, clear errors and manual retries.
- Cancellation of obsolete searches so slower responses cannot overwrite the current feed.

YouTube serves playback through its embedded player; RapidAPI supplies the video data. Playback still depends on the video's availability and the owner's embedding permissions. Account features such as subscriptions, uploads, notifications and likes are visual placeholders in this UI task.

## API flow

The browser calls the app's own `/api/youtube/search` and `/api/youtube/videos` endpoints. A server handler adds the required `X-RapidAPI-Key` and `X-RapidAPI-Host` headers and calls RapidAPI's `/search` or `/videos` endpoint. Only supported read-only requests are accepted.

The same handler runs in development, preview and production. It coalesces simultaneous identical requests, caches successful results for 60 seconds, and caps uncached upstream requests at 60 per minute per server process. Failed requests are not cached. This is a small demo quota guard; multiple production instances need a shared rate limiter if deployed at scale.

## Verify

```sh
npm test
npm run build
npm run preview
```

Automated tests use mocked RapidAPI responses and require no key. They cover request headers and encoding, pagination, video normalization, empty/malformed responses, subscription/quota errors, cancellation, caching and request limits.

With a subscribed key configured, check that the home feed loads, search for a term such as `React`, select a category, load another page, and open a video. Browser network requests should go to `/api/youtube/*` without an API key.

## Production

### Vercel

Import this repository into Vercel. The included `vercel.json` builds the Vite app and `api/youtube/[endpoint].js` runs the API proxy as a Vercel Node function. Add **`RAPIDAPI_KEY`** to the project's server environment variables for Production (and Preview if needed), then deploy or redeploy. Do not use a `VITE_` prefix.

### Node hosting

```sh
npm run build
npm start
```

The Node server serves `dist/` and the API on port `3000`, or the `PORT` environment variable. Set `RAPIDAPI_KEY` in the hosting provider's server environment. Use a host that runs Node; uploading `dist/` alone to GitHub Pages will not run the API proxy.

## Task submission

Submit the updated repository in μLearn's `web-development` channel with `#cl-react-youtube`:

```text
#cl-react-youtube
https://github.com/godlykmathews/Youtube-clone-React-UI-Task
```

This project is for educational use and is not affiliated with YouTube.
