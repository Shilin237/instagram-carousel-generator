const http = require('node:http');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '../public');
const handler = require('../api/generate');
const headers = require('../vercel.json').headers[0].headers;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
const server = http.createServer(async (req, res) => {
  for (const { key, value } of headers) res.setHeader(key, value);
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/api/generate') {
    res.status = code => { res.statusCode = code; return res; };
    res.json = data => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); };
    try {
      const chunks = []; let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 16384) return res.status(413).json({ error: 'Request too large' });
        chunks.push(chunk);
      }
      req.body = JSON.parse(Buffer.concat(chunks).toString() || '{}');
      return await handler(req, res);
    } catch { return res.status(400).json({ error: 'Invalid request' }); }
  }
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { res.writeHead(400); return res.end('Invalid path'); }
  const filename = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : decoded));
  if (!filename.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  try {
    const data = await readFile(filename);
    res.setHeader('Content-Type', types[path.extname(filename)] || 'application/octet-stream');
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(process.env.PORT || 3200, '127.0.0.1');
