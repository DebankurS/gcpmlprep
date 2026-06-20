const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = path.join(__dirname, 'public');
const PROGRESS_FILE = path.join(__dirname, 'data', 'progress.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.md': 'text/markdown',
  '.sql': 'text/plain',
  '.py': 'text/plain',
};

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/api/progress') {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'GET') {
      const data = fs.existsSync(PROGRESS_FILE)
        ? fs.readFileSync(PROGRESS_FILE, 'utf8')
        : '{"tracker":{},"scheduler":null}';
      res.writeHead(200);
      res.end(data);
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          JSON.parse(body);
          fs.writeFileSync(PROGRESS_FILE, body);
          res.writeHead(200);
          res.end('{"ok":true}');
        } catch {
          res.writeHead(400);
          res.end('{"error":"invalid json"}');
        }
      });
    } else {
      res.writeHead(405);
      res.end();
    }
    return;
  }

  const filePath = path.join(ROOT, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    res.writeHead(403); res.end(); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
