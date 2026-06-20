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
