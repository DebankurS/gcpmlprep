# Google Cloud Professional Machine Learning Engineer Certification Study Companion

Welcome to your study repository for the **Google Cloud Professional Machine Learning Engineer (PMLE)** certification. This workspace is curated to cover the latest exam syllabus, including the new updates on **Generative AI** (Vertex AI Agent Builder, Model Garden, Vector Search) and **Responsible AI**, alongside core domains like MLOps, Custom Training, and Data Preparation.

---

## 📂 Repository Structure

The project is organized into structured study guides, production code snippets, and an interactive study dashboard:

```
gcpmleprep/
├── server.js                   # Zero-dependency Node.js server (static files + progress API)
├── docker-compose.yml          # Docker Compose config (runs server.js via node:22-alpine)
├── package.json                # Project configuration & start scripts
├── test.js                     # Automated test suite (database & HTTP integration)
├── AGENTS.md                   # Agent environment rules and instructions
├── data/                       # Runtime data (git-ignored)
│   └── progress.json           # Persisted user progress (created on first run)
└── public/                     # Web assets (served by server.js)
    ├── index.html              # Study Companion Dashboard UI
    ├── style.css               # Custom theme and dashboard layout styling
    ├── app.js                  # UI routing, progress tracker, and quiz engine
    ├── questions.js            # Database of 38 practice exam questions + rationales
    ├── docs/                   # Core Study Guides
    │   ├── 01_framing_and_architecture.md
    │   ├── 02_data_preparation.md
    │   ├── 03_model_development.md
    │   ├── 04_mlops_and_pipelines.md
    │   ├── 05_monitoring_and_responsible_ai.md
    │   ├── 06_generative_ai.md
    │   └── 07_agents_and_reasoning_engines.md
    └── src/snippets/           # Production-level GCP ML Code Templates
        ├── bqml_model.sql      # BigQuery ML training, eval, and Explainable AI
        ├── vertex_pipeline.py  # Vertex AI Pipeline definition using KFP SDK
        └── dataflow_pipeline.py # Apache Beam data preprocessing pipeline
```

---

## 🖥️ Interactive Study Dashboard

We have included a premium **Study Dashboard** to consolidate your notes, track your learning checklist, and test your knowledge.

### Features
1.  **Domain Progress Tracker:** Checklist of all core certification items. Checked topics are persisted server-side in `data/progress.json` and survive browser clears and container restarts.
2.  **Interactive Study Guides:** A reader interface allowing you to read all seven study guide files right from the app.
3.  **Mock Exam Quiz Center:** Practice test engine containing 38 custom exam-realistic questions. Supports a "Quick Practice" mode (10 random questions) and "Domain-Specific" modes. Provides instant feedback and detailed explanations for every question.
4.  **Cheat Sheets:** Quick-reference comparison charts (e.g. database choice, metrics selection, drift vs. skew).
5.  **Code Playground:** Built-in viewer for copying and reviewing standard GCP ML code snippets.

### How to Run the Dashboard

#### Docker Compose
```bash
docker compose up
```
Navigate to **`http://localhost:3000`**. Stop with `docker compose down`.

---

## 🧪 Running Automated Tests

To run the automated suite testing database integrity, file availability, and server endpoints:
```bash
npm test
```

---

## 📅 Recommended Study Plans

Choose a schedule based on your timeline and prior GCP/ML experience:

### 🚀 14-Day Intensive Plan (For experienced ML Engineers)
*   **Day 1-2:** Review [Domain 1 Guide](./public/docs/01_framing_and_architecture.md) & practice framing classification/regression problems.
*   **Day 3-4:** Review [Domain 2 Guide](./public/docs/02_data_preparation.md) & analyze [Dataflow template](./public/src/snippets/dataflow_pipeline.py).
*   **Day 5-6:** Review [Domain 3 Guide](./public/docs/03_model_development.md) & understand Vizier and distributed strategies.
*   **Day 7-8:** Review [Domain 4 Guide](./public/docs/04_mlops_and_pipelines.md) & understand KFP vs. TFX and traffic splitting.
*   **Day 9-10:** Review [Domain 5 Guide](./public/docs/05_monitoring_and_responsible_ai.md) & understand drift vs. skew.
*   **Day 11-12:** Review [Domain 6 Guide](./public/docs/06_generative_ai.md) & study RAG vs. Fine-tuning models.
*   **Day 13-14:** Run full Mock Exams in the Quiz Center, review missed questions, and finalize cheat sheets.

### 📚 30-Day Comprehensive Plan (For standard preparation)
*   **Week 1:** Problem Framing & Architecture (Domain 1). Complete related Qwiklabs on Vertex AI AutoML and BigQuery ML.
*   **Week 2:** Data Ingestion & Engineering (Domain 2). Learn Apache Beam syntax and Feature Store setups.
*   **Week 3:** Custom Model Training & Hyperparameter Tuning (Domain 3). Build custom containers and run Vertex custom jobs.
*   **Week 4:** MLOps, Deployments, and Generative AI (Domain 4, 5, 6). Run mock quizzes daily, check Explainable AI parameters, and review safety guidelines for foundation models.

---

## 🛠️ Utilizing Code Snippets

*   **BigQuery ML:** Review [bqml_model.sql](./public/src/snippets/bqml_model.sql) to see how BQML encapsulates preprocessing within the model using the `TRANSFORM` clause, preventing serving skew.
*   **Vertex Pipelines:** Review [vertex_pipeline.py](./public/src/snippets/vertex_pipeline.py) for the syntax of composing components (`@dsl.component`) and compiling a pipeline using the Kubeflow Pipelines (KFP) SDK.
*   **Dataflow:** Review [dataflow_pipeline.py](./public/src/snippets/dataflow_pipeline.py) to study the structure of custom `DoFn` mappings and setting up execution runners.

Good luck with your preparation!
