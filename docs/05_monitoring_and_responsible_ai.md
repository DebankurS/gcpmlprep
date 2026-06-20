# Domain 5: Monitoring, Optimization & Responsible AI

This study guide covers Domain 5 of the GCP Machine Learning Engineer Exam: model monitoring (skew/drift detection), Explainable AI, and Responsible AI principles.

---

## 1. Vertex AI Model Monitoring

Once a model is deployed to production, its performance can degrade over time due to shifts in data distributions. Vertex AI Model Monitoring tracks two types of anomalies: **Training-Serving Skew** and **Prediction Drift**.

```
[Training Data Schema] <---- Compare ----> [Production Prediction Data]   ===> Training-Serving Skew
[Production Data Day 1] <---- Compare ----> [Production Data Day 30]      ===> Prediction Drift
```

### Skew vs. Drift

| Type | What it Measures | Reference Baseline | How to Fix |
| :--- | :--- | :--- | :--- |
| **Training-Serving Skew** | Difference between the dataset used to train the model and the actual inputs sent to the model in production. | **Training Dataset** (must be stored in Cloud Storage or BigQuery). | 1. Check for bugs in serving preprocessing code.<br>2. Update training data to match production. |
| **Prediction Drift** | Change in the production data distribution over time (e.g., changes in user behavior over 30 days). | **Historical Serving Data** (e.g., comparing last 7 days of predictions with preceding weeks). | 1. Retrain the model on more recent production data.<br>2. Re-engineer features. |

### Technical Details (Exam Tips)
*   **Feature Attributions:** Monitoring can also check for attribution drift (i.e., whether the features that the model relies on most for predictions have changed).
*   **Statistical Metrics:**
    *   *Categorical Features:* Evaluated using **L1 statistical distance**.
    *   *Numerical Features:* Evaluated using **Jensen-Shannon (JS) divergence** or **Population Stability Index (PSI)**.
*   **Alerting:** Set threshold values (e.g., 0.1). If drift/skew exceeds this, Vertex AI automatically sends an email or publishes to a **Pub/Sub** topic to trigger automated retraining.

---

## 2. Vertex AI Explainable AI (XAI)

Explainable AI provides **feature attributions**, which tell you how much each feature contributed to the model's prediction.

### Attribution Methods (Must Know)

| Method | Best For | How it Works |
| :--- | :--- | :--- |
| **Integrated Gradients** | **Differentiable Models** (Neural Networks, Deep Learning). | Computes the gradients of the model's output with respect to the input features along a path from a baseline (e.g., an all-black image or all-zero vector) to the input. |
| **Sampled Shapley** | **Non-differentiable / Tabular Models** (XGBoost, Random Forest, Scikit-learn). | Approximates Shapley values by averaging feature contributions across random permutations of features. Highly effective for tabular metadata. |
| **XRAI** | **Images / Computer Vision** (Neural Networks). | Combines Integrated Gradients with image segmentation to highlight regions of pixels (salience maps) that influenced the prediction. |

---

## 3. Responsible AI & Fairness

Google Cloud emphasizes ethical and responsible AI implementation. 

### Core Concepts
*   **Fairness:** Ensuring models do not display bias against protected classes (race, gender, age).
    *   *Demographic Parity:* The likelihood of a positive outcome is equal across all demographic groups.
    *   *Equal Opportunity:* The true positive rate (recall) is equal across all groups (e.g., equal chance of getting a loan approved if the applicant is qualified, regardless of demographic).
*   **Model Cards:** Standardized documentation that details:
    *   Model intent and target audience.
    *   Performance metrics (disaggregated by group).
    *   Limitations, assumptions, and ethical considerations.
*   **Security & Privacy:**
    *   *Data Minimization:* Only train on necessary features.
    *   *Differential Privacy:* Injecting mathematical noise into datasets to prevent individual record reconstruction.
    *   *De-identification:* Using **Cloud Data Loss Prevention (DLP)** to redact PII (names, Social Security numbers) before ingestion.
