# Domain 4: MLOps & Pipelines

This study guide covers Domain 4 of the GCP Machine Learning Engineer Exam: MLOps practices, workflow orchestration, model hosting, and automation on Google Cloud.

---

## 1. Orchestration: Kubeflow Pipelines (KFP) vs. TFX

Vertex AI Pipelines is a serverless orchestration service that runs machine learning workflows. It supports two SDKs: Kubeflow Pipelines (KFP) and TensorFlow Extended (TFX).

```
[Ingest Data] --> [Preprocess] --> [Train Model] --> [Evaluate] --> [Register] --> [Deploy]
```

### KFP vs. TFX Comparison

| Feature | Kubeflow Pipelines (KFP) | TensorFlow Extended (TFX) |
| :--- | :--- | :--- |
| **Philosophy** | General-purpose, highly flexible. | Opinionated, production-grade, standardized. |
| **Core Language** | Python (orchestrates Docker containers). | Python (utilizes Beam and TF libraries). |
| **Components** | Custom components defined via Python functions or Docker images. | Standardized pre-built components (e.g., `ExampleGen`, `Transform`, `Trainer`, `Evaluator`, `Pusher`). |
| **Best For** | Multi-framework (PyTorch, Scikit-Learn, XGBoost, Custom). | Pure TensorFlow projects requiring extensive data validation and compliance. |

### Key TFX Components (Commonly Tested)
*   **ExampleGen:** Ingests raw data and splits it into training and evaluation sets.
*   **StatisticsGen & SchemaGen:** Calculates statistics and generates data schemas automatically.
*   **ExampleValidator:** Identifies anomalies in data schemas (e.g., missing features, type mismatches).
*   **Transform:** Applies preprocessing using `tf.Transform` (eliminates training-serving skew).
*   **Evaluator:** Analyzes model performance on a slice-by-slice basis (e.g., performance on "country=US") using TensorFlow Model Analysis (TFMA).
*   **Pusher:** Deploys the model to a serving target (e.g., Vertex AI Endpoint) if validation criteria are met.

---

## 2. Vertex AI Model Registry

The **Model Registry** is a central repository where you manage the lifecycle of your ML models.

### Key Features
*   **Versioning:** Register multiple versions under a single model name (e.g., `my_churn_model` version `1`, `2`, `3`).
*   **Aliases:** Assign tags like `@default` or `@champion` to route traffic dynamically without changing client-side code.
*   **Deployment Integration:** Deploy specific model versions directly to endpoints.

---

## 3. Vertex AI Endpoints & Online Serving

Vertex AI Endpoints host your models for real-time (online) predictions.

### Key Deployment Patterns
1.  **Traffic Splitting (Canary Deployments):**
    *   Allows you to deploy a new version (`Model B`) to the same endpoint as `Model A` and split traffic.
    *   *Example:* Route 90% of traffic to the stable `Model A` and 10% to the new `Model B`. Once verified, route 100% to `Model B`.
2.  **Autoscaling:**
    *   You configure the minimum and maximum node count (e.g., `min=1`, `max=10`).
    *   Vertex AI automatically scales nodes up or down based on CPU utilization or request throughput.
3.  **Private Endpoints (VPC Peering):**
    *   Peers the Vertex AI service network with your internal Virtual Private Cloud (VPC).
    *   **Exam Advantage:** Lowers request latency and ensures traffic does not travel over the public internet.

---

## 4. Continuous Training (CT) Automation

Continuous Training is the MLOps practice of automatically retraining models when performance degrades or new data arrives.

```
[Cloud Storage File Upload / Cloud Scheduler]
                       |
                 (Eventarc / Pub/Sub)
                       |
               [Cloud Functions]
                       |
        [Trigger Vertex AI Pipeline Run]
```

### Automation Architecture Options
*   **Schedule-based:** Use **Cloud Scheduler** to publish a message to a **Pub/Sub** topic on a cron schedule, which triggers a **Cloud Function** to launch a Vertex AI Pipeline.
*   **Event-based (Data Trigger):** When new files arrive in a **Cloud Storage** bucket, **Eventarc** triggers a **Cloud Function** to launch a Vertex AI Pipeline.
*   **Performance-based (Alert Trigger):** When **Vertex AI Model Monitoring** detects performance decay (via drift alerts), it publishes to Pub/Sub, triggering the pipeline.

---

## 5. Artifact Registry — Container Storage

**Artifact Registry** is the current standard for storing Docker container images on Google Cloud. It replaces the deprecated **Container Registry** (`gcr.io`).

| Feature | Artifact Registry | Container Registry (deprecated) |
| :--- | :--- | :--- |
| **Host** | `REGION-docker.pkg.dev/PROJECT/REPO/IMAGE` | `gcr.io/PROJECT/IMAGE` |
| **Multi-format** | Docker, Helm, npm, Maven, Python packages | Docker only |
| **VPC-SC support** | Yes | Limited |
| **IAM granularity** | Per-repository | Project-level only |

> **Exam trap:** All Vertex AI Custom Training job specs referencing container images should use `REGION-docker.pkg.dev/...` URIs, not `gcr.io/...`.

```bash
# Build and push to Artifact Registry
docker build -t us-central1-docker.pkg.dev/my-project/ml-images/trainer:v1 .
docker push us-central1-docker.pkg.dev/my-project/ml-images/trainer:v1
```

---

## 6. ML Metadata (Vertex ML Metadata)

**Vertex ML Metadata** automatically tracks the lineage of ML artifacts — datasets, models, metrics — produced by pipeline runs.

### Key Concepts
*   **Artifact:** Any ML resource (dataset, model checkpoint, evaluation result).
*   **Execution:** A step in the pipeline that consumed/produced artifacts.
*   **Context:** A logical grouping (e.g., one pipeline run) linking executions and artifacts together.
*   **Lineage Graph:** Visual trace showing which dataset produced which model, which evaluation passed which threshold.

### Exam Scenario
*   **Scenario:** Audit which training dataset and pipeline run produced the model currently deployed to production.
    *   *Solution:* Use **Vertex ML Metadata** lineage graph — trace back from the deployed model artifact through the pipeline execution to the source dataset artifact.

---

## 7. Vertex AI Experiments in MLOps

Beyond single-run tracking, Vertex AI Experiments integrates into pipeline workflows to compare model versions before registry promotion.

### Pipeline + Experiments Integration Pattern
```
[Pipeline Run 1: LR=0.001] --> [Vertex AI Experiments Run A] --> metrics logged
[Pipeline Run 2: LR=0.01]  --> [Vertex AI Experiments Run B] --> metrics logged
                                           |
                                   [Compare in Studio]
                                           |
                              [Promote best run to Model Registry]
```

*   Tag pipeline runs with experiment name: `pipeline_job.submit(experiment="q3-churn-tuning")`.
*   Retrieve best run programmatically: `experiment.get_top_runs(metric="val_auc", n=1)`.
