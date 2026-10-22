#!/usr/bin/env node
// Serves the dashboard locally: dashboard/index.html at /, plus site/index.json, site/runs/ and site/reports/.
// Usage: node scripts/serve-site.mjs [port]   (default 8765)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const port = Number(process.argv[2] ?? 8765);
const site = path.resolve('site');
const page = path.resolve('dashboard', 'index.html');
const types = { '.html': 'text/html', '.json': 'application/json', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webm': 'video/webm', '.zip': 'application/zip' };

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const file = urlPath === '/' || urlPath === '/index.html' ? page : path.join(site, urlPath.endsWith('/') ? `${urlPath}index.html` : urlPath);
    if (!file.startsWith(site) && file !== page) return res.writeHead(403).end();
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end('Not found');
    res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`Release quality dashboard: http://localhost:${port}/`));
