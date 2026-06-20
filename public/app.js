// GCP Machine Learning Engineer Study Dashboard - Application Logic

// =========================================================================
// 1. DATA AND CONSTANTS
// =========================================================================

// Official Exam Domains and Topics Checklist
const DOMAINS_CHECKLIST = [
  {
    id: 1,
    code: "D1",
    title: "Domain 1: Framing ML Problems & Architecting ML Solutions",
    subtitle: "Translating business challenges into ML solutions, defining metrics, and choosing products.",
    items: [
      { id: "d1_1", text: "Translate business challenges into ML problem types (regression, classification, clustering, anomaly detection, recommendation)." },
      { id: "d1_2", text: "Choose appropriate ML evaluation metrics (Precision, Recall, F1, RMSE, MAE, AUC-ROC) matching business constraints." },
      { id: "d1_3", text: "Select correct GCP ML service (Pre-trained APIs vs. BigQuery ML vs. Vertex AI AutoML vs. Vertex Custom Training)." },
      { id: "d1_4", text: "Analyze architectural trade-offs: cost, training time, deployment complexity, latency, and data movement." }
    ]
  },
  {
    id: 2,
    code: "D2",
    title: "Domain 2: Data Preparation & Processing",
    subtitle: "Inbound ETL pipelines, feature engineering, and managing data quality issues.",
    items: [
      { id: "d2_1", text: "Preprocess tabular and unstructured data in BigQuery and Cloud Storage." },
      { id: "d2_2", text: "Build scalable batch and stream data pipelines with Cloud Dataflow (Apache Beam) using Fixed/Sliding/Session windows." },
      { id: "d2_3", text: "Implement feature engineering and prevent training-serving skew using TensorFlow Transform (tf.Transform) graphs." },
      { id: "d2_4", text: "Design feature tables and fetch point-in-time features with Vertex AI Feature Store (Online vs. Offline storage)." },
      { id: "d2_5", text: "Mitigate data quality issues: missing data imputation, outlier clipping, and highly imbalanced datasets (SMOTE/weights)." }
    ]
  },
  {
    id: 3,
    code: "D3",
    title: "Domain 3: Model Development",
    subtitle: "Model building, distributed training, hyperparameter tuning, and evaluation.",
    items: [
      { id: "d3_1", text: "Develop models with TensorFlow, PyTorch, JAX, Scikit-learn, and XGBoost." },
      { id: "d3_2", text: "Configure Vertex AI Custom Training: choose between Google pre-built containers and custom Dockerfiles." },
      { id: "d3_3", text: "Implement distributed training strategies (tf.distribute.Mirrored, MultiWorkerMirrored, ParameterServer, TPU strategy)." },
      { id: "d3_4", text: "Configure Bayesian hyperparameter tuning jobs using Vertex AI Vizier with early stopping configurations." },
      { id: "d3_5", text: "Diagnose and remedy model training issues: address overfitting (regularization, dropout) and underfitting." }
    ]
  },
  {
    id: 4,
    code: "D4",
    title: "Domain 4: MLOps, Pipelines & Automation",
    subtitle: "Pipeline orchestration, model hosting, CI/CD, and continuous training automation.",
    items: [
      { id: "d4_1", text: "Build automated ML pipelines: compare Kubeflow Pipelines (KFP) and TensorFlow Extended (TFX) components." },
      { id: "d4_2", text: "Manage model versions, tags, and lifecycle states in Vertex AI Model Registry." },
      { id: "d4_3", text: "Host models on Vertex AI Endpoints: configure private endpoints (VPC peering), autoscaling, and traffic splitting." },
      { id: "d4_4", text: "Set up Continuous Training (CT) triggers: Eventarc, Pub/Sub, Cloud Functions, and Cloud Scheduler." }
    ]
  },
  {
    id: 5,
    code: "D5",
    title: "Domain 5: Monitoring, Optimization & Responsible AI",
    subtitle: "Operational monitoring, explainability methods, ethics, and data privacy.",
    items: [
      { id: "d5_1", text: "Configure Vertex AI Model Monitoring to detect training-serving skew and prediction drift (JS divergence, L1 distance, PSI)." },
      { id: "d5_2", text: "Implement Explainable AI (XAI) feature attributions: configure Sampled Shapley, Integrated Gradients, and XRAI." },
      { id: "d5_3", text: "Audit model fairness (Demographic parity, Equal opportunity) and author Model Cards for compliance." },
      { id: "d5_4", text: "Apply privacy practices: anonymization, Cloud DLP, and differential privacy principles." }
    ]
  },
  {
    id: 6,
    code: "D6",
    title: "Domain 6: Generative AI on Google Cloud",
    subtitle: "Foundation models, RAG architectures, model customization, grounding, and safety filters.",
    items: [
      { id: "d6_1", text: "Access and prototype foundation models inside Vertex AI Model Garden and Vertex AI Studio." },
      { id: "d6_2", text: "Design Retrieval-Augmented Generation (RAG) pipelines using Vertex AI Vector Search (Matching Engine)." },
      { id: "d6_3", text: "Differentiate customization paths: choose Prompt Engineering vs. Grounding vs. Supervised Fine-Tuning (SFT) vs. RLHF." },
      { id: "d6_4", text: "Implement Model Grounding with enterprise data sources (Vertex AI Search) and adjust content safety filters." },
      { id: "d6_5", text: "Build code-first agents with the ADK (Agent Development Kit) and deploy them to Vertex AI Agent Engine serverless runtime." },
      { id: "d6_6", text: "Design conversational agents with Agent Studio using playbooks, visual flows, and OpenAPI tools." },
      { id: "d6_7", text: "Configure persistent memory using short-term Sessions and long-term Memory Bank, or Firestore/Redis." },
      { id: "d6_8", text: "Implement multi-agent systems and agent-to-agent coordination using the A2A protocol." }
    ]
  }
];

// Offline fallbacks for notes content (to support direct double-clicks of index.html under CORS restrictions)
const NOTES_OFFLINE_FALLBACK = {
  "01_framing_and_architecture.md": `
    <h1>Domain 1: Framing ML Problems & Architecting ML Solutions</h1>
    <p>This study guide covers the foundational knowledge needed for Domain 1 of the GCP Machine Learning Engineer Exam: translating business challenges into ML problems, choosing metrics, and selecting the appropriate Google Cloud services.</p>
    <h2>1. Framing ML Problems</h2>
    <p>Before building a model, you must translate business goals into machine learning tasks.</p>
    <ul>
      <li><strong>Regression:</strong> Predicting continuous values (e.g., house prices, customer lifetime value).</li>
      <li><strong>Binary Classification:</strong> True/False, Churn/No Churn, Fraud/Legitimate.</li>
      <li><strong>Multi-class Classification:</strong> Single label from multiple categories (e.g., ticket categories).</li>
      <li><strong>Unsupervised:</strong> Clustering (segmentation), Anomaly Detection (intrusion/outliers).</li>
    </ul>
    <h2>2. ML Evaluation Metrics</h2>
    <p>The exam will present scenarios where you must select the appropriate metric based on the business cost of errors.</p>
    <ul>
      <li><strong>Precision:</strong> Minimize False Positives. Choose when false alarms are costly (e.g., Spam filters where you don't want legitimate emails blocked).</li>
      <li><strong>Recall:</strong> Minimize False Negatives. Choose when missing a positive case is critical (e.g., Medical screening or financial fraud).</li>
      <li><strong>F1-Score:</strong> Harmonic mean of Precision and Recall. Best for imbalanced datasets.</li>
      <li><strong>RMSE:</strong> Penalizes larger errors heavily due to squaring.</li>
    </ul>
    <h2>3. Selecting the Right GCP Architecture</h2>
    <ul>
      <li><strong>Pre-trained APIs (Lowest effort):</strong> Vision, Speech, Translation, Natural Language, Document AI. Use when no custom data/labels are needed.</li>
      <li><strong>BigQuery ML (Low-medium effort):</strong> Train models directly in BigQuery using standard SQL. <strong>Best when data is in BigQuery and you want to prevent data movement.</strong></li>
      <li><strong>Vertex AI AutoML (Medium effort):</strong> Code-free model development for tabular, image, text, and video data.</li>
      <li><strong>Vertex AI Custom Training (Highest effort/Flexibility):</strong> Write custom TensorFlow, PyTorch, or JAX models. Support for distributed training (GPUs/TPUs) and custom containers.</li>
    </ul>
  `,
  "02_data_preparation.md": `
    <h1>Domain 2: Data Preparation & Processing</h1>
    <p>This study guide covers Domain 2 of the GCP Machine Learning Engineer Exam: data pipeline design, feature engineering, and managing data quality.</p>
    <h2>1. Feature Engineering on Google Cloud</h2>
    <ul>
      <li><strong>BigQuery ML (TRANSFORM):</strong> Encapsulates preprocessing inside the model so the exact same SQL logic is applied during prediction (prevents training-serving skew).</li>
      <li><strong>Cloud Dataflow:</strong> Serverless batch and stream processing service for Apache Beam. Best for terabyte/petabyte scale preprocessing.</li>
      <li><strong>TensorFlow Transform (tf.Transform):</strong> Outputs preprocessing steps as a TensorFlow graph that is prepended directly to the model, completely preventing training-serving skew.</li>
    </ul>
    <h2>2. Cloud Dataflow & Apache Beam</h2>
    <ul>
      <li><strong>PCollection:</strong> Distributed dataset representation.</li>
      <li><strong>PTransform:</strong> A data processing step (e.g. ParDo, Map).</li>
      <li><strong>Fixed Windows:</strong> Static, non-overlapping time intervals (e.g., every 5 minutes).</li>
      <li><strong>Sliding Windows:</strong> Overlapping intervals (e.g., last 10 minutes evaluated every 1 minute).</li>
      <li><strong>Side Inputs:</strong> Auxiliary data read into memory during transforms for lookups.</li>
    </ul>
    <h2>3. Vertex AI Feature Store</h2>
    <p>A central catalog to organize, store, and serve ML features. Prevents skew by serving identical feature values at training (offline store - BigQuery) and inference (online store - Bigtable/Redis). Supports <strong>Point-in-Time Joins (Time Travel)</strong> to prevent data leakage.</p>
    <h2>4. Imbalanced Datasets</h2>
    <p>Remedies include: Downsampling (sub-sampling majority), Upsampling (SMOTE), or Class Weights (penalize minority errors). <strong>Never use accuracy</strong>; use Precision, Recall, or F1-Score.</p>
  `,
  "03_model_development.md": `
    <h1>Domain 3: Model Development</h1>
    <p>This study guide covers Domain 3 of the GCP Machine Learning Engineer Exam: building, training, tuning, and evaluating custom ML models on Google Cloud.</p>
    <h2>1. Vertex AI Custom Training</h2>
    <ul>
      <li><strong>Pre-built Containers:</strong> Google-maintained Docker containers with standard frameworks (TensorFlow, PyTorch, Scikit-learn). Use these by default to reduce operational overhead.</li>
      <li><strong>Custom Containers:</strong> Required only for non-standard system dependencies or custom private libraries.</li>
    </ul>
    <h2>2. Distributed Training Strategies</h2>
    <ul>
      <li><strong>MirroredStrategy:</strong> Single VM, multi-GPU. Replicates weights across all local GPUs.</li>
      <li><strong>MultiWorkerMirroredStrategy:</strong> Replicates weights across multiple VMs, multi-GPU.</li>
      <li><strong>ParameterServerStrategy:</strong> Separate Parameter Servers (store weights) and Workers (compute gradients). Best for extremely large models.</li>
      <li><strong>TPUStrategy:</strong> Specifically designed to run model training on Google TPU pods.</li>
    </ul>
    <h2>3. Hyperparameter Tuning with Vertex AI Vizier</h2>
    <p>A black-box optimization service utilizing <strong>Bayesian Optimization</strong> (probability models select next parameters). Extremely sample-efficient compared to Grid Search. Supports automatic early stopping for poorly performing trials.</p>
    <h2>4. Overfitting vs. Underfitting</h2>
    <ul>
      <li><strong>Overfitting (High Variance):</strong> Low training error, high validation error. Remedy: Add L1/L2 regularization, dropout, early stopping, reduce complexity, or collect more data.</li>
      <li><strong>Underfitting (High Bias):</strong> High training error, high validation error. Remedy: Increase complexity (layers/parameters), add features, reduce regularization, or train longer.</li>
    </ul>
  `,
  "04_mlops_and_pipelines.md": `
    <h1>Domain 4: MLOps & Pipelines</h1>
    <p>This study guide covers Domain 4 of the GCP Machine Learning Engineer Exam: MLOps practices, workflow orchestration, model hosting, and automation on Google Cloud.</p>
    <h2>1. Kubeflow Pipelines (KFP) vs. TFX</h2>
    <ul>
      <li><strong>KFP:</strong> Highly flexible, framework-agnostic (PyTorch, Scikit-learn). Custom steps defined by Python functions or containers.</li>
      <li><strong>TFX:</strong> Highly opinionated, production-grade, TF-specific. Standardized components: ExampleGen (ingest), ExampleValidator (schema check), Transform (tf.Transform), Evaluator (TFMA evaluation), Pusher (deploy).</li>
    </ul>
    <h2>2. Vertex AI Model Registry</h2>
    <p>Central repository to manage model versions and assign aliases (e.g. @champion, @challenger) to route traffic dynamically without changing client API calls.</p>
    <h2>3. Vertex AI Endpoints</h2>
    <ul>
      <li><strong>Traffic Splitting (Canary Deployments):</strong> Route e.g. 95% of traffic to stable v1 and 5% to v2 on the same endpoint to verify performance.</li>
      <li><strong>Autoscaling:</strong> Node scaling (min/max) based on CPU usage target.</li>
      <li><strong>Private Endpoints:</strong> Uses VPC Network Peering to prevent traffic traveling over the public internet, reducing latency.</li>
    </ul>
    <h2>4. Continuous Training (CT) Automation</h2>
    <ul>
      <li><strong>Event-based:</strong> New file uploaded to GCS -> Eventarc -> Cloud Function -> Run Vertex Pipeline.</li>
      <li><strong>Schedule-based:</strong> Cloud Scheduler -> Pub/Sub -> Cloud Function -> Run Vertex Pipeline.</li>
      <li><strong>Performance-based:</strong> Model Monitor detects drift/skew -> Pub/Sub -> Run Vertex Pipeline.</li>
    </ul>
  `,
  "05_monitoring_and_responsible_ai.md": `
    <h1>Domain 5: Monitoring, Optimization & Responsible AI</h1>
    <p>This study guide covers Domain 5 of the GCP Machine Learning Engineer Exam: model monitoring, Explainable AI, and Responsible AI principles.</p>
    <h2>1. Vertex AI Model Monitoring</h2>
    <ul>
      <li><strong>Training-Serving Skew:</strong> Difference between training dataset (stored baseline) and production requests. Fix: Audit preprocessing pipelines.</li>
      <li><strong>Prediction Drift:</strong> Changes in production data over time (compared against historical prediction logs). Fix: Retrain model on newer data.</li>
      <li><strong>Metrics:</strong> L1 statistical distance (categorical) and Jensen-Shannon divergence / Population Stability Index (numerical).</li>
    </ul>
    <h2>2. Vertex AI Explainable AI (XAI)</h2>
    <ul>
      <li><strong>Integrated Gradients:</strong> Best for differentiable neural networks (Computes gradients along a path from baseline).</li>
      <li><strong>Sampled Shapley:</strong> Best for tabular, non-differentiable models (XGBoost, Scikit-learn).</li>
      <li><strong>XRAI:</strong> Best for computer vision (generates pixel heatmaps showing region attributions).</li>
    </ul>
    <h2>3. Responsible AI & Ethics</h2>
    <ul>
      <li><strong>Fairness:</strong> Demographic Parity (equal approval likelihood across groups) vs. Equal Opportunity (equal recall/TPR across groups).</li>
      <li><strong>Model Cards:</strong> Core documentation containing intent, metrics, limits, and ethical considerations.</li>
      <li><strong>Privacy:</strong> Cloud DLP (de-identify PII), differential privacy (injecting mathematical noise).</li>
    </ul>
  `,
  "06_generative_ai.md": `
    <h1>Domain 6: Generative AI on Google Cloud</h1>
    <p>This study guide covers the newly updated Generative AI domain: foundations of LLMs, engineering options (RAG vs. Tuning), and Google Cloud GenAI tools.</p>
    <h2>1. GCP Generative AI Ecosystem</h2>
    <ul>
      <li><strong>Model Garden:</strong> Curated repository of foundation models (Gemini, Imagen, Chirp), open-source (Gemma, Llama), and partner models.</li>
      <li><strong>Vertex AI Studio:</strong> Interactive playground for text, chat, and multimodal prompt design and initiating tuning jobs.</li>
      <li><strong>Vertex AI Agent Builder:</strong> Orchestrates search and conversation engines grounded in enterprise data (GCS, BigQuery).</li>
    </ul>
    <h2>2. Engineering Choices (Prompt vs. RAG vs. Tuning)</h2>
    <ul>
      <li><strong>Prompt Engineering:</strong> Lowest cost, fast. Designing instructions and few-shot examples.</li>
      <li><strong>Retrieval-Augmented Generation (RAG):</strong> Medium cost. Grounding Gemini with documents indexed in a vector database (Vertex AI Vector Search). <strong>Best for dynamic, real-time private database queries to prevent hallucinations.</strong></li>
      <li><strong>Supervised Fine-Tuning (SFT):</strong> High cost. Adjusting weights on prompt-response pairs to teach specific formats (e.g. rigid JSON outputs) or custom tones.</li>
    </ul>
    <h2>3. Grounding and Safety Filters</h2>
    <ul>
      <li><strong>Grounding:</strong> Forcing LLMs to cite and stay within the boundaries of GCS, BigQuery, or Web Search results.</li>
      <li><strong>Safety Filters:</strong> Configurable block levels (e.g., BLOCK_MEDIUM_AND_ABOVE) for Harmful, Hate, Harassment, and Sexually Explicit content.</li>
    </ul>
  `,
  "07_agents_and_reasoning_engines.md": `
    <h1>GCP AI Agents & Reasoning Engines Study Guide</h1>
    <p>This guide covers the architectural design, implementation, and deployment of <strong>AI Agents and Reasoning Engines</strong> on Google Cloud Platform (GCP)—a critical topic in the updated GCP Professional Machine Learning Engineer exam.</p>
    <h2>1. Conceptual Framework: What is an Agent?</h2>
    <ul>
      <li><strong>Brain:</strong> The LLM (e.g., Gemini 2.0 Flash, Gemini 2.5 Pro) that performs reasoning.</li>
      <li><strong>Memory:</strong> Short-term (conversation history) and Long-term (distilled facts/profiles via Agent Engine Memory Bank).</li>
      <li><strong>Planning:</strong> Breaking down complex tasks into sub-goals (e.g., ReAct loop: Reasoning → Action → Observation).</li>
      <li><strong>Tools:</strong> External resources like SQL execution, APIs, or Cloud Functions.</li>
    </ul>
    <h2>2. Vertex AI Agent Builder: Platform Overview</h2>
    <ul>
      <li><strong>ADK (Agent Development Kit):</strong> Open-source, model-agnostic SDK (Python, Go, Java, TypeScript) for custom agent logic and multi-agent systems.</li>
      <li><strong>Agent Studio:</strong> Low-code visual canvas (Playbooks + Agent Designer) for conversational designers. Supports OpenAPI Tools and Data Store grounding.</li>
      <li><strong>Agent Engine (formerly Reasoning Engine):</strong> Serverless managed runtime handling autoscaling, IAM, Sessions, Memory Bank, Code Execution, and Tracing.</li>
    </ul>
    <h2>3. Agent Engine Capabilities (GA Status)</h2>
    <ul>
      <li><strong>Sessions (GA):</strong> Managed turn-by-turn state within a single conversation session. No external DB needed.</li>
      <li><strong>Memory Bank (GA):</strong> Persistent cross-session long-term memory. $0.25/1,000 stored events.</li>
      <li><strong>Code Execution (GA):</strong> Sandboxed execution of generated code inside the runtime.</li>
      <li><strong>Tracing:</strong> Unified Trace Viewer in Cloud Console for debugging agent reasoning paths.</li>
    </ul>
    <h2>4. Multi-Agent Systems & A2A Protocol</h2>
    <ul>
      <li><strong>A2A Protocol:</strong> Open standard (Linux Foundation) for Agent-to-Agent communication and supervisor-specialist coordination.</li>
      <li><strong>Hierarchical:</strong> Supervisor agent delegates sub-tasks to specialist agents.</li>
      <li><strong>Parallel:</strong> Multiple agents run concurrently; orchestrator merges results.</li>
      <li><strong>LangGraph on Agent Engine:</strong> Deploy stateful multi-agent graphs; Agent Engine handles the runtime.</li>
    </ul>
    <h2>5. Function Calling & Tool Use</h2>
    <p>Gemini outputs a structured JSON object (function name + args) — it does NOT execute the function. The client app executes the function, then sends back a <code>functionResponse</code> for the model to generate the final answer.</p>
    <h2>6. IAM & Security</h2>
    <ul>
      <li>Bind invoking service account to <strong>Vertex AI User</strong> (<code>roles/aiplatform.user</code>) on the Agent Engine resource.</li>
      <li>Agent Engine endpoints are private by default — require authenticated GCP service account tokens.</li>
    </ul>
    <h2>7. Exam Decision Matrix</h2>
    <ul>
      <li><strong>Conversational designer, GCS PDFs, REST APIs:</strong> Agent Studio (Playbooks + Data Stores + OpenAPI Tools).</li>
      <li><strong>Custom multi-agent LangGraph with code execution:</strong> ADK + Agent Engine with Code Execution.</li>
      <li><strong>Cross-session user preferences:</strong> Agent Engine Memory Bank (GA).</li>
      <li><strong>High-throughput real-time chat context:</strong> Memorystore (Redis).</li>
      <li><strong>Agent-to-agent coordination across teams:</strong> A2A Protocol.</li>
    </ul>
  `
};

const SNIPPET_OFFLINE_FALLBACK = {
  "bqml_model.sql": `-- BigQuery ML (BQML) Reference Template
-- This SQL script demonstrates the lifecycle of training, evaluating, and predicting
-- with a classification model in BigQuery using SQL-based preprocessing.

-- 1. CREATE AND TRAIN THE MODEL WITH PREPROCESSING
CREATE OR REPLACE MODEL \`your_project.your_dataset.churn_classifier\`
TRANSFORM(
  churned,
  ML.STANDARD_SCALER(customer_age) OVER() AS age_scaled,
  ML.STANDARD_SCALER(total_spend) OVER() AS spend_scaled,
  LOWER(country) AS country_clean,
  ML.QUANTILE_BUCKETIZER(tenure_months, 4) OVER() AS tenure_bucket
)
OPTIONS(
  MODEL_TYPE = 'LOGISTIC_REG',
  INPUT_LABEL_COLS = ['churned'],
  L2_REG = 0.1,
  DATA_SPLIT_METHOD = 'AUTO_SPLIT'
) AS
SELECT churned, customer_age, total_spend, country, tenure_months
FROM \`your_project.your_dataset.customer_transactions\`
WHERE churned IS NOT NULL;

-- 2. EVALUATE MODEL PERFORMANCE
SELECT * FROM ML.EVALUATE(
  MODEL \`your_project.your_dataset.churn_classifier\`,
  (SELECT churned, customer_age, total_spend, country, tenure_months 
   FROM \`your_project.your_dataset.customer_transactions_test\`)
);

-- 3. RUN BATCH PREDICTION
SELECT customer_id, predicted_churned, predicted_churned_probs[OFFSET(1)].prob AS probability_churned
FROM ML.PREDICT(
  MODEL \`your_project.your_dataset.churn_classifier\`,
  (SELECT customer_id, customer_age, total_spend, country, tenure_months 
   FROM \`your_project.your_dataset.customer_transactions_new\`)
);

-- 4. EXPLAIN PREDICTIONS (EXPLAINABLE AI)
SELECT customer_id, predicted_churned, top_feature_attributions
FROM ML.EXPLAIN_PREDICT(
  MODEL \`your_project.your_dataset.churn_classifier\`,
  (SELECT customer_id, customer_age, total_spend, country, tenure_months 
   FROM \`your_project.your_dataset.customer_transactions_new\`),
  STRUCT(3 AS top_k_features)
);`,

  "vertex_pipeline.py": `# Vertex AI Pipelines (KFP SDK v2) Reference Template
import os
from kfp import dsl
from kfp import compiler
from google.cloud import aiplatform

@dsl.component(base_image="python:3.10", packages_to_install=["pandas", "scikit-learn"])
def preprocess_data(input_gcs_path: str, preprocessed_dataset: dsl.Output[dsl.Dataset]):
    import pandas as pd
    # Clean data and save to output path
    raw_df = pd.DataFrame({"feature1": [1.0, 2.0], "label": [0, 1]})
    os.makedirs(preprocessed_dataset.path, exist_ok=True)
    raw_df.to_csv(os.path.join(preprocessed_dataset.path, "data.csv"), index=False)

@dsl.component(base_image="python:3.10", packages_to_install=["pandas", "scikit-learn", "joblib"])
def train_model(dataset: dsl.Input[dsl.Dataset], learning_rate: float, model_artifact: dsl.Output[dsl.Model]):
    import os, joblib, pandas as pd
    from sklearn.ensemble import RandomForestClassifier
    df = pd.read_csv(os.path.join(dataset.path, "data.csv"))
    model = RandomForestClassifier()
    model.fit(df[["feature1"]], df["label"])
    os.makedirs(model_artifact.path, exist_ok=True)
    joblib.dump(model, os.path.join(model_artifact.path, "model.joblib"))

@dsl.component(base_image="python:3.10", packages_to_install=["pandas", "scikit-learn", "joblib"])
def evaluate_model(dataset: dsl.Input[dsl.Dataset], model_artifact: dsl.Input[dsl.Model]) -> str:
    import os, joblib, pandas as pd
    from sklearn.metrics import accuracy_score
    df = pd.read_csv(os.path.join(dataset.path, "data.csv"))
    model = joblib.load(os.path.join(model_artifact.path, "model.joblib"))
    preds = model.predict(df[["feature1"]])
    accuracy = accuracy_score(df["label"], preds)
    return "deploy" if accuracy >= 0.8 else "reject"

@dsl.pipeline(name="vertex-ai-demo-pipeline", description="ML training pipeline")
def ml_pipeline(input_gcs_path: str = "gs://your-bucket-name/raw_data.csv"):
    preprocess_task = preprocess_data(input_gcs_path=input_gcs_path)
    train_task = train_model(dataset=preprocess_task.outputs["preprocessed_dataset"], learning_rate=0.01)
    eval_task = evaluate_model(dataset=preprocess_task.outputs["preprocessed_dataset"], model_artifact=train_task.outputs["model_artifact"])

if __name__ == "__main__":
    compiler.Compiler().compile(pipeline_func=ml_pipeline, package_path="vertex_ml_pipeline.json")
    print("Pipeline compiled successfully to vertex_ml_pipeline.json")`,

  "dataflow_pipeline.py": `# Cloud Dataflow (Apache Beam) Preprocessing Reference Template
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.options.pipeline_options import SetupOptions

class CleanAndParseRow(beam.DoFn):
    def process(self, element, delimiter=','):
        if element.startswith("customer_id") or not element.strip():
            return
        try:
            parts = element.split(delimiter)
            customer_id = parts[0].strip()
            age = int(parts[1].strip())
            spend = float(parts[2].strip())
            country = parts[3].strip()
            
            if age > 0 and spend >= 0:
                yield {
                    "customer_id": customer_id,
                    "age": age,
                    "spend": spend,
                    "country": country.upper(),
                    "is_high_spender": 1 if spend > 500.0 else 0
                }
        except (ValueError, IndexError):
            return

def run_pipeline(argv=None):
    options = PipelineOptions(argv)
    options.view_as(SetupOptions).save_main_session = True
    
    with beam.Pipeline(options=options) as p:
        (p 
         | "ReadFromSource" >> beam.io.ReadFromText("input_data.csv")
         | "CleanAndFormat" >> beam.ParDo(CleanAndParseRow())
         | "FormatCSVString" >> beam.Map(lambda r: f"{r['customer_id']},{r['age']},{r['spend']},{r['country']},{r['is_high_spender']}")
         | "WriteToGCS" >> beam.io.WriteToText("gs://your-bucket/preprocessed/output", file_name_suffix=".csv", shard_name_template=""))

if __name__ == "__main__":
    run_pipeline()`
};


// =========================================================================
// 2. STATE MANAGEMENT
// =========================================================================
let trackerState = {};
let quizState = {
  activeQuestions: [],
  currentIndex: 0,
  score: 0,
  hasAnswered: false,
  selectedOption: null
};
let _progressData = { tracker: {}, scheduler: null };

async function loadProgress() {
  try {
    const res = await fetch('/api/progress');
    if (res.ok) _progressData = await res.json();
  } catch (e) { /* server unavailable, use empty state */ }
}

async function saveProgress() {
  try {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(_progressData)
    });
  } catch (e) { /* silent */ }
}

// =========================================================================
// 3. INITIALIZATION & ROUTING
// =========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await loadProgress();
  initTrackerState();
  renderChecklist();
  updateProgressUI();
  setupRouting();
  setupQuizEvents();
  setupPlaygroundEvents();
  initStudyPlan();

  // Default: load the first notes doc
  loadNotesDoc("01_framing_and_architecture.md");
});

// Theme Management (Light / Dark Mode)
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem("gcp-mle-theme") || "dark";
  
  if (storedTheme === "light") {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
  
  themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("dark-theme")) {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem("gcp-mle-theme", "light");
    } else {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem("gcp-mle-theme", "dark");
    }
  });
}

// Router/Tab Switcher
function setupRouting() {
  const navItems = document.querySelectorAll(".nav-item");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const tabTitle = document.getElementById("current-tab-title");
  const tabDesc = document.getElementById("current-tab-desc");

  const tabMeta = {
    tracker: { title: "Study Tracker", desc: "Track your progress across the six official exam domains." },
    notes: { title: "Study Guides", desc: "Read structured, high-fidelity summaries of key exam topics." },
    quiz: { title: "Mock Exam Quiz", desc: "Test your readiness with timed certification-style questions." },
    cheatsheet: { title: "Cheat Sheets", desc: "Quick reference tables, decision metrics, and comparisons." },
    playground: { title: "Code Playground", desc: "Explore common GCP ML code templates and architectures." }
  };

  navItems.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      
      // Update sidebar nav buttons
      navItems.forEach(n => n.classList.remove("active"));
      btn.classList.add("active");
      
      // Switch active panels
      tabPanels.forEach(panel => {
        panel.classList.remove("active");
        if (panel.id === `tab-${tabId}`) {
          panel.classList.add("active");
        }
      });

      // Update header titles
      if (tabMeta[tabId]) {
        tabTitle.textContent = tabMeta[tabId].title;
        tabDesc.textContent = tabMeta[tabId].desc;
      }
    });
  });
}

// =========================================================================
// 4. TAB 1: TRACKER / CHECKLIST ENGINE
// =========================================================================
function initTrackerState() {
  if (_progressData.tracker && Object.keys(_progressData.tracker).length > 0) {
    trackerState = _progressData.tracker;
  } else {
    DOMAINS_CHECKLIST.forEach(domain => {
      domain.items.forEach(item => {
        trackerState[item.id] = false;
      });
    });
    saveTrackerState();
  }
}

function saveTrackerState() {
  _progressData.tracker = trackerState;
  saveProgress();
}

function renderChecklist() {
  const container = document.getElementById("domains-checklist");
  container.innerHTML = "";

  DOMAINS_CHECKLIST.forEach(domain => {
    // Calculate initial progress for this domain
    const totalItems = domain.items.length;
    const completedItems = domain.items.filter(item => trackerState[item.id]).length;
    const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    const accordion = document.createElement("div");
    accordion.className = "domain-accordion";
    accordion.id = `accordion-${domain.id}`;

    accordion.innerHTML = `
      <div class="domain-header" onclick="toggleAccordion(${domain.id})">
        <div class="domain-header-left">
          <div class="domain-badge">${domain.code}</div>
          <div class="domain-title-group">
            <h4>${domain.title}</h4>
            <span>${domain.subtitle}</span>
          </div>
        </div>
        <div class="domain-header-right">
          <div class="domain-progress">
            <div class="dp-bar-outer">
              <div class="dp-bar-inner" id="dp-inner-${domain.id}" style="width: ${pct}%;"></div>
            </div>
            <span id="dp-text-${domain.id}">${pct}%</span>
          </div>
          <i class="fa-solid fa-chevron-down arrow-icon"></i>
        </div>
      </div>
      <div class="domain-content">
        <div class="task-list" id="task-list-${domain.id}">
          <!-- Tasks dynamically listed below -->
        </div>
      </div>
    `;

    container.appendChild(accordion);

    const taskList = document.getElementById(`task-list-${domain.id}`);
    domain.items.forEach(item => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task-item";
      
      const isChecked = trackerState[item.id] ? "checked" : "";
      
      taskDiv.innerHTML = `
        <div class="task-checkbox-container">
          <input type="checkbox" id="${item.id}" ${isChecked} onchange="toggleTask('${item.id}', ${domain.id})">
          <div class="checkmark">
            <i class="fa-solid fa-check"></i>
          </div>
        </div>
        <span class="task-text">${item.text}</span>
      `;
      
      taskList.appendChild(taskDiv);
    });
  });
}

window.toggleAccordion = function(domainId) {
  const el = document.getElementById(`accordion-${domainId}`);
  el.classList.toggle("expanded");
};

window.toggleTask = function(taskId, domainId) {
  const checkbox = document.getElementById(taskId);
  trackerState[taskId] = checkbox.checked;
  saveTrackerState();
  
  // Recalculate domain progress
  const domain = DOMAINS_CHECKLIST.find(d => d.id === domainId);
  const totalItems = domain.items.length;
  const completedItems = domain.items.filter(item => trackerState[item.id]).length;
  const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  document.getElementById(`dp-inner-${domainId}`).style.width = `${pct}%`;
  document.getElementById(`dp-text-${domainId}`).textContent = `${pct}%`;
  
  updateProgressUI();
};

function updateProgressUI() {
  const total = Object.keys(trackerState).length;
  const completed = Object.values(trackerState).filter(v => v).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Update Widget
  document.getElementById("widget-pct").textContent = `${pct}%`;
  document.getElementById("widget-bar").style.width = `${pct}%`;
  
  // Update Stats row on Tracker view
  const statCompleted = document.getElementById("stat-completed-tasks");
  const statRate = document.getElementById("stat-completion-rate");
  if (statCompleted) statCompleted.textContent = `${completed} / ${total}`;
  if (statRate) statRate.textContent = `${pct}%`;
}

// =========================================================================
// 5. TAB 2: STUDY NOTES ENGINE
// =========================================================================
const notesMenuList = document.getElementById("notes-menu-list");
if (notesMenuList) {
  const listItems = notesMenuList.querySelectorAll("li");
  listItems.forEach(item => {
    item.addEventListener("click", () => {
      listItems.forEach(li => li.classList.remove("active"));
      item.classList.add("active");
      
      const docName = item.getAttribute("data-doc");
      loadNotesDoc(docName);
    });
  });
}

function loadNotesDoc(filename) {
  const bodyEl = document.getElementById("notes-view-body");
  const loaderEl = document.getElementById("notes-loading");
  
  loaderEl.classList.remove("hidden");
  bodyEl.classList.add("hidden");
  
  // Attempt to fetch the file from workspace (works if served via server)
  const fetchUrl = `./docs/${filename}`;
  fetch(fetchUrl)
    .then(response => {
      if (!response.ok) throw new Error("CORS or File Not Found");
      return response.text();
    })
    .then(markdown => {
      // Parse markdown to HTML (simple custom parser for basic elements)
      const html = parseSimpleMarkdown(markdown);
      bodyEl.innerHTML = html;
      loaderEl.classList.add("hidden");
      bodyEl.classList.remove("hidden");
    })
    .catch(err => {
      // Fallback to pre-loaded offline content if direct fetch fails (local file protocol)
      console.warn("Falling back to local offline markdown text due to CORS restrictions.", err);
      const fallbackHtml = NOTES_OFFLINE_FALLBACK[filename] || "<h3>Content not found offline.</h3>";
      bodyEl.innerHTML = fallbackHtml;
      loaderEl.classList.add("hidden");
      bodyEl.classList.remove("hidden");
    });
}

// Simple regex-based Markdown parser to render files correctly in the dashboard
function parseSimpleMarkdown(md) {
  let html = md;
  // Headers
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Lists (ordered and unordered)
  html = html.replace(/^[*\-] (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/^\d+\.\s+(.*?)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>[^\n]*<\/li>\n?)+)/g, '<ul>$1</ul>');
  // Tables (simplistic matching for our templates)
  // Replace table syntax with basic HTML tags
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '<table>';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHtml = '<table>';
      }
      const cols = line.split('|').slice(1, -1).map(c => c.trim());
      // Skip delimiter lines e.g. | :--- | :--- |
      if (cols.every(c => c.startsWith(':') || c.startsWith('-'))) continue;
      
      tableHtml += '<tr>' + cols.map(c => `<td>${c}</td>`).join('') + '</tr>';
      lines[i] = ''; // erase line
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</table>';
        lines[i] = tableHtml + '\n' + lines[i];
      }
    }
  }
  if (inTable) {
    tableHtml += '</table>';
    lines.push(tableHtml);
  }
  html = lines.join('\n');
  // Blockquotes / Alerts
  html = html.replace(/^> \[(.*?)\](.*?)$/gm, '<blockquote><strong>$1:</strong>$2</blockquote>');
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
  // Code Blocks
  html = html.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  // Inline Code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  // Mermaids (ignore rendering, just hide raw block)
  html = html.replace(/```mermaid([\s\S]*?)```/g, '<div class="hidden">$1</div>');
  
  return html;
}

// =========================================================================
// 6. TAB 3: MOCK EXAM QUIZ ENGINE
// =========================================================================
function setupQuizEvents() {
  document.getElementById("start-quiz-btn").addEventListener("click", startQuiz);
  document.getElementById("quiz-next-btn").addEventListener("click", nextQuestion);
  document.getElementById("restart-quiz-btn").addEventListener("click", resetQuizIntro);
  document.getElementById("quiz-review-tracker-btn").addEventListener("click", () => {
    document.querySelector('[data-tab="tracker"]').click();
  });
}

function startQuiz() {
  const mode = document.getElementById("quiz-mode").value;
  let pool = [...window.PRACTICE_QUESTIONS];

  // Filter based on mode selection
  if (mode === "quick") {
    // Select 10 random questions
    pool = shuffleArray(pool).slice(0, 10);
  } else if (mode.startsWith("d")) {
    const domainNum = mode.substring(1);
    pool = pool.filter(q => q.domain.includes(`Domain ${domainNum}`));
    if (pool.length === 0) {
      alert("No questions found for this domain yet.");
      return;
    }
  }

  quizState.activeQuestions = pool;
  quizState.currentIndex = 0;
  quizState.score = 0;
  quizState.hasAnswered = false;
  quizState.selectedOption = null;

  document.getElementById("quiz-intro-card").classList.add("hidden");
  document.getElementById("quiz-results-card").classList.add("hidden");
  document.getElementById("quiz-running-card").classList.remove("hidden");

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const question = quizState.activeQuestions[quizState.currentIndex];
  quizState.hasAnswered = false;
  quizState.selectedOption = null;

  // Question metadata
  document.getElementById("quiz-question-number").textContent = `Question ${quizState.currentIndex + 1} of ${quizState.activeQuestions.length}`;
  document.getElementById("quiz-question-domain").textContent = question.domain;
  document.getElementById("quiz-question-text").textContent = question.question;

  // Progress Bar
  const pct = Math.round((quizState.currentIndex / quizState.activeQuestions.length) * 100);
  document.getElementById("quiz-progress-fill").style.width = `${pct}%`;

  // Options
  const optionsContainer = document.getElementById("quiz-options-list");
  optionsContainer.innerHTML = "";

  question.options.forEach((optText, index) => {
    const letter = String.fromCharCode(65 + index); // A, B, C, D
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `
      <span class="option-letter">${letter}</span>
      <span class="option-text">${optText}</span>
    `;
    btn.addEventListener("click", () => selectOption(index));
    optionsContainer.appendChild(btn);
  });

  // Reset controls
  document.getElementById("quiz-next-btn").disabled = true;
  document.getElementById("quiz-next-btn").querySelector("span").textContent = 
    quizState.currentIndex === quizState.activeQuestions.length - 1 ? "Finish Quiz" : "Submit Answer";
  
  // Hide feedback box
  const feedbackBox = document.getElementById("quiz-feedback-box");
  feedbackBox.classList.add("hidden");
  feedbackBox.classList.remove("correct-fb", "wrong-fb");
  
  // Update scoreboard
  document.getElementById("quiz-score-indicator").textContent = `Score: ${quizState.score} / ${quizState.currentIndex}`;
}

function selectOption(index) {
  if (quizState.hasAnswered) return;

  const options = document.querySelectorAll(".option-btn");
  options.forEach((btn, idx) => {
    if (idx === index) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });

  quizState.selectedOption = index;
  document.getElementById("quiz-next-btn").disabled = false;
}

function nextQuestion() {
  const nextBtn = document.getElementById("quiz-next-btn");
  
  // If the user hasn't submitted their answer yet, check the choice
  if (!quizState.hasAnswered) {
    evaluateChoice();
    quizState.hasAnswered = true;
    nextBtn.querySelector("span").textContent = 
      quizState.currentIndex === quizState.activeQuestions.length - 1 ? "Show Results" : "Next Question";
  } else {
    // Proceed to next question or show results
    if (quizState.currentIndex < quizState.activeQuestions.length - 1) {
      quizState.currentIndex++;
      renderQuizQuestion();
    } else {
      showQuizResults();
    }
  }
}

function evaluateChoice() {
  const question = quizState.activeQuestions[quizState.currentIndex];
  const selectedIndex = quizState.selectedOption;
  const correctIndex = question.answer;
  const isCorrect = (selectedIndex === correctIndex);

  if (isCorrect) quizState.score++;

  const options = document.querySelectorAll(".option-btn");
  options.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correctIndex) {
      btn.classList.remove("selected");
      btn.classList.add("correct");
    } else if (idx === selectedIndex) {
      btn.classList.remove("selected");
      btn.classList.add("wrong");
    }
  });

  // Render feedback details
  const feedbackBox = document.getElementById("quiz-feedback-box");
  const heading = document.getElementById("feedback-heading");
  const explanation = document.getElementById("feedback-explanation");
  const icon = document.getElementById("feedback-icon");

  if (isCorrect) {
    feedbackBox.classList.add("correct-fb");
    heading.textContent = "Correct!";
    icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
  } else {
    feedbackBox.classList.add("wrong-fb");
    heading.textContent = `Incorrect (Correct Option: ${String.fromCharCode(65 + correctIndex)})`;
    icon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
  }

  explanation.textContent = question.explanation;
  feedbackBox.classList.remove("hidden");
  
  // Update scoreboard
  document.getElementById("quiz-score-indicator").textContent = `Score: ${quizState.score} / ${quizState.currentIndex + 1}`;
}

function showQuizResults() {
  document.getElementById("quiz-running-card").classList.add("hidden");
  document.getElementById("quiz-results-card").classList.remove("hidden");

  const total = quizState.activeQuestions.length;
  const finalScore = quizState.score;
  const pct = Math.round((finalScore / total) * 100);

  document.getElementById("results-score").textContent = `${finalScore} / ${total}`;
  document.getElementById("results-percentage").textContent = `${pct}%`;

  const feedbackTextEl = document.getElementById("results-feedback-text");
  if (pct >= 85) {
    feedbackTextEl.innerHTML = "<strong>Incredible!</strong> You scored in the master range. You have a deep grasp of Vertex AI, MLOps, and architecture designs. Keep reviewing and you're ready for the official exam!";
  } else if (pct >= 70) {
    feedbackTextEl.innerHTML = "<strong>Solid Effort!</strong> You passed. Focus a bit more on domains where you missed questions (refer to Study Guides) to secure a higher margin.";
  } else {
    feedbackTextEl.innerHTML = "<strong>Keep Studying!</strong> You missed the passing mark (typically ~70-75% equivalence). Review the domain checklists, read the cheat sheets, and try the quiz again.";
  }
}

function resetQuizIntro() {
  document.getElementById("quiz-results-card").classList.add("hidden");
  document.getElementById("quiz-intro-card").classList.remove("hidden");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// =========================================================================
// 7. TAB 5: CODE PLAYGROUND ENGINE
// =========================================================================
function setupPlaygroundEvents() {
  const buttons = document.querySelectorAll(".snippet-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const file = btn.getAttribute("data-file");
      loadCodeSnippet(file);
    });
  });

  // Copy Clipboard
  document.getElementById("copy-snippet-btn").addEventListener("click", () => {
    const codeText = document.getElementById("snippet-code-block").textContent;
    navigator.clipboard.writeText(codeText).then(() => {
      const copyBtn = document.getElementById("copy-snippet-btn");
      copyBtn.querySelector("span").textContent = "Copied!";
      copyBtn.querySelector("i").className = "fa-solid fa-check";
      
      setTimeout(() => {
        copyBtn.querySelector("span").textContent = "Copy";
        copyBtn.querySelector("i").className = "fa-regular fa-copy";
      }, 2000);
    });
  });

  // Load first snippet by default
  loadCodeSnippet("bqml_model.sql");
}

function loadCodeSnippet(filename) {
  const codeEl = document.getElementById("snippet-code-block");
  const nameEl = document.getElementById("current-snippet-name");
  
  nameEl.textContent = filename;
  
  // Set language highlights
  const ext = filename.split('.').pop();
  codeEl.className = ext === 'sql' ? 'language-sql' : 'language-python';
  
  // Attempt to fetch from GCS / Local workspace
  fetch(`./src/snippets/${filename}`)
    .then(response => {
      if (!response.ok) throw new Error("CORS or Snippet Not Found");
      return response.text();
    })
    .then(code => {
      codeEl.textContent = code;
    })
    .catch(err => {
      console.warn("Falling back to local offline code snippet text due to CORS restrictions.", err);
      const fallbackCode = SNIPPET_OFFLINE_FALLBACK[filename] || "# Snippet not found offline.";
      codeEl.textContent = fallbackCode;
    });
}

// =========================================================================
// 8. TAILORED STUDY PLAN SCHEDULER ENGINE
// =========================================================================

const STUDY_PLANS = {
  14: [
    { day: 1, title: "Problem Framing & Objectives", desc: "Translate business challenges into ML tasks and select appropriate metrics.", tasks: [ { id: "sp_14_1_1", text: "Read Framing & Architecture notes", action: "notes", target: "01_framing_and_architecture.md" }, { id: "sp_14_1_2", text: "Take Domain 1 mock questions 1-3", action: "quiz", target: "d1" } ] },
    { day: 2, title: "GCP ML Architecture Choice", desc: "Compare Pre-trained APIs, BigQuery ML, AutoML, and Custom Training setups.", tasks: [ { id: "sp_14_2_1", text: "Read Framing & Architecture notes", action: "notes", target: "01_framing_and_architecture.md" }, { id: "sp_14_2_2", text: "Analyze BQML TRANSFORM SQL structure", action: "playground", target: "bqml_model.sql" } ] },
    { day: 3, title: "Data Prep & Dataflow", desc: "Learn to design data preprocessing workflows using Cloud Dataflow at scale.", tasks: [ { id: "sp_14_3_1", text: "Read Data Preparation notes", action: "notes", target: "02_data_preparation.md" }, { id: "sp_14_3_2", text: "Study Dataflow pipeline code snippet", action: "playground", target: "dataflow_pipeline.py" } ] },
    { day: 4, title: "Feature Store & Data Quality", desc: "Understand Vertex AI Feature Store components and addressing data imbalances.", tasks: [ { id: "sp_14_4_1", text: "Read Data Preparation notes", action: "notes", target: "02_data_preparation.md" }, { id: "sp_14_4_2", text: "Take Domain 2 mock questions 4-6", action: "quiz", target: "d2" } ] },
    { day: 5, title: "Vertex Custom Training", desc: "Learn custom training, choosing containers, and distributed strategies.", tasks: [ { id: "sp_14_5_1", text: "Read Model Development notes", action: "notes", target: "03_model_development.md" }, { id: "sp_14_5_2", text: "Study distributed training strategies", action: "notes", target: "03_model_development.md" } ] },
    { day: 6, title: "Vizier & Model Tuning", desc: "Tune hyperparameters via Vizier Bayesian optimization and remedy overfitting.", tasks: [ { id: "sp_14_6_1", text: "Read Model Development notes", action: "notes", target: "03_model_development.md" }, { id: "sp_14_6_2", text: "Take Domain 3 mock questions 7-9", action: "quiz", target: "d3" } ] },
    { day: 7, title: "Mid-Term Review & Checkpoint", desc: "Review templates and run quick practice quizzes.", tasks: [ { id: "sp_14_7_1", text: "Review bqml_model.sql in playground", action: "playground", target: "bqml_model.sql" }, { id: "sp_14_7_2", text: "Take a 10-Question Quick Practice test", action: "quiz", target: "quick" } ] },
    { day: 8, title: "Vertex AI Pipelines & MLOps", desc: "Build orchestration pipelines using KFP or TFX SDKs.", tasks: [ { id: "sp_14_8_1", text: "Read MLOps & Pipelines notes", action: "notes", target: "04_mlops_and_pipelines.md" }, { id: "sp_14_8_2", text: "Analyze Vertex AI KFP pipeline script", action: "playground", target: "vertex_pipeline.py" } ] },
    { day: 9, title: "Model Registry & Endpoints", desc: "Understand model registry lifecycle, traffic splitting, and private endpoints.", tasks: [ { id: "sp_14_9_1", text: "Read MLOps & Pipelines notes", action: "notes", target: "04_mlops_and_pipelines.md" }, { id: "sp_14_9_2", text: "Take Domain 4 mock questions 10-12", action: "quiz", target: "d4" } ] },
    { day: 10, title: "Model Monitoring (Skew/Drift)", desc: "Set up Vertex AI Model Monitoring to detect statistical feature shifts.", tasks: [ { id: "sp_14_10_1", text: "Read Monitoring & Responsible AI notes", action: "notes", target: "05_monitoring_and_responsible_ai.md" }, { id: "sp_14_10_2", text: "Understand PSI and JS divergence metrics", action: "notes", target: "05_monitoring_and_responsible_ai.md" } ] },
    { day: 11, title: "Explainable AI & Ethics", desc: "Understand attribution methods (Shapley, Integrated Gradients) and fairness.", tasks: [ { id: "sp_14_11_1", text: "Read Monitoring & Responsible AI notes", action: "notes", target: "05_monitoring_and_responsible_ai.md" }, { id: "sp_14_11_2", text: "Take Domain 5 mock questions 13-15", action: "quiz", target: "d5" } ] },
    { day: 12, title: "Generative AI & Agents", desc: "Explore foundation models, Model Garden, and Vertex AI Agents & Reasoning Engines.", tasks: [ { id: "sp_14_12_1", text: "Read AI Agents & Engines notes", action: "notes", target: "07_agents_and_reasoning_engines.md" }, { id: "sp_14_12_2", text: "Understand ADK, Agent Engine, and Memory Bank", action: "notes", target: "07_agents_and_reasoning_engines.md" } ] },
    { day: 13, title: "RAG & Custom Model Tuning", desc: "Differentiate Prompt Engineering, RAG, Fine-Tuning, and RLHF paths.", tasks: [ { id: "sp_14_13_1", text: "Read Generative AI notes", action: "notes", target: "06_generative_ai.md" }, { id: "sp_14_13_2", text: "Take Domain 6 mock questions 16-18", action: "quiz", target: "d6" } ] },
    { day: 14, title: "Final Practice & Mock Exams", desc: "Simulate real exam scenarios and address final revision items.", tasks: [ { id: "sp_14_14_1", text: "Take a Full 30-Question Mock Exam", action: "quiz", target: "all" }, { id: "sp_14_14_2", text: "Review all Cheat Sheets comparison tables", action: "cheatsheet", target: "" } ] }
  ],
  28: [
    { day: 1, title: "ML Problem Framing", desc: "Translate business challenges into ML problems.", tasks: [ { id: "sp_28_1_1", text: "Read Framing & Architecture notes", action: "notes", target: "01_framing_and_architecture.md" } ] },
    { day: 2, title: "ML Metrics Choice", desc: "Define evaluation metrics matching business goals.", tasks: [ { id: "sp_28_2_1", text: "Read evaluation metrics details", action: "notes", target: "01_framing_and_architecture.md" } ] },
    { day: 3, title: "GCP Product Selection", desc: "Compare pre-trained APIs, AutoML, BQML, and custom.", tasks: [ { id: "sp_28_3_1", text: "Study product decision trees", action: "notes", target: "01_framing_and_architecture.md" } ] },
    { day: 4, title: "BigQuery ML Essentials", desc: "Learn about BigQuery ML SQL options and training.", tasks: [ { id: "sp_28_4_1", text: "Study BQML SQL code snippet", action: "playground", target: "bqml_model.sql" } ] },
    { day: 5, title: "Domain 1 Quiz Practice", desc: "Practice framing and architecture questions.", tasks: [ { id: "sp_28_5_1", text: "Take Domain 1 mock questions 1-3", action: "quiz", target: "d1" } ] },
    { day: 6, title: "Data Preparation Needs", desc: "Learn data formats and staging options on GCP.", tasks: [ { id: "sp_28_6_1", text: "Read Data Preparation notes", action: "notes", target: "02_data_preparation.md" } ] },
    { day: 7, title: "Week 1 Review", desc: "Summarize framing and data preparation needs.", tasks: [ { id: "sp_28_7_1", text: "Review week 1 notes", action: "notes", target: "01_framing_and_architecture.md" } ] },
    { day: 8, title: "Cloud Dataflow Batch", desc: "Learn to build batch preprocessing pipelines.", tasks: [ { id: "sp_28_8_1", text: "Read Dataflow & Apache Beam notes", action: "notes", target: "02_data_preparation.md" } ] },
    { day: 9, title: "Cloud Dataflow Streaming", desc: "Learn windowing strategies for streaming inputs.", tasks: [ { id: "sp_28_9_1", text: "Study Dataflow code snippet in playground", action: "playground", target: "dataflow_pipeline.py" } ] },
    { day: 10, title: "Training-Serving Skew", desc: "Prevent skew using tf.Transform preprocessing graphs.", tasks: [ { id: "sp_28_10_1", text: "Read tf.Transform notes", action: "notes", target: "02_data_preparation.md" } ] },
    { day: 11, title: "Vertex Feature Store", desc: "Manage and share features across different models.", tasks: [ { id: "sp_28_11_1", text: "Read Feature Store components", action: "notes", target: "02_data_preparation.md" } ] },
    { day: 12, title: "Handling Data Quality", desc: "Address class imbalances, outliers, and missing data.", tasks: [ { id: "sp_28_12_1", text: "Read data quality strategies", action: "notes", target: "02_data_preparation.md" } ] },
    { day: 13, title: "Domain 2 Quiz Practice", desc: "Test data prep and pipeline knowledge.", tasks: [ { id: "sp_28_13_1", text: "Take Domain 2 mock questions 4-6", action: "quiz", target: "d2" } ] },
    { day: 14, title: "Week 2 Review", desc: "Check progress on data preparation and pipelines.", tasks: [ { id: "sp_28_14_1", text: "Review data preparation sheets", action: "cheatsheet", target: "" } ] },
    { day: 15, title: "Custom Model Training", desc: "Learn custom model execution configurations.", tasks: [ { id: "sp_28_15_1", text: "Read Model Development notes", action: "notes", target: "03_model_development.md" } ] },
    { day: 16, title: "Distributed Training", desc: "Distribute training workloads on GPUs/TPUs.", tasks: [ { id: "sp_28_16_1", text: "Study Mirrored vs Parameter Server strategies", action: "notes", target: "03_model_development.md" } ] },
    { day: 17, title: "Vizier Hyperparameters", desc: "Configure Vizier hyperparameter tuning.", tasks: [ { id: "sp_28_17_1", text: "Read Vizier Bayesian tuning options", action: "notes", target: "03_model_development.md" } ] },
    { day: 18, title: "Overfitting Remedies", desc: "Implement regularization, dropout, and early stopping.", tasks: [ { id: "sp_28_18_1", text: "Review overfitting and underfitting remedies", action: "notes", target: "03_model_development.md" } ] },
    { day: 19, title: "Domain 3 Quiz Practice", desc: "Practice custom model training questions.", tasks: [ { id: "sp_28_19_1", text: "Take Domain 3 mock questions 7-9", action: "quiz", target: "d3" } ] },
    { day: 20, title: "Vertex AI Pipelines", desc: "Orchestrate pipelines using Kubeflow SDK.", tasks: [ { id: "sp_28_20_1", text: "Read MLOps & Pipelines notes", action: "notes", target: "04_mlops_and_pipelines.md" }, { id: "sp_28_20_2", text: "Analyze Vertex AI KFP pipeline", action: "playground", target: "vertex_pipeline.py" } ] },
    { day: 21, title: "Week 3 Review", desc: "Review model development and pipelines.", tasks: [ { id: "sp_28_21_1", text: "Take a 10-Question Quick Practice test", action: "quiz", target: "quick" } ] },
    { day: 22, title: "Model Deployments", desc: "Host endpoints, traffic split, and VPC peer.", tasks: [ { id: "sp_28_22_1", text: "Read endpoint deployments notes", action: "notes", target: "04_mlops_and_pipelines.md" } ] },
    { day: 23, title: "Model Monitoring", desc: "Track prediction drift and training-serving skew.", tasks: [ { id: "sp_28_23_1", text: "Read skew and drift monitoring notes", action: "notes", target: "05_monitoring_and_responsible_ai.md" } ] },
    { day: 24, title: "Explainable AI (XAI)", desc: "Examine Shapley, Integrated Gradients, XRAI.", tasks: [ { id: "sp_28_24_1", text: "Read Explainable AI methods", action: "notes", target: "05_monitoring_and_responsible_ai.md" } ] },
    { day: 25, title: "Responsible AI & Ethics", desc: "Audit fairness, demographic parity, and Model Cards.", tasks: [ { id: "sp_28_25_1", text: "Read fairness and privacy notes", action: "notes", target: "05_monitoring_and_responsible_ai.md" } ] },
    { day: 26, title: "AI Agents & Reasoning Engines", desc: "Explore ADK, Agent Studio, and Agent Engine managed runtime.", tasks: [ { id: "sp_28_26_1", text: "Read AI Agents & Engines notes", action: "notes", target: "07_agents_and_reasoning_engines.md" } ] },
    { day: 27, title: "RAG & Foundation Tuning", desc: "Understand RAG, Vector Search, fine-tuning, filters.", tasks: [ { id: "sp_28_27_1", text: "Study RAG vs SFT fine-tuning", action: "notes", target: "06_generative_ai.md" }, { id: "sp_28_27_2", text: "Take Domain 6 mock questions 16-18", action: "quiz", target: "d6" } ] },
    { day: 28, title: "Final Exam Simulation", desc: "Pass the full exam simulator.", tasks: [ { id: "sp_28_28_1", text: "Take the full 30-question Mock Exam", action: "quiz", target: "all" } ] }
  ]
};

let schedulerState = {
  activeDuration: 14,
  14: {},
  28: {},
  selectedDay: 1
};

function initStudyPlan() {
  if (_progressData.scheduler) {
    schedulerState = _progressData.scheduler;
  } else {
    [14, 28].forEach(duration => {
      STUDY_PLANS[duration].forEach(dayData => {
        dayData.tasks.forEach(task => {
          schedulerState[duration][task.id] = false;
        });
      });
    });
    saveSchedulerState();
  }

  // Set duration buttons and render
  setStudyPlanDuration(schedulerState.activeDuration || 14);
}

function saveSchedulerState() {
  _progressData.scheduler = schedulerState;
  saveProgress();
}

window.setStudyPlanDuration = function(duration) {
  schedulerState.activeDuration = duration;
  
  // Ensure selected day is within range
  if (schedulerState.selectedDay > duration) {
    schedulerState.selectedDay = 1;
  }
  
  saveSchedulerState();
  
  // Update toggle buttons active class
  document.getElementById("plan-btn-14").className = duration === 14 ? "btn-timeline-toggle active" : "btn-timeline-toggle";
  document.getElementById("plan-btn-28").className = duration === 28 ? "btn-timeline-toggle active" : "btn-timeline-toggle";
  
  renderSchedulerTimeline();
  renderSelectedDayDetails();
};

function renderSchedulerTimeline() {
  const track = document.getElementById("timeline-days-track");
  track.innerHTML = "";
  
  const duration = schedulerState.activeDuration;
  const daysData = STUDY_PLANS[duration];
  
  daysData.forEach(dayData => {
    const btn = document.createElement("button");
    btn.className = "timeline-day-btn";
    
    const isSelected = dayData.day === schedulerState.selectedDay;
    if (isSelected) btn.classList.add("active");
    
    // Check if all tasks for this day are completed
    const dayTasks = dayData.tasks;
    const allCompleted = dayTasks.every(t => schedulerState[duration][t.id]);
    if (allCompleted) btn.classList.add("completed");
    
    btn.innerHTML = `
      <span class="day-num">${dayData.day}</span>
      <span class="day-lbl">Day</span>
    `;
    
    btn.addEventListener("click", () => {
      schedulerState.selectedDay = dayData.day;
      saveSchedulerState();
      
      // Update active classes
      document.querySelectorAll(".timeline-day-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      renderSelectedDayDetails();
    });
    
    track.appendChild(btn);
  });
}

function renderSelectedDayDetails() {
  const detailBox = document.getElementById("timeline-day-detail-box");
  const duration = schedulerState.activeDuration;
  const dayNum = schedulerState.selectedDay;
  const dayData = STUDY_PLANS[duration].find(d => d.day === dayNum);
  
  if (!dayData) return;
  
  const dayTasks = dayData.tasks;
  const allCompleted = dayTasks.every(t => schedulerState[duration][t.id]);
  const statusLabel = allCompleted ? "Completed" : "In Progress";
  const badgeClass = allCompleted ? "tdd-status-badge completed" : "tdd-status-badge";
  
  let tasksHtml = "";
  dayTasks.forEach(task => {
    const isTaskDone = schedulerState[duration][task.id];
    const taskDoneClass = isTaskDone ? "tdd-task-item completed" : "tdd-task-item";
    const iconClass = isTaskDone ? "fa-solid fa-circle-check" : "fa-regular fa-circle";
    
    tasksHtml += `
      <li class="${taskDoneClass}" onclick="toggleSchedulerTask('${task.id}')">
        <i class="${iconClass}"></i>
        <span>${task.text}</span>
        ${task.action ? `<span style="font-size: 0.75rem; color: var(--primary); margin-left: auto;">[Launch <i class="fa-solid fa-arrow-right" style="font-size: 0.65rem; color: var(--primary); margin-left: 2px;"></i>]</span>` : ""}
      </li>
    `;
  });
  
  detailBox.innerHTML = `
    <div class="tdd-header">
      <h4>Day ${dayData.day}: ${dayData.title}</h4>
      <span class="${badgeClass}" id="tdd-badge">${statusLabel}</span>
    </div>
    <p class="tdd-description">${dayData.desc}</p>
    
    <ul class="tdd-tasks-list">
      ${tasksHtml}
    </ul>
    
    <div class="tdd-actions">
      <button class="btn-secondary" onclick="markAllDayTasks(${allCompleted ? 'false' : 'true'})">
        <i class="fa-solid ${allCompleted ? 'fa-xmark' : 'fa-check'}"></i>
        <span>${allCompleted ? 'Mark Day Incomplete' : 'Mark Day Complete'}</span>
      </button>
    </div>
  `;
  
  // Attach direct navigation events to task text/button clicks
  const taskElements = detailBox.querySelectorAll(".tdd-tasks-list li");
  taskElements.forEach((el, index) => {
    const task = dayTasks[index];
    const launchSpan = el.querySelector("span[style]");
    if (launchSpan) {
      launchSpan.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent toggling the task checkbox
        executeSchedulerAction(task.action, task.target);
      });
    }
  });
}

window.toggleSchedulerTask = function(taskId) {
  const duration = schedulerState.activeDuration;
  schedulerState[duration][taskId] = !schedulerState[duration][taskId];
  saveSchedulerState();
  
  renderSchedulerTimeline();
  renderSelectedDayDetails();
};

window.markAllDayTasks = function(shouldComplete) {
  const duration = schedulerState.activeDuration;
  const dayNum = schedulerState.selectedDay;
  const dayData = STUDY_PLANS[duration].find(d => d.day === dayNum);
  
  dayData.tasks.forEach(task => {
    schedulerState[duration][task.id] = shouldComplete;
  });
  
  saveSchedulerState();
  renderSchedulerTimeline();
  renderSelectedDayDetails();
};

function executeSchedulerAction(action, target) {
  if (action === "notes") {
    // Switch to notes tab
    document.querySelector('[data-tab="notes"]').click();
    
    // Find note link in menu and click it
    const menuItems = document.querySelectorAll("#notes-menu-list li");
    menuItems.forEach(li => {
      if (li.getAttribute("data-doc") === target) {
        li.click();
      }
    });
  } else if (action === "playground") {
    // Switch to playground tab
    document.querySelector('[data-tab="playground"]').click();
    
    // Find code snippet link and click it
    const snippetBtns = document.querySelectorAll("#snippet-btn-container button");
    snippetBtns.forEach(btn => {
      if (btn.getAttribute("data-file") === target) {
        btn.click();
      }
    });
  } else if (action === "quiz") {
    // Switch to quiz tab
    document.querySelector('[data-tab="quiz"]').click();
    
    // Adjust select mode value
    const modeSelect = document.getElementById("quiz-mode");
    if (modeSelect) {
      modeSelect.value = target;
      // Start the quiz automatically
      startQuiz();
    }
  } else if (action === "cheatsheet") {
    // Switch to cheatsheet tab
    document.querySelector('[data-tab="cheatsheet"]').click();
  }
}


