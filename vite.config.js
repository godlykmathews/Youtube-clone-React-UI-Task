import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createYoutubeHandler } from './server/youtube.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'RAPIDAPI_');
  const youtube = createYoutubeHandler({ apiKey: env.RAPIDAPI_KEY });

  return {
    plugins: [
      react(),
      {
        name: 'youtube-api',
        configureServer(server) {
          server.middlewares.use(youtube);
        },
        configurePreviewServer(server) {
          server.middlewares.use(youtube);
        },
      },
    ],
  };
});
