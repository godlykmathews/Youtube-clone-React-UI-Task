import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { loadEnv } from 'vite';
import { createYoutubeHandler } from './youtube.js';

const root = resolve('dist');
const env = loadEnv('production', process.cwd(), 'RAPIDAPI_');
const youtube = createYoutubeHandler({ apiKey: env.RAPIDAPI_KEY });
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

await stat(resolve(root, 'index.html')).catch(() => {
  console.error('Build the app with npm run build before running npm start.');
  process.exit(1);
});

const server = createServer(async (req, res) => {
  if (req.url.startsWith('/api/')) return youtube(req, res);
  try {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end();
    }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(`${root}${sep}`) || !(await stat(file)).isFile()) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, {
      'Content-Type': contentTypes[extname(file)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': extname(file) === '.html' ? 'no-cache' : 'public, max-age=3600',
    });
    if (req.method === 'HEAD') return res.end();
    createReadStream(file).on('error', () => res.destroy()).pipe(res);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, '0.0.0.0', () => console.log(`YouTube clone: http://localhost:${port}`));
