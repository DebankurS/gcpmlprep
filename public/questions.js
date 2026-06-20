// GCP Machine Learning Engineer Practice Questions Database
// This database is used by the Study Dashboard to run mock tests and review questions.

const PRACTICE_QUESTIONS = [
  // --- DOMAIN 1: FRAMING & ARCHITECTURE ---
  {
    id: 1,
    domain: "Domain 1: Framing & Architecture",
    question: "You want to build a model to predict whether a customer will churn next month. The historical customer transaction and profile data is stored in BigQuery. Your team consists of SQL analysts who have minimal experience with Python and deep learning frameworks. You need to deploy a model as quickly as possible with minimum data movement. What should you do?",
    options: [
      "Export the BigQuery tables to Cloud Storage, train a custom TensorFlow model using Vertex AI Custom Training, and deploy it to a Vertex AI Endpoint.",
      "Use BigQuery ML to train a logistic regression model directly on the data in BigQuery, and use ML.PREDICT to perform batch inference.",
      "Import the BigQuery data into Vertex AI AutoML Tabular to train a model, and deploy it to a Vertex AI Endpoint.",
      "Extract the data using a Cloud Dataflow pipeline, train an XGBoost model in Cloud Dataproc, and save the model to a GCS bucket."
    ],
    answer: 1,
    explanation: "BigQuery ML (BQML) is the best choice here because the data is already in BigQuery, the team consists of SQL analysts (so they can write standard SQL), and it avoids data egress (no data movement), satisfying all constraints of the scenario."
  },
  {
    id: 2,
    domain: "Domain 1: Framing & Architecture",
    question: "You are designing an ML system to identify credit card transactions that are fraudulent. The transaction volume is extremely high, and only 0.05% of transactions are fraudulent. The customer service department has a strict constraint: they do not want to block legitimate transactions because it damages customer trust, but they want to flag as many actual fraudulent cases as possible. What evaluation metric should you prioritize during model training?",
    options: [
      "Accuracy, because you want the model to be correct as often as possible across all transactions.",
      "Recall, because you want to capture every single instance of fraud regardless of false alarms.",
      "Precision, because you want to ensure that if a transaction is flagged as fraud, it is highly likely to be actual fraud, thus minimizing false alarms.",
      "Mean Absolute Error (MAE), because you want to measure the average magnitude of prediction errors."
    ],
    answer: 2,
    explanation: "The customer service department's constraint is that they do not want to block legitimate transactions (meaning they want to minimize False Positives). Precision is the ratio of True Positives to (True Positives + False Positives). Therefore, prioritizing Precision will minimize False Positives (legitimate transactions being flagged as fraud)."
  },
  {
    id: 3,
    domain: "Domain 1: Framing & Architecture",
    question: "You need to build a system that reads scanned invoices in PDF format, extracts the vendor name, invoice date, and total amount, and stores them in a database. Your team has no machine learning engineers and needs a solution with the absolute minimum development effort. Which GCP service should you use?",
    options: [
      "Train a custom CNN model on Vertex AI using custom containers to segment the text coordinates.",
      "Use the Vertex AI Vision API to perform OCR, and then write custom regex scripts to extract the fields.",
      "Use Document AI with a pre-trained Invoice Parser processor to extract structured invoice entities.",
      "Load the PDFs into BigQuery Object Tables and write a custom SQL query using BigQuery ML's ML.GENERATE_TEXT function."
    ],
    answer: 2,
    explanation: "Document AI provides pre-trained processors specifically for documents like invoices (Invoice Parser). It extracts key-value pairs (like vendor name, total, date) out of the box with zero custom model training, making it the lowest-effort solution."
  },

  // --- DOMAIN 2: DATA PREPARATION & PROCESSING ---
  {
    id: 4,
    domain: "Domain 2: Data Preparation & Processing",
    question: "You are building a custom TensorFlow model for predicting house prices. Your preprocessing includes scaling numerical variables and one-hot encoding categorical variables. During training, you apply these transforms in your Python script. However, in production, client requests sometimes send raw, unscaled values, causing incorrect predictions. This is an example of training-serving skew. How should you prevent this skew?",
    options: [
      "Use Cloud Dataflow to preprocess the data in batch before training, and write an equivalent Cloud Function in Node.js to preprocess requests before they hit the endpoint.",
      "Use TensorFlow Transform (tf.Transform) to define the preprocessing pipeline. Export the preprocessing graph and prepend it directly to the serving model, so the endpoint accepts raw data.",
      "Increase the regularization parameters (L1/L2) in the TensorFlow model to make it more robust to scale differences.",
      "Ask clients to implement the scaling equations directly in their client-side application before sending API requests."
    ],
    answer: 1,
    explanation: "TensorFlow Transform (tf.Transform) solves training-serving skew by exporting the preprocessing steps as a TensorFlow computational graph. This graph is exported together with the model, meaning the model endpoint accepts raw inputs and performs the exact same preprocessing under the hood."
  },
  {
    id: 5,
    domain: "Domain 2: Data Preparation & Processing",
    question: "You have a streaming pipeline that receives user action events from Cloud Pub/Sub. You need to calculate the click-through rate of ads displayed on a website for the last 10 minutes, updating the calculation every 1 minute. Which windowing strategy in Apache Beam (Cloud Dataflow) should you use?",
    options: [
      "Fixed Windows of 10 minutes duration.",
      "Sliding Windows of 10 minutes duration with a 1 minute slide period.",
      "Session Windows with a gap duration of 1 minute.",
      "Global Windows with custom triggers based on element count."
    ],
    answer: 1,
    explanation: "Sliding windows are used when you want a window of size N that updates every M minutes. In this case, you want the last 10 minutes of data (window size) updated every 1 minute (slide period), which corresponds perfectly to a Sliding Window."
  },
  {
    id: 6,
    domain: "Domain 2: Data Preparation & Processing",
    question: "Your team is building multiple fraud detection models that all require the same features (e.g., 'number_of_failed_logins_last_24h'). Currently, different data scientists are calculating these features independently, leading to redundant work and inconsistencies in the data. You want to centralize these features. What GCP service should you use?",
    options: [
      "BigQuery Materialized Views.",
      "Vertex AI Feature Store.",
      "Cloud Bigtable.",
      "Cloud Storage bucket with parquet files."
    ],
    answer: 1,
    explanation: "Vertex AI Feature Store is specifically designed to solve this problem. It acts as a central repository to organize, store, and serve features. It enables feature sharing and reuse across different models/teams, and serves them both offline (high throughput for training) and online (low latency for predictions)."
  },

  // --- DOMAIN 3: MODEL DEVELOPMENT ---
  {
    id: 7,
    domain: "Domain 3: Model Development",
    question: "You are training a deep learning model in TensorFlow on Vertex AI Custom Training. The model size is over 200 GB, which is too large to fit into the memory of a single GPU or even a single VM. You need to distribute the model parameters across multiple servers. Which distribution strategy should you use in tf.distribute?",
    options: [
      "tf.distribute.MirroredStrategy",
      "tf.distribute.TPUStrategy",
      "tf.distribute.ParameterServerStrategy",
      "tf.distribute.MultiWorkerMirroredStrategy"
    ],
    answer: 2,
    explanation: "ParameterServerStrategy is designed for multi-machine training where the model weights are too large to fit in a single worker's memory. The model parameters are stored on 'parameter servers' while the gradient computations are performed on 'workers', which fetch weights and send gradients back."
  },
  {
    id: 8,
    domain: "Domain 3: Model Development",
    question: "You need to tune the hyperparameters of a custom neural network on Vertex AI. You want to find the optimal combination of learning rate (continuous float), optimizer type (categorical string), and number of layers (discrete integer). You want to minimize the number of trial iterations because training is expensive. Which hyperparameter tuning service should you use?",
    options: [
      "Vertex AI Vizier using Bayesian Optimization.",
      "Run a Grid Search script inside a Cloud Dataproc cluster.",
      "Run a Random Search script inside a Vertex AI Workbench notebook.",
      "Use BigQuery ML's built-in grid search tuning options."
    ],
    answer: 0,
    explanation: "Vertex AI Vizier is a managed hyperparameter tuning service. It uses Bayesian Optimization (a black-box optimization technique) to select hyperparameter values. It is highly sample-efficient, finding the optimal combinations in fewer trials compared to Grid Search or Random Search."
  },
  {
    id: 9,
    domain: "Domain 3: Model Development",
    question: "You have trained a custom regression model to predict housing prices. During evaluation, you observe that the model performs exceptionally well on the training dataset (very low RMSE) but performs poorly on the validation dataset (very high RMSE). What is the model experiencing, and how can you mitigate this issue?",
    options: [
      "Underfitting (High Bias). You should increase the model complexity by adding more hidden layers.",
      "Overfitting (High Variance). You should add L2 regularization or dropout, or collect more training data.",
      "Data Leakage. You should combine the training and validation sets to retrain.",
      "Gradient Explosion. You should implement gradient clipping in the optimizer."
    ],
    answer: 1,
    explanation: "When a model has low training error but high validation error, it is overfitting (high variance). It has memorized the training data and fails to generalize. Correct remedies include regularization (L1/L2), dropout, early stopping, or increasing the volume of training data."
  },

  // --- DOMAIN 4: MLOPS & PIPELINES ---
  {
    id: 10,
    domain: "Domain 4: MLOps & Pipelines",
    question: "Your team is building an end-to-end ML pipeline. You want to enforce strict checks on incoming data schemas, compare model accuracy against a threshold before deploying, and ensure that all steps are strictly integrated and validated. The entire pipeline uses TensorFlow. Which SDK should you use for Vertex AI Pipelines?",
    options: [
      "Kubeflow Pipelines (KFP) SDK",
      "TensorFlow Extended (TFX) SDK",
      "Apache Airflow SDK",
      "Vertex AI SDK for Python"
    ],
    answer: 1,
    explanation: "TensorFlow Extended (TFX) is an opinionated, production-grade SDK designed specifically for TensorFlow pipelines. It provides pre-built components like ExampleValidator (for schema validation) and Evaluator (for threshold checks and model analysis), making it the best fit for strict validation in a TF environment."
  },
  {
    id: 11,
    domain: "Domain 4: MLOps & Pipelines",
    question: "You have trained a new model version (v2) for customer churn. You want to deploy v2 to production but minimize the risk of a regression. You want to route 95% of incoming customer requests to the stable v1 model and 5% to the new v2 model, monitoring the latency and error rates of v2. How should you implement this on Vertex AI?",
    options: [
      "Create two separate Vertex AI Endpoints (one for v1, one for v2) and write client-side code that randomly routes requests with a 95/5 split.",
      "Deploy both model versions (v1 and v2) to the same Vertex AI Endpoint, and configure the endpoint's traffic split option to assign 95% of traffic to v1 and 5% to v2.",
      "Use Cloud Load Balancing in front of two VM instances hosting the models to distribute traffic.",
      "Update the Model Registry to make v2 the default version, and set the autoscaling minimum node count of v2 to 1 and v1 to 19."
    ],
    answer: 1,
    explanation: "Vertex AI Endpoints natively support traffic splitting. You can deploy multiple model versions to a single endpoint and assign percentage weights to each (e.g., 95% to v1, 5% to v2). This allows canary deployments without changing client-side API target URLs."
  },
  {
    id: 12,
    domain: "Domain 4: MLOps & Pipelines",
    question: "You are designing a continuous training pipeline. Whenever a new batch of labeled image data is uploaded to a specific Cloud Storage bucket, you want to automatically trigger a Vertex AI Pipeline run to retrain your image classifier. What is the most cloud-native way to achieve this with minimal code?",
    options: [
      "Write a Cron job running on a Compute Engine VM that polls the bucket every hour for new files and executes a script.",
      "Configure a Cloud Storage Pub/Sub notification to trigger on file creation, which calls a Cloud Function that executes the Vertex AI Pipeline Job.",
      "Use Cloud Dataflow to monitor the bucket and trigger the pipeline.",
      "Train the model inside a BigQuery ML script using the Cloud Storage external table connection."
    ],
    answer: 1,
    explanation: "This is the classic event-driven MLOps architecture on GCP. A file upload to Cloud Storage triggers a Pub/Sub notification or Eventarc event, which triggers a serverless Cloud Function. The Cloud Function uses the Vertex AI SDK to trigger a Pipeline Job."
  },

  // --- DOMAIN 5: MONITORING & RESPONSIBLE AI ---
  {
    id: 13,
    domain: "Domain 5: Monitoring & Responsible AI",
    question: "You have a regression model predicting retail store sales. After deployment, you configure Vertex AI Model Monitoring. You want to detect when the statistical distribution of the features sent to the online endpoint shifts away from the distribution of the features in the training dataset. What is this type of shift called, and what does the monitoring service require to detect it?",
    options: [
      "Prediction Drift. The monitoring service requires a baseline of the first 7 days of production prediction data.",
      "Training-Serving Skew. The monitoring service requires access to the original training dataset (stored in GCS or BigQuery) to act as a baseline.",
      "Concept Drift. The monitoring service requires immediate ground-truth labels for all production predictions.",
      "Covariate Shift. The monitoring service requires a secondary validation dataset."
    ],
    answer: 1,
    explanation: "Training-serving skew is the difference between training data and serving (production) data. To detect training-serving skew, Vertex AI Model Monitoring compares production requests against the baseline training dataset, which must be accessible (e.g. in BigQuery or GCS)."
  },
  {
    id: 14,
    domain: "Domain 5: Monitoring & Responsible AI",
    question: "You have built a deep neural network model for classifying chest X-ray images. The radiologists using the model need to understand *why* the model classified an image as having a specific pathology. They want a visual explanation showing which regions of the X-ray image the model relied on most for its decision. Which Explainable AI method should you use?",
    options: [
      "Sampled Shapley, because it works for all black-box models.",
      "Integrated Gradients, because it is computationally fast.",
      "XRAI (eXplanation with Robust Alliances for Images), because it highlights image regions (salience maps) for differentiable models.",
      "Shapley Additive exPlanations (SHAP) tabular explanations."
    ],
    answer: 2,
    explanation: "XRAI is a Google Explainable AI method specifically designed for images. It builds on Integrated Gradients by grouping pixels into segments, creating heatmaps (salience maps) showing exactly which visual regions of the image contributed most to the model's classification."
  },
  {
    id: 15,
    domain: "Domain 5: Monitoring & Responsible AI",
    question: "A bank trains a machine learning model to evaluate loan applications. When auditing the model, the compliance team discovers that the model approves loans for applicants from Group A at a much higher rate than for applicants from Group B, even when they have similar credit scores. Which fairness metric is violated here, and what is a standard MLOps practice to document these limitations?",
    options: [
      "Equal Opportunity is violated. The limitations should be documented in a Model Card.",
      "Demographic Parity is violated. The limitations should be documented in a Model Card.",
      "Accuracy is violated. The limitations should be documented in a README file.",
      "Recall is violated. The limitations should be documented in a Vertex AI Pipeline log."
    ],
    answer: 1,
    explanation: "Demographic Parity requires that the likelihood of a positive outcome (getting a loan approved) is equal across all groups, regardless of demographic features. When approval rates differ significantly, Demographic Parity is violated. Model Cards are the standard framework for documenting model performance, bias, limits, and ethics."
  },

  // --- DOMAIN 6: GENERATIVE AI ---
  {
    id: 16,
    domain: "Domain 6: Generative AI",
    question: "You are developing a customer support chatbot for an online retail store. The chatbot must answer questions about customer-specific orders, return statuses, and store-specific return policies that change frequently. You want to use the Gemini model but ensure it provides accurate, up-to-date, and grounded answers without hallucinating. What architecture should you use?",
    options: [
      "Fine-tune the Gemini model using Supervised Fine-Tuning (SFT) on past customer support chats.",
      "Use Retrieval-Augmented Generation (RAG) by converting store policies and order databases into embeddings, storing them in Vertex AI Vector Search, and passing relevant search context to Gemini at query time.",
      "Create a larger prompt with 50 few-shot examples showing dummy order resolutions.",
      "Deploy multiple Gemini endpoints and use a random traffic splitter to evaluate outputs."
    ],
    answer: 1,
    explanation: "Retrieval-Augmented Generation (RAG) is the best pattern for grounding model outputs in private, dynamic, or frequently changing data. By retrieving order statuses and active policies from a database/index and passing them to Gemini as context, you prevent hallucinations and ensure accurate, real-time answers."
  },
  {
    id: 17,
    domain: "Domain 6: Generative AI",
    question: "You have a text summarization task. You need to summarize legal contracts. The legal terms are highly technical, and the summaries must follow a specific, rigid JSON schema containing keys like 'party_names', 'effective_date', and 'termination_clauses'. Prompt engineering is not consistently enforcing the JSON structure. What should you do?",
    options: [
      "Use Vertex AI Vector Search to find similar summaries.",
      "Fine-tune the foundation model using Supervised Fine-Tuning (SFT) on a dataset of contracts and their corresponding JSON summaries to learn the structural format.",
      "Use the Vertex AI Vision API to extract text first.",
      "Configure safety filters to block non-compliant outputs."
    ],
    answer: 1,
    explanation: "Supervised Fine-Tuning (SFT) is highly effective when you need to teach a foundation model a specific output style, tone, or rigid formatting structure (like a specific JSON schema) that prompt engineering alone cannot reliably enforce."
  },
  {
    id: 18,
    domain: "Domain 6: Generative AI",
    question: "You want to deploy an enterprise-grade search system that searches across thousands of internal HR PDFs, Google Drive documents, and internal URLs. The system must allow employees to ask questions in natural language and receive synthesized answers grounded in the company documents. What Google Cloud tool allows you to build this search engine with the least coding?",
    options: [
      "Vertex AI Vector Search",
      "Vertex AI Agent Builder",
      "BigQuery ML ML.GENERATE_TEXT",
      "Cloud Dataflow + Custom Gemma model"
    ],
    answer: 1,
    explanation: "Vertex AI Agent Builder is a high-level developer platform that allows you to easily connect Gemini to enterprise data sources (GCS, BigQuery, Google Drive, Websites) and create fully grounded search engines or AI agents with minimal coding."
  },

  // --- GENERAL GCP ML QUESTIONS (MIXED COMPREHENSIVE) ---
  {
    id: 19,
    domain: "Domain 3: Model Development",
    question: "Your team is building a deep learning model for image classification. You have a dataset of 5 million images. You have decided to use Vertex AI Custom Training with custom containers. To speed up training, you want to use multiple VM nodes, each containing 8 NVIDIA A100 GPUs. Which TensorFlow distribution strategy is best suited for this multi-node, multi-GPU setup?",
    options: [
      "tf.distribute.MirroredStrategy",
      "tf.distribute.MultiWorkerMirroredStrategy",
      "tf.distribute.OneDeviceStrategy",
      "tf.distribute.experimental.CentralStorageStrategy"
    ],
    answer: 1,
    explanation: "MultiWorkerMirroredStrategy is the multi-worker/multi-node version of MirroredStrategy. It is designed to run training synchronously across multiple machines (workers), each containing one or more GPUs."
  },
  {
    id: 20,
    domain: "Domain 2: Data Preparation & Processing",
    question: "You are training a model on a dataset where one of the features is a user's country. The country feature contains 190 unique values. During prediction serving, you notice that the model receives new country values (e.g. newly added regions) that were not present in the training set, causing the model to throw exceptions or predict incorrectly. Which MLOps component or practice should you implement to detect this issue automatically?",
    options: [
      "Use Vertex AI Model Monitoring to detect training-serving skew on the country feature.",
      "Use TFX StatisticsGen to compute prediction metrics.",
      "Set up an Apache Beam pipeline with Fixed Windows.",
      "Deploy a custom container to handle error logging manually."
    ],
    answer: 0,
    explanation: "Training-serving skew includes differences in the values of features between training and serving datasets (e.g., a feature value that is present during serving but missing during training). Configuring Vertex AI Model Monitoring on this feature will trigger alerts when a significant skew is detected."
  },
  {
    id: 21,
    domain: "Domain 4: MLOps & Pipelines",
    question: "You want to implement a secure prediction pipeline. Your model is deployed to a Vertex AI Endpoint. The client applications calling this endpoint are run on Compute Engine instances within a Virtual Private Cloud (VPC) network. For security reasons, you cannot allow traffic to travel over the public internet, and you must minimize network latency. How should you deploy the endpoint?",
    options: [
      "Use Cloud VPN to encrypt predictions sent over the public internet.",
      "Deploy the model to a Vertex AI Private Endpoint with VPC Network Peering enabled between your VPC and the Vertex AI service network.",
      "Use Cloud Armor to filter out public requests based on IP addresses.",
      "Store predictions in a GCS bucket and access them using IAM service accounts."
    ],
    answer: 1,
    explanation: "Vertex AI Private Endpoints use VPC Network Peering to establish a secure, low-latency, private connection between your Google Cloud VPC and the Google network hosting the Vertex AI Endpoint. Traffic remains inside Google's network, meeting the security and latency requirements."
  },
  {
    id: 22,
    domain: "Domain 5: Monitoring & Responsible AI",
    question: "You are deploying a custom tabular regression model to predict loan interest rates using Scikit-Learn. You need to configure Explainable AI. The features include credit score, debt-to-income ratio, and income. Which Explainable AI method should you configure in your model definition?",
    options: [
      "Integrated Gradients, because it is the most mathematically rigorous for tabular models.",
      "Sampled Shapley, because the model is built with Scikit-Learn (which is non-differentiable/tabular).",
      "XRAI, because it supports complex float inputs.",
      "Vertex AI Vizier, because it tunes feature attributions."
    ],
    answer: 1,
    explanation: "Sampled Shapley is the recommended Explainable AI method for tabular, non-differentiable models such as those built with Scikit-learn (Random Forests, Gradient Boosting) or XGBoost. Integrated Gradients requires a differentiable model (like neural networks)."
  },
  {
    id: 23,
    domain: "Domain 6: Generative AI",
    question: "You are setting up safety guidelines for an LLM application utilizing Gemini. You want to ensure that any output that contains sexually explicit content is blocked, but you want to allow medical terms and text. You configure Vertex AI safety settings. What parameter should you adjust?",
    options: [
      "The temperature of the model generation.",
      "The safety threshold for the 'Sexually Explicit' category (e.g., setting it to BLOCK_MEDIUM_AND_ABOVE).",
      "The frequency penalty parameter.",
      "Deploy a custom classification model to filter the prompts before calling Gemini."
    ],
    answer: 1,
    explanation: "Vertex AI allows developers to configure safety thresholds for categories like 'Sexually Explicit' content. Setting the safety threshold to BLOCK_MEDIUM_AND_ABOVE will block responses flagged with medium or high probability, while allowing lower-probability occurrences (e.g., standard medical terminology)."
  },
  {
    id: 24,
    domain: "Domain 3: Model Development",
    question: "Your custom training script in Vertex AI needs to write custom training logs, checkpoints, and model files. What storage system should you use to write these outputs so they are durable, accessible to other pipeline stages, and do not fill up the VM's local disk?",
    options: [
      "Write to local scratch directory `/tmp` on the VM and download them using ssh after training finishes.",
      "Mount a Cloud Storage (GCS) bucket or write files directly to GCS paths using the tf.io.gfile API.",
      "Write logs to Cloud Logging and weights to a BigQuery table.",
      "Install a PostgreSQL database on the training VM to store weights as BLOB data."
    ],
    answer: 1,
    explanation: "Cloud Storage (GCS) is the standard storage system for ML model training artifacts on Google Cloud. Writing checkpoints, tensorboard logs, and model saves to GCS (using tools like tf.io.gfile or direct GCS write paths) ensures durability and makes them available for downstream MLOps stages."
  },
  {
    id: 25,
    domain: "Domain 4: MLOps & Pipelines",
    question: "You are reviewing the model lifecycle of your production pipeline. Which service acts as the bridge between model training (Vertex AI Pipelines) and model serving (Vertex AI Endpoints) by storing model artifacts, versions, and metadata?",
    options: [
      "Vertex AI Model Registry",
      "Vertex AI Feature Store",
      "Artifact Registry",
      "Cloud Storage"
    ],
    answer: 0,
    explanation: "Vertex AI Model Registry is the central repository for managing model versions, tracking metadata, and deploying models to endpoints. It acts as the bridge between model training pipelines (which output models) and model endpoints (which serve them)."
  },
  {
    id: 26,
    domain: "Domain 7: Agents & Reasoning Engines",
    question: "Your team is building a conversational reservation assistant. You have a team of conversation designers who do not write Python code but need to define agent playbooks, connect to Cloud Storage data sources for grounding, and configure OpenAPI schemas to check calendar availability. Which tool in Vertex AI Agent Builder should they use?",
    options: [
      "Vertex AI Agent Development Kit (ADK)",
      "Vertex AI Agent Studio (Playbooks & Agent Designer)",
      "Vertex AI Agent Engine",
      "Vertex AI Custom Container Training"
    ],
    answer: 1,
    explanation: "Agent Studio is the low-code path in Vertex AI Agent Builder that enables conversational designers to create playbooks, ground using Data Stores (e.g. GCS), and connect tools via OpenAPI schemas without writing code."
  },
  {
    id: 27,
    domain: "Domain 7: Agents & Reasoning Engines",
    question: "You are updating a custom Python agent deployed on Vertex AI Agent Engine. The agent imports and uses the 'vertexai.generative_models' module to interact with Gemini and load LangChainAgent tools. You need to ensure the agent remains supported after June 2026. What action should you take?",
    options: [
      "Migrate your imports and tool declarations to the google-genai SDK and install google-genai.",
      "Do nothing, as vertexai.generative_models remains the primary SDK module for Vertex AI.",
      "Port your code to a custom container running the old google-cloud-aiplatform library version 1.100.",
      "Rewrite the agent using Vertex AI Agent Studio playbooks, which do not rely on Python SDKs."
    ],
    answer: 0,
    explanation: "The vertexai.generative_models SDK is scheduled for complete removal on June 24, 2026. All agent and tool implementations must be migrated to the google-genai SDK immediately to prevent service disruption."
  },
  {
    id: 28,
    domain: "Domain 7: Agents & Reasoning Engines",
    question: "You are designing an AI agent for a customer support portal. The agent needs to track the specific items discussed during the current conversation turn-by-turn. However, it also needs to remember the user's language preferences and historically resolved issues across multiple distinct sessions over several weeks. What memory configuration on Vertex AI Agent Engine should you implement?",
    options: [
      "Use Agent Engine Sessions for the turn-by-turn state, and configure the Agent Engine Memory Bank for long-term cross-session persistence.",
      "Use Cloud SQL to cache the turn-by-turn state, and use Agent Engine Sessions for long-term persistence.",
      "Deploy a Memorystore (Redis) instance to handle both turn-by-turn and long-term memory requirements, as Agent Engine has no native memory capabilities.",
      "Configure the Agent Engine Memory Bank to store short-term turn states, and use a local file variable to store cross-session variables."
    ],
    answer: 0,
    explanation: "Vertex AI Agent Engine provides two GA managed memory capabilities: Sessions (for tracking short-term state across turns within a single session) and Memory Bank (for storing persistent distilled facts and preferences across different user sessions over time)."
  },
  {
    id: 29,
    domain: "Domain 7: Agents & Reasoning Engines",
    question: "You have deployed a custom Python agent to Vertex AI Agent Engine. You need to grant an external microservice secure access to invoke this remote agent via its REST resource path 'projects/my-project/locations/us-central1/reasoningEngines/RESOURCE_ID'. Following the principle of least privilege, which IAM role should you bind to the microservice's service account?",
    options: [
      "roles/aiplatform.admin (Vertex AI Administrator)",
      "roles/aiplatform.user (Vertex AI User)",
      "roles/viewer (Viewer)",
      "roles/aiplatform.serviceAgent (Vertex AI Service Agent)"
    ],
    answer: 1,
    explanation: "To query or invoke a deployed Agent Engine resource (represented as a reasoningEngine in the REST path), the calling principal (user or service account) must be granted the Vertex AI User role (roles/aiplatform.user) on the resource."
  },
  {
    id: 30,
    domain: "Domain 7: Agents & Reasoning Engines",
    question: "Your organization has built a specialist SQL query agent in one department and a customer support agent in another. You want to orchestrate them into a unified multi-agent system where a supervisor agent can delegate tasks and coordinate responses between these agents using an open, standardized protocol. Which protocol or framework is natively supported by Agent Engine for agent-to-agent coordination?",
    options: [
      "The Agent-to-Agent (A2A) Protocol",
      "The gRPC Streaming Protocol",
      "The LangChain Graph API",
      "The OpenAPI Tool Specification"
    ],
    answer: 0,
    explanation: "The Agent-to-Agent (A2A) protocol is an open protocol (under the Linux Foundation) designed for multi-agent coordination (such as supervisor-specialist patterns), and is natively supported on Vertex AI Agent Engine."
  },

  // --- NEW QUESTIONS: GAPS FILLED ---

  // Context Caching
  {
    id: 31,
    domain: "Domain 6: Generative AI",
    question: "You are building a legal analysis tool where 10,000 employees per day ask questions about a single 400-page corporate policy document. Each request sends the full document as context to Gemini 2.5 Flash. Your cost per day is extremely high due to input token volume. What is the most cost-effective architectural change?",
    options: [
      "Switch to Gemini 2.5 Pro which has a larger context window.",
      "Use Vertex AI Context Caching to upload the document once, receive a cache name, and reference it in all subsequent requests instead of re-sending the full document.",
      "Fine-tune Gemini on the policy document so the model internalizes it and requires no context at runtime.",
      "Split the document into chunks and store in Vertex AI Vector Search, retrieving only the top 3 chunks per query."
    ],
    answer: 1,
    explanation: "Context Caching allows you to upload a large, frequently reused prompt prefix (e.g., a large document) once to the Gemini API. All subsequent requests reference the cached content by name instead of re-sending the tokens. Cached tokens cost approximately 4x less than input tokens, dramatically reducing cost for high-volume, same-context workloads."
  },

  // PEFT / LoRA vs full SFT
  {
    id: 32,
    domain: "Domain 6: Generative AI",
    question: "Your team needs to fine-tune Gemini 2.0 Flash to output a specific JSON schema for contract extraction. You have a labeled dataset of 5,000 prompt-response pairs. Your GPU budget is limited and you need to minimize training compute hours. Which fine-tuning approach should you use on Vertex AI?",
    options: [
      "Full Supervised Fine-Tuning (SFT) updating all model weights, as it will produce the highest accuracy.",
      "PEFT adapter tuning (LoRA) using a low adapter_size parameter, which trains only small adapter layers while freezing base model weights, minimizing GPU usage.",
      "Reinforcement Learning from Human Feedback (RLHF), because JSON formatting requires human preference signals.",
      "Deploy the base Gemini model and use RAG to retrieve the JSON schema at runtime."
    ],
    answer: 1,
    explanation: "PEFT (Parameter-Efficient Fine-Tuning) with LoRA freezes the base model weights and trains only small adapter layers. This achieves comparable results to full SFT while requiring significantly less GPU memory and compute hours. On Vertex AI, this is configured via the adapter_size parameter in the sft.train() call."
  },

  // Gemini model selection
  {
    id: 33,
    domain: "Domain 6: Generative AI",
    question: "You are building two ML applications: (A) a complex multi-step code generation assistant that must solve competitive programming problems requiring deep chain-of-thought reasoning; (B) a high-volume batch pipeline that summarizes 500,000 news articles per day where cost-per-token matters most. Which Gemini models should you use for A and B respectively?",
    options: [
      "A: Gemini 2.5 Flash, B: Gemini 2.5 Pro",
      "A: Gemini 2.5 Pro (with thinking mode), B: Gemini 2.5 Flash",
      "A: Gemma 3, B: Gemini 2.5 Flash",
      "A: Gemini 2.5 Pro, B: Gemma 3 deployed on GKE"
    ],
    answer: 1,
    explanation: "Gemini 2.5 Pro with thinking/reasoning mode is optimized for complex multi-step reasoning tasks (coding, math, deep analysis) and delivers the highest accuracy. Gemini 2.5 Flash is the best price-performance model for high-throughput, cost-sensitive batch workloads like summarization pipelines."
  },

  // Dataplex
  {
    id: 34,
    domain: "Domain 2: Data Preparation & Processing",
    question: "Your organization stores raw ML training data in Cloud Storage buckets and processed feature tables in BigQuery across multiple GCP projects. The data governance team wants a unified catalog with automatic metadata discovery and lineage tracking, plus automated daily data quality checks (null rate validation, value range checks) that alert on failures before pipeline runs. Which GCP service should you use?",
    options: [
      "Vertex AI Feature Store, as it centralizes feature metadata.",
      "Cloud Data Catalog, as it provides manual tagging of BigQuery tables.",
      "Dataplex, as it provides unified lake governance, automatic metadata discovery across GCS and BigQuery, and native Data Quality Tasks that run on a schedule.",
      "Cloud Dataflow with custom DoFn functions that perform validation and write results to Cloud Logging."
    ],
    answer: 2,
    explanation: "Dataplex is Google Cloud's unified data management and governance service. It auto-discovers metadata across GCS and BigQuery (via Lakes/Zones/Assets), provides a searchable Data Catalog with lineage, and supports scheduled Data Quality Tasks (SQL-based rule checks) that publish results to Pub/Sub for alerting — all without writing custom code."
  },

  // Controlled generation / response_schema
  {
    id: 35,
    domain: "Domain 6: Generative AI",
    question: "You are using Gemini 2.5 Flash to extract structured data from legal contracts. The output must conform to a strict JSON schema with required fields: 'party_names' (array of strings), 'effective_date' (string), and 'penalty_amount' (number). Prompt engineering with few-shot examples produces JSON about 80% of the time, but the remaining 20% causes downstream parsing failures. What is the most reliable fix?",
    options: [
      "Increase the model temperature to 1.0 to produce more creative and varied JSON outputs.",
      "Fine-tune Gemini on contract examples to internalize the JSON structure.",
      "Use the response_schema parameter in GenerateContentConfig with response_mime_type='application/json' to enforce the exact JSON schema at the API level.",
      "Add a Cloud Function post-processor that retries the Gemini call up to 5 times until valid JSON is returned."
    ],
    answer: 2,
    explanation: "Controlled generation via response_schema (combined with response_mime_type='application/json') enforces schema compliance at the API level — Gemini is constrained to only output tokens that form a valid JSON object matching your schema. This guarantees 100% schema-valid output without fine-tuning or retry logic."
  },

  // Artifact Registry vs Container Registry
  {
    id: 36,
    domain: "Domain 4: MLOps & Pipelines",
    question: "Your team is building a Vertex AI Custom Training job using a custom Docker container. You need to store the container image in a Google Cloud container registry. The image should be stored in the us-central1 region, with per-repository IAM controls and VPC Service Controls support. Which registry should you use and what image URI format is correct?",
    options: [
      "Container Registry (gcr.io). URI format: gcr.io/my-project/trainer:v1",
      "Artifact Registry. URI format: us-central1-docker.pkg.dev/my-project/ml-images/trainer:v1",
      "Cloud Storage. URI format: gs://my-project-images/trainer.tar.gz",
      "Container Registry with regional replication. URI format: us.gcr.io/my-project/trainer:v1"
    ],
    answer: 1,
    explanation: "Artifact Registry is the current standard for storing Docker images on Google Cloud, replacing the deprecated Container Registry. It supports regional storage, per-repository IAM, VPC Service Controls, and multiple artifact formats. The URI format is REGION-docker.pkg.dev/PROJECT/REPOSITORY/IMAGE:TAG."
  },

  // Sensitive Data Protection
  {
    id: 37,
    domain: "Domain 5: Monitoring & Responsible AI",
    question: "Your company's raw customer transaction dataset in BigQuery contains Social Security Numbers, full names, and email addresses. Before using this data to train a fraud detection model on Vertex AI, the legal team requires all PII to be removed. You need a managed GCP service that can scan the BigQuery table for PII and replace sensitive values with masked tokens, with minimum custom code. What should you use?",
    options: [
      "Write a Cloud Dataflow pipeline with custom Python DoFn functions that use regex to detect and replace PII fields.",
      "Use BigQuery authorized views to hide PII columns from the training service account.",
      "Use Sensitive Data Protection (formerly Cloud DLP) to run an inspect-and-de-identify job on the BigQuery table, replacing PII with masked or tokenized values.",
      "Use Vertex AI Data Labeling to flag PII records and then delete them from the dataset."
    ],
    answer: 2,
    explanation: "Sensitive Data Protection (formerly Cloud DLP) provides managed inspection and de-identification of sensitive data in BigQuery, GCS, and other sources. It detects 150+ built-in infoTypes (SSNs, names, emails, credit cards) and applies de-identification transformations (masking, tokenization, bucketing) without writing custom code."
  },

  // Vertex AI Experiments
  {
    id: 38,
    domain: "Domain 3: Model Development",
    question: "Your team is running 20 Vertex AI Custom Training jobs with different hyperparameter combinations (learning rate, batch size, regularization strength) to find the optimal configuration for a tabular classification model. You need to compare all runs by val_AUC in a single view and programmatically identify the best run to promote to the Model Registry. Which Vertex AI service should you use?",
    options: [
      "Vertex AI Vizier, as it performs black-box optimization and tracks trials automatically.",
      "Vertex AI Experiments, as it provides a centralized tracking workspace to log parameters and metrics across runs and compare them in Vertex AI Studio.",
      "Vertex AI Model Registry, as it stores evaluation metrics alongside each model version.",
      "Cloud Logging, as all Vertex AI job metrics are automatically written there."
    ],
    answer: 1,
    explanation: "Vertex AI Experiments is designed for experiment tracking and comparison. Each training run logs hyperparameters and metrics to an Experiment. In Vertex AI Studio, all runs are visible in a comparison table. Programmatically, you can query the top-performing run by metric and use its output model artifact for registry promotion. Vizier is for automated hyperparameter search (Bayesian optimization), not manual experiment comparison."
  }
];

// Export to window object for browser access
if (typeof window !== "undefined") {
  window.PRACTICE_QUESTIONS = PRACTICE_QUESTIONS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PRACTICE_QUESTIONS };
}
