// Node.js Local Web Server for GCP MLE Study Dashboard
// Runs a lightweight, zero-dependency HTTP server to serve files locally.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// MIME types mapper for correct browser execution
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.md': 'text/markdown; charset=utf-8',
  '.sql': 'text/plain; charset=utf-8',
  '.py': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  // Translate '/' to '/index.html'
  let reqUrl = req.url === '/' ? '/index.html' : req.url;
  
  // Strip URL query parameters or hash anchors
  reqUrl = reqUrl.split('?')[0].split('#')[0];
  
  // Resolve path safely
  const resolvedPath = path.normalize(path.join(__dirname, reqUrl));
  
  // Prevent directory traversal attacks
  if (!resolvedPath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Access Denied');
    return;
  }
  
  // Check if file exists
  fs.stat(resolvedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`File not found: ${reqUrl}`);
      return;
    }
    
    // Serve the file
    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    
    const readStream = fs.createReadStream(resolvedPath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`GCP MLE Certification Study Dashboard Web App`);
  console.log(`Server is running at: http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to terminate the server.`);
  console.log(`==================================================`);
});
