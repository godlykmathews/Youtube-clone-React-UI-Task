import { createYoutubeHandler } from '../../server/youtube.js';

// Vercel serves /api/youtube/search and /api/youtube/videos with the same
// server-only credential and handler used by the local development server.
export default createYoutubeHandler({ apiKey: process.env.RAPIDAPI_KEY });
