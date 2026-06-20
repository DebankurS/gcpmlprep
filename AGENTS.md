# AGENTS.md

## Setup commands
- Install dependencies: `npm install`
- Start local development server: `npm run dev`
- Run automated test suite: `npm test`

## Project structure
- `index.html` / `style.css` / `app.js` — single-page dashboard UI
- `questions.js` — quiz question bank (GCP PMLE topics)
- `server.js` — zero-dependency Node.js static file server
- `docs/` — study guides (01–07 topics, markdown)
- `src/snippets/` — GCP ML code templates

## Code style and conventions
- **Technologies**: Vanilla HTML, Vanilla CSS, pure JavaScript — no frameworks.
- **Node.js**: Zero-dependency server (`server.js`). Do not add npm dependencies.
- **Formatting**: GitHub-style markdown for all docs and responses.
- **Documentation**: Preserve all existing comments/docstrings unrelated to the change.
- **Links**: Use `file://` scheme for file/symbol links (e.g., `[app.js](file:///path/to/app.js)`).

## Fetching latest content
- Before editing anything that references GCP APIs, Vertex AI, or Cloud ML services: fetch the current official docs to verify API accuracy (GCP product names and SDK signatures change frequently).
- Before editing anything that references Claude Code or Anthropic APIs: use the `claude-api` skill or fetch current Anthropic docs — never rely on training-data knowledge for model IDs, pricing, or parameter names.

## Project context and guidelines
GCP Professional Machine Learning Engineer (PMLE) certification study companion. Interactive dashboard with progress tracking, quiz engine, and GCP ML code templates.

When adding or updating quiz questions in `questions.js`, verify answers against current GCP documentation — the PMLE exam tracks GCP product changes.
