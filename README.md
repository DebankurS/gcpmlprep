# Google Cloud Professional Machine Learning Engineer Certification Study Companion

Welcome to your study repository for the **Google Cloud Professional Machine Learning Engineer (PMLE)** certification. This workspace is curated to cover the latest exam syllabus, including the new updates on **Generative AI** (Vertex AI Agent Builder, Model Garden, Vector Search) and **Responsible AI**, alongside core domains like MLOps, Custom Training, and Data Preparation.

---

## 📂 Repository Structure

The project is organized into structured study guides, production code snippets, and an interactive study dashboard:

```
gcpmleprep/
├── index.html                  # Study Companion Dashboard UI
├── style.css                   # Custom theme and dashboard layout styling
├── app.js                      # UI routing, local progress tracker, and quiz engine
├── questions.js                # Database of 30 practice exam questions + rationales
├── server.js                   # Zero-dependency local Node.js web server
├── package.json                # Project configuration & start scripts
├── test.js                     # Automated test suite (database & HTTP integration)
├── AGENTS.md                   # Agent environment rules and instructions
├── docs/                       # Core Study Guides
│   ├── 01_framing_and_architecture.md
│   ├── 02_data_preparation.md
│   ├── 03_model_development.md
│   ├── 04_mlops_and_pipelines.md
│   ├── 05_monitoring_and_responsible_ai.md
│   ├── 06_generative_ai.md
│   └── 07_agents_and_reasoning_engines.md # GCP AI Agents & Reasoning Engines study guide
└── src/snippets/               # Production-level GCP ML Code Templates
    ├── bqml_model.sql          # BigQuery ML training, eval, and Explainable AI
    ├── vertex_pipeline.py      # Vertex AI Pipeline definition using KFP SDK
    └── dataflow_pipeline.py    # Apache Beam data preprocessing pipeline
```

---

## 🖥️ Interactive Study Dashboard

We have included a premium **Study Dashboard** to consolidate your notes, track your learning checklist, and test your knowledge.

### Features
1.  **Domain Progress Tracker:** Checklist of all core certification items. Checked topics are persisted in your browser's local storage and update your overall completion scores.
2.  **Interactive Study Guides:** A reader interface allowing you to read all seven study guide files right from the app.
3.  **Mock Exam Quiz Center:** Practice test engine containing 30 custom exam-realistic questions. Supports a "Quick Practice" mode (10 random questions) and "Domain-Specific" modes. Provides instant feedback and detailed explanations for every question.
4.  **Cheat Sheets:** Quick-reference comparison charts (e.g. database choice, metrics selection, drift vs. skew).
5.  **Code Playground:** Built-in viewer for copying and reviewing standard GCP ML code snippets.

### How to Run the Dashboard
You can choose to run the companion dashboard in the following ways:

#### Option A: Node.js Web App Server (Recommended)
Start the local static HTTP dev server by running:
```bash
npm run dev
```
Then navigate to **`http://localhost:3000`** in your browser. This satisfies security sandbox models and allows dynamic fetching of markdown files and code playground scripts seamlessly.

#### Option B: Simple Python HTTP Server
If you prefer Python, you can run:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

#### Option C: Quick Launch (Offline File Protocol)
Simply double-click the [index.html](./index.html) file inside your explorer. All trackers and quizzes work offline via pre-embedded fallbacks.

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
*   **Day 1-2:** Review [Domain 1 Guide](./docs/01_framing_and_architecture.md) & practice framing classification/regression problems.
*   **Day 3-4:** Review [Domain 2 Guide](./docs/02_data_preparation.md) & analyze [Dataflow template](./src/snippets/dataflow_pipeline.py).
*   **Day 5-6:** Review [Domain 3 Guide](./docs/03_model_development.md) & understand Vizier and distributed strategies.
*   **Day 7-8:** Review [Domain 4 Guide](./docs/04_mlops_and_pipelines.md) & understand KFP vs. TFX and traffic splitting.
*   **Day 9-10:** Review [Domain 5 Guide](./docs/05_monitoring_and_responsible_ai.md) & understand drift vs. skew.
*   **Day 11-12:** Review [Domain 6 Guide](./docs/06_generative_ai.md) & study RAG vs. Fine-tuning models.
*   **Day 13-14:** Run full Mock Exams in the Quiz Center, review missed questions, and finalize cheat sheets.

### 📚 30-Day Comprehensive Plan (For standard preparation)
*   **Week 1:** Problem Framing & Architecture (Domain 1). Complete related Qwiklabs on Vertex AI AutoML and BigQuery ML.
*   **Week 2:** Data Ingestion & Engineering (Domain 2). Learn Apache Beam syntax and Feature Store setups.
*   **Week 3:** Custom Model Training & Hyperparameter Tuning (Domain 3). Build custom containers and run Vertex custom jobs.
*   **Week 4:** MLOps, Deployments, and Generative AI (Domain 4, 5, 6). Run mock quizzes daily, check Explainable AI parameters, and review safety guidelines for foundation models.

---

## 🛠️ Utilizing Code Snippets

*   **BigQuery ML:** Review [bqml_model.sql](./src/snippets/bqml_model.sql) to see how BQML encapsulates preprocessing within the model using the `TRANSFORM` clause, preventing serving skew.
*   **Vertex Pipelines:** Review [vertex_pipeline.py](./src/snippets/vertex_pipeline.py) for the syntax of composing components (`@dsl.component`) and compiling a pipeline using the Kubeflow Pipelines (KFP) SDK.
*   **Dataflow:** Review [dataflow_pipeline.py](./src/snippets/dataflow_pipeline.py) to study the structure of custom `DoFn` mappings and setting up execution runners.

Good luck with your preparation!
