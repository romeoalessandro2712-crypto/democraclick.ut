// tools/serve.mjs — preview the production build with its real headers (CSP, cache) and gzip.
//   node tools/serve.mjs dist/site 8080
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';

const root = path.resolve(process.argv[2] || 'dist/site');
const port = Number(process.argv[3] || 8080);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.map': 'application/json' };

// minimal _headers parser (Netlify syntax): "path" lines followed by indented "Name: value" lines
async function loadHeaders() {
  const rules = [];
  try {
    const txt = await fs.readFile(path.join(root, '_headers'), 'utf8');
    let cur = null;
    for (const line of txt.split('\n')) {
      if (!line.trim()) continue;
      if (!/^\s/.test(line)) { cur = { pat: line.trim(), h: {} }; rules.push(cur); }
      else if (cur) { const i = line.indexOf(':'); cur.h[line.slice(0, i).trim()] = line.slice(i + 1).trim(); }
    }
  } catch (e) { /* no headers file */ }
  return rules;
}
const match = (pat, p) => (pat.endsWith('/*') ? p.startsWith(pat.slice(0, -1)) : pat === p);

const rules = await loadHeaders();
http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(root, p);
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    let body = await fs.readFile(file);
    const headers = { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' };
    const urlPath = p === '/index.html' ? '/' : p;
    for (const r of rules) if (match(r.pat, urlPath) || match(r.pat, p)) Object.assign(headers, r.h);
    if (/gzip/.test(req.headers['accept-encoding'] || '') && /text|javascript|json|xml|svg|manifest/.test(headers['Content-Type'])) {
      body = zlib.gzipSync(body); headers['Content-Encoding'] = 'gzip'; headers.Vary = 'Accept-Encoding';
    }
    res.writeHead(200, headers); res.end(body);
  } catch (e) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); }
}).listen(port, () => console.log(`serving ${root} on http://localhost:${port}`));
