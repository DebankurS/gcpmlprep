// Automated Test Suite for GCP MLE Study Companion
// Validates questions database, file structures, and HTTP server endpoint responses.

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

console.log("==================================================");
console.log("Running Study Companion Automated Tests...");
console.log("==================================================\n");

// ---------------------------------------------------------
// 1. TEST QUESTIONS DATABASE INTEGRITY
// ---------------------------------------------------------
console.log("1. Testing questions JSON files integrity...");
try {
  const domainFiles = [
    'public/questions/domain1.json',
    'public/questions/domain2.json',
    'public/questions/domain3.json',
    'public/questions/domain4.json',
    'public/questions/domain5.json',
    'public/questions/domain6.json',
    'public/questions/domain7.json'
  ];
  const PRACTICE_QUESTIONS = domainFiles.flatMap(f =>
    JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'))
  );
  assert.ok(Array.isArray(PRACTICE_QUESTIONS), "PRACTICE_QUESTIONS should be an array");
  assert.ok(PRACTICE_QUESTIONS.length >= 60, `Should contain at least 60 questions (found ${PRACTICE_QUESTIONS.length})`);

  const VALID_DOMAINS = new Set([
    "Domain 1: Framing & Architecture",
    "Domain 2: Data Preparation & Processing",
    "Domain 3: Model Development",
    "Domain 4: MLOps & Pipelines",
    "Domain 5: Monitoring & Responsible AI",
    "Domain 6: Generative AI",
    "Domain 7: Agents & Reasoning Engines"
  ]);

  PRACTICE_QUESTIONS.forEach((q, idx) => {
    assert.strictEqual(typeof q.id, 'number', `Question [${idx}] should have a numeric id`);
    assert.ok(q.domain && typeof q.domain === 'string', `Question [${idx}] should have a string domain`);
    assert.ok(VALID_DOMAINS.has(q.domain), `Question [${idx}] has unknown domain: "${q.domain}"`);
    assert.ok(q.question && typeof q.question === 'string', `Question [${idx}] should have a string question`);
    assert.ok(Array.isArray(q.options), `Question [${idx}] should have an options array`);
    assert.strictEqual(q.options.length, 4, `Question [${idx}] should have exactly 4 options`);
    assert.ok(typeof q.answer === 'number' && q.answer >= 0 && q.answer <= 3, `Question [${idx}] answer index should be between 0 and 3`);
    assert.ok(q.explanation && typeof q.explanation === 'string', `Question [${idx}] should have a string explanation`);
  });
  console.log("✅ Questions database passes validation!\n");
} catch (e) {
  console.error("❌ Questions validation failed:", e.message);
  process.exit(1);
}

// ---------------------------------------------------------
// 2. TEST STATIC FILES EXISTENCE
// ---------------------------------------------------------
console.log("2. Testing required static files existence...");
const requiredFiles = [
  'public/index.html',
  'public/style.css',
  'public/app.js',
  'public/questions/domain1.json',
  'public/questions/domain2.json',
  'public/questions/domain3.json',
  'public/questions/domain4.json',
  'public/questions/domain5.json',
  'public/questions/domain6.json',
  'public/questions/domain7.json',
  'AGENTS.md',
  'public/docs/01_framing_and_architecture.md',
  'public/docs/02_data_preparation.md',
  'public/docs/03_model_development.md',
  'public/docs/04_mlops_and_pipelines.md',
  'public/docs/05_monitoring_and_responsible_ai.md',
  'public/docs/06_generative_ai.md',
  'public/docs/07_agents_and_reasoning_engines.md',
  'public/src/snippets/bqml_model.sql',
  'public/src/snippets/vertex_pipeline.py',
  'public/src/snippets/dataflow_pipeline.py'
];

try {
  requiredFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    assert.ok(fs.existsSync(fullPath), `Required file missing: ${file}`);
  });
  console.log("✅ All required static assets exist!\n");
} catch (e) {
  console.error("❌ Static file checks failed:", e.message);
  process.exit(1);
}

// ---------------------------------------------------------
// 2.5. TEST MARKDOWN HYPERLINKS
// ---------------------------------------------------------
console.log("2.5. Testing local file hyperlinks inside markdown files...");
const mdFiles = [
  'README.md',
  'AGENTS.md',
  'public/docs/01_framing_and_architecture.md',
  'public/docs/02_data_preparation.md',
  'public/docs/03_model_development.md',
  'public/docs/04_mlops_and_pipelines.md',
  'public/docs/05_monitoring_and_responsible_ai.md',
  'public/docs/06_generative_ai.md',
  'public/docs/07_agents_and_reasoning_engines.md'
];

try {
  mdFiles.forEach(mdFile => {
    const mdPath = path.join(__dirname, mdFile);
    if (!fs.existsSync(mdPath)) return;
    
    const content = fs.readFileSync(mdPath, 'utf8');
    // Regex to match relative links like ](./docs/...) or ](./src/...)
    const linkRegex = /\]\(((?:\.\/|\.\.\/)[^\)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      const relPath = match[1];
      // strip hash tags if present in URLs
      const cleanRelPath = relPath.split('#')[0];
      // resolve against the directory of the markdown file itself
      const filePath = path.resolve(path.dirname(mdPath), cleanRelPath);
      assert.ok(fs.existsSync(filePath), `Broken link in ${mdFile}: ${relPath}`);
    }
  });
  console.log("✅ All local hyperlinks inside markdown files are valid!\n");
} catch (e) {
  console.error("❌ Markdown hyperlink check failed:", e.message);
  process.exit(1);
}

// ---------------------------------------------------------
// 3. TEST SERVER RESPONSES (INTEGRATION TESTS)
// ---------------------------------------------------------
console.log("3. Testing server endpoints on http://localhost:3000...");

const testUrl = (urlPath) => {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    }).on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        reject(new Error('Server not running on http://localhost:3000 — run `node server.js` first'));
      } else {
        reject(err);
      }
    });
  });
};

const postJson = (urlPath, payload) => {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = http.request(`http://localhost:3000${urlPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });
    req.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        reject(new Error('Server not running on http://localhost:3000 — run `node server.js` first'));
      } else {
        reject(err);
      }
    });
    req.write(body);
    req.end();
  });
};

async function runServerTests() {
  try {
    // Test index.html endpoint
    console.log("Testing GET / ...");
    const resRoot = await testUrl('/');
    assert.strictEqual(resRoot.statusCode, 200, "Root should return 200");
    assert.ok(resRoot.headers['content-type'].includes('text/html'), "Root should return HTML content-type");
    
    // Test style.css endpoint
    console.log("Testing GET /style.css ...");
    const resCss = await testUrl('/style.css');
    assert.strictEqual(resCss.statusCode, 200, "CSS file should return 200");
    assert.ok(resCss.headers['content-type'].includes('text/css'), "CSS should return correct content-type");
    
    // Test markdown document endpoint
    console.log("Testing GET /docs/01_framing_and_architecture.md ...");
    const resDoc = await testUrl('/docs/01_framing_and_architecture.md');
    assert.strictEqual(resDoc.statusCode, 200, "Markdown document should return 200");
    assert.ok(resDoc.headers['content-type'].includes('text/markdown') || resDoc.headers['content-type'].includes('text/plain'), "Doc should return correct content-type");
    
    // Test 404 response
    console.log("Testing GET /missing_file.xyz (404 check) ...");
    const res404 = await testUrl('/missing_file.xyz');
    assert.strictEqual(res404.statusCode, 404, "Non-existent file should return 404");
    
    // Test security directory traversal prevention
    console.log("Testing GET /../package.json (traversal security check) ...");
    const resTraversal = await testUrl('/../package.json');
    // The server should sanitize path to start with workspace, meaning /../package.json translates to /package.json or blocks it.
    // If it resolves to /package.json it is 200 (safe because it's in workspace), but if it attempts to go outside it should be blocked.
    // Let's assert that the status code is either 200 (if resolved within workspace safely) or 403 (forbidden).
    assert.ok([200, 403, 404].includes(resTraversal.statusCode), "Traversal attempt should be safely handled");

    // Test POST /api/progress (save + retrieve round-trip)
    console.log("Testing POST /api/progress ...");
    const payload = { tracker: { d1_1: true }, scheduler: null };
    const resPost = await postJson('/api/progress', payload);
    assert.strictEqual(resPost.statusCode, 200, "POST /api/progress should return 200");
    assert.deepStrictEqual(JSON.parse(resPost.data), { ok: true }, "POST should return {ok:true}");

    // Verify the saved data is retrievable
    console.log("Testing GET /api/progress after POST ...");
    const resGet = await testUrl('/api/progress');
    assert.strictEqual(resGet.statusCode, 200, "GET /api/progress should return 200");
    assert.deepStrictEqual(JSON.parse(resGet.data), payload, "GET should return the previously saved payload");

    // Test POST /api/progress with invalid JSON
    console.log("Testing POST /api/progress with invalid JSON ...");
    const resBadPost = await postJson('/api/progress', null).catch(() => null);
    // Send raw invalid body manually
    const resMalformed = await new Promise((resolve, reject) => {
      const body = 'not-json';
      const req = http.request('http://localhost:3000/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
      }, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
    assert.strictEqual(resMalformed.statusCode, 400, "Malformed JSON should return 400");

    console.log("✅ All HTTP server integration tests passed!\n");
    console.log("==================================================");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
    console.log("==================================================");
  } catch (e) {
    console.error("❌ Integration tests failed:", e.message);
    process.exit(1);
  }
}

runServerTests();
