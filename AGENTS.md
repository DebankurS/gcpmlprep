# AGENTS.md

## Setup commands
- Start server: `docker compose up -d`
- Stop server: `docker compose down`
- Run automated test suite: `docker compose up -d && npm test && docker compose down`

## Project structure
- `server.js` — zero-dependency Node.js HTTP server (serves `public/` + `/api/progress` GET/POST)
- `docker-compose.yml` — runs server.js via node:22-alpine on port 3000
- `package.json` — project configuration & scripts
- `test.js` — automated test suite
- `data/progress.json` — file-backed progress store (git-ignored, created at runtime)
- `public/` — all web assets (mounted read-only into container)
  - `index.html` / `style.css` / `app.js` — single-page dashboard UI
  - `questions/` — per-domain question banks (domain1.json … domain7.json); fetched async by `app.js` at startup
  - `docs/` — study guides (01–07 topics, markdown)
  - `src/snippets/` — GCP ML code templates

## Code style and conventions
- **Technologies**: Vanilla HTML, Vanilla CSS, pure JavaScript — no frameworks.
- **Server**: `server.js` (zero-dependency Node stdlib) via Docker Compose only. Do not add npm dependencies.
- **Persistence**: Progress stored in `progress.json` via `GET/POST /api/progress`. Do not use localStorage for tracker or scheduler state — theme preference only.
- **Formatting**: GitHub-style markdown for all docs and responses.
- **Documentation**: Preserve all existing comments/docstrings unrelated to the change.
- **Links**: Use repo-relative paths for file/symbol links (e.g., `[app.js](./public/app.js)`).
- **Gemini SDK**: All code snippets must use the `google-genai` SDK (`from google import genai`). The `vertexai.generative_models` module was removed on June 24, 2026 — never write code using it.

## Keeping AGENTS.md current
After any change to the repo, check if AGENTS.md is still accurate. Update it if you:
- Add or remove files referenced in the project structure
- Change setup commands, scripts, or server behaviour
- Introduce new code conventions (SDK versions, naming rules, formatting)
- Add new quiz domains or rename existing ones
- Change how tests validate the project (e.g., question count thresholds)

## Fetching latest content
- Before editing anything that references GCP APIs, Vertex AI, or Cloud ML services: fetch the current official docs to verify API accuracy (GCP product names and SDK signatures change frequently).
- Before editing anything that references Claude Code or Anthropic APIs: use the `claude-api` skill or fetch current Anthropic docs — never rely on training-data knowledge for model IDs, pricing, or parameter names.

## Project context and guidelines
GCP Professional Machine Learning Engineer (PMLE) certification study companion. Interactive dashboard with progress tracking, quiz engine, and GCP ML code templates.

When adding or updating quiz questions in `questions.js`, verify answers against current GCP documentation — the PMLE exam tracks GCP product changes.

## Quiz domain labels
`questions.js` covers 7 domains. Use exact strings to avoid mislabeling:
- `"Domain 1: Framing & Architecture"`
- `"Domain 2: Data Preparation & Processing"`
- `"Domain 3: Model Development"`
- `"Domain 4: MLOps & Pipelines"`
- `"Domain 5: Monitoring & Responsible AI"`
- `"Domain 6: Generative AI"`
- `"Domain 7: Agents & Reasoning Engines"`

Agent/ADK/Agent Engine/A2A questions → Domain 7. GenAI (RAG, fine-tuning, Gemini models, Vector Search) → Domain 6.

## Testing guidelines
- The project includes an automated test suite in [test.js](./test.js) run via `npm test`.
- **Always use Docker Compose** to spin up the server before running tests and tear it down after: `docker compose up -d && npm test && docker compose down`. Never run `node server.js` directly for testing.
- **Integrity**: Questions in [public/questions/](./public/questions/) (`domain1.json` … `domain7.json`) must collectively form an array of at least 30 questions (currently 38 questions).
- **Structure**: Each question must have a numeric `id`, a string `domain` matching one of the 7 exact labels, a string `question`, an array of exactly 4 `options`, a numeric `answer` index (0-3), and a string `explanation`.
- **Static Assets & Hyperlinks**: Tests verify the existence of all core files (HTML, CSS, JS, markdown, and templates) and ensure all local hyperlinks (`./docs/...`, etc.) inside markdown files are valid.
- **Server Endpoints**: Tests verify endpoint status codes (200 for index, CSS, docs), 404 for missing files, traversal security, and POST `/api/progress` round-trip.
