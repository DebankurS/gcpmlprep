# Domain 2: Data Preparation & Processing

This study guide covers Domain 2 of the GCP Machine Learning Engineer Exam: data pipeline design, feature engineering, and managing data quality.

---

## 1. Feature Engineering on Google Cloud

Feature engineering transforms raw data into formats suitable for ML models. 

### Preprocessing Tools Comparison

| Tool | Processing Mode | Best For | Training-Serving Skew Prevention |
| :--- | :--- | :--- | :--- |
| **BigQuery ML (TRANSFORM)** | Batch (SQL) | Structured data in BigQuery. Preprocesses *during* training and saves steps. | Yes (using the `TRANSFORM` clause, the same SQL logic is automatically applied during inference). |
| **Cloud Dataflow (Apache Beam)** | Batch & Stream | Terabyte/petabyte scale raw files (GCS), real-time Pub/Sub inputs. | No (requires maintaining separate code for training vs. serving unless packaged with TensorFlow Transform). |
| **TensorFlow Transform (tf.Transform)** | Batch | TensorFlow models requiring complex preprocessing (e.g., vocabularies). | **Yes (Highly tested).** Exports preprocessing steps as a TensorFlow graph that is prepended directly to the model. |
| **Cloud Dataproc** | Batch | Running existing Apache Spark/Hadoop ETL pipelines. | No (serving pipelines must replicate spark code). |

---

## 2. Cloud Dataflow & Apache Beam

Cloud Dataflow is a fully managed service for executing Apache Beam pipelines. It automatically scales compute resources based on data volume.

### Key Concepts for the Exam
*   **PCollection:** Distributed dataset that represents data in the pipeline.
*   **PTransform:** A data processing operation (e.g., `ParDo`, `Map`, `GroupByKey`).
*   **Windowing:** Segmenting unbounded data stream (Pub/Sub) into bounded chunks based on time:
    *   *Fixed Windows:* Non-overlapping time intervals (e.g., every 5 minutes).
    *   *Sliding Windows:* Overlapping intervals (e.g., last 10 minutes, evaluated every minute).
    *   *Session Windows:* Grouped by periods of activity separated by gaps of inactivity.
*   **Side Inputs:** Additional data provided to a PTransform (e.g., loading a static lookup table or dictionary into memory to enrich a streaming PCollection).

---

## 3. Vertex AI Feature Store

Vertex AI Feature Store provides a centralized repository to organize, store, and serve machine learning features at scale. It solves the problem of feature reuse and training-serving skew.

```
Offline Sources (BigQuery) ----> Batch Ingestion ----\
                                                      +---> Feature Store ---> Online Serving (Low Latency SDK)
Online Sources (Pub/Sub)  ----> Stream Ingestion ----/
```

### Components
1.  **Entity Type:** The domain concept (e.g., `user`, `product`, `merchant`).
2.  **Feature:** A property of the entity (e.g., `user_click_rate`, `product_category`, `merchant_risk_score`).
3.  **Feature View:** A logical group of features that can be queried together.
4.  **Online Serving Store:** Low-latency storage (backed by Bigtable or Redis) for serving features in real-time predictions.
5.  **Offline Serving Store:** High-throughput storage (backed by BigQuery) for batch serving to train models.

### Key Benefits
*   **Prevents training-serving skew:** Ensures the exact same feature values are used during training (via point-in-time lookup) and serving.
*   **Point-in-Time Joins (Time Travel):** Fetches feature values *exactly* as they existed at the time of a historical event, preventing data leakage.
*   **Avoids Redundancy:** Multiple teams can share features (e.g., "days_since_last_purchase") rather than recalculating them.

---

## 4. Handling Data Quality & Imbalances

### Imbalanced Datasets
When one class is extremely rare (e.g., fraud at 0.01% of transactions), models default to predicting the majority class.
*   **Downsampling:** Sub-sampling the majority class. **Exam Tip:** Must adjust output prediction thresholds or use calibration if class distribution is artificially modified.
*   **Upsampling / SMOTE (Synthetic Minority Over-sampling Technique):** Creating synthetic examples of the minority class.
*   **Class Weights:** Penalizing misclassifications of the minority class more heavily in the loss function (e.g., `class_weight` in Keras/Scikit-learn).
*   **Metrics:** **Never** use Accuracy. Use **Precision**, **Recall**, **F1-Score**, or **PR-AUC**.

### Missing Data & Outliers
*   **Missing Values:**
    *   *Numerical:* Impute with median/mean or use a separate indicator feature (e.g., `is_missing = 1`).
    *   *Categorical:* Treat as a new category (e.g., `"unknown"`).
*   **Outliers:** Use **clipping** (capping values at the 1st and 99th percentiles) or **log-transformation** for highly skewed distributions (e.g., income, transaction amount).

---

## 5. Dataplex — Data Governance & Quality

**Dataplex** is Google Cloud's unified data governance and management service. It automates data discovery, quality monitoring, and metadata management across BigQuery, GCS, and other sources.

### Key Components

| Component | Purpose |
| :--- | :--- |
| **Lakes / Zones / Assets** | Hierarchical organization of data resources. Lake → Zone (Raw/Curated) → Asset (BQ dataset or GCS bucket). |
| **Data Catalog** | Automatic metadata tagging, schema discovery, and lineage tracking across all assets in a lake. |
| **Data Quality Tasks** | Define SQL-based quality rules (e.g., nullability checks, range checks) that run on a schedule. Alerts on rule failures. |
| **Auto Data Discovery** | Scans GCS and BigQuery to build a searchable metadata catalog automatically. |

### Exam Scenarios
*   **Scenario:** Centralize governance of raw data files in GCS and processed tables in BigQuery under a unified catalog with lineage.
    *   *Solution:* **Dataplex** — create a lake, attach GCS bucket and BigQuery dataset as assets, enable auto-discovery.
*   **Scenario:** Run daily automated data quality checks (null rate, min/max range) on a BigQuery table before triggering training.
    *   *Solution:* **Dataplex Data Quality Tasks** → publish results to Pub/Sub → trigger Vertex AI Pipeline on pass.

> **Exam trap:** Dataplex is for **governance and quality monitoring** of existing data. It does not replace Dataflow for transformation or Feature Store for feature serving.

---

## 6. Vertex AI Feature Store — Architecture Detail

Feature Store v2 (current) introduced a cleaner architecture compared to the original (v1).

### v2 Architecture

```
[Source Data]
      |
      v
[Feature Group]  <-- Points to a BigQuery table or view (source of truth)
      |
      v
[Feature View]   <-- Logical subset of features from one or more Feature Groups
      |
      +---> Offline Serving: BigQuery (batch training snapshots)
      |
      +---> Online Serving: Bigtable or Redis (low-latency real-time predictions)
```

### Key Concepts
*   **Feature Group:** Registered pointer to a BigQuery source table. No data is copied — it stays in BigQuery.
*   **Feature View:** Defines which columns to serve, sync schedule (online store refresh), and TTL.
*   **Sync Job:** Materializes Feature View data from BigQuery into the online store (Bigtable) on a schedule.
*   **Point-in-Time Joins:** When generating training datasets offline, Feature Store returns the feature values exactly as they existed at the label event timestamp — prevents data leakage.

### Exam Scenario
*   **Scenario:** Multiple teams need real-time access to pre-computed `risk_score` and `days_since_last_login` features with <10ms latency during model serving.
    *   *Solution:* Register a Feature Group backed by a BigQuery source, create a Feature View, enable online serving backed by Bigtable. Call `feature_view.fetch_feature_values(entity_id)` in the serving path.
