# Domain 1: Framing ML Problems & Architecting ML Solutions

This study guide covers the foundational knowledge needed for Domain 1 of the GCP Machine Learning Engineer Exam: translating business challenges into ML problems, choosing metrics, and selecting the appropriate Google Cloud services.

---

## 1. Framing ML Problems

Before building a model, you must translate business goals into machine learning tasks. 

### ML Problem Types
*   **Supervised Learning:**
    *   **Regression:** Predicting continuous values (e.g., house prices, customer lifetime value).
    *   **Classification:**
        *   *Binary:* True/False, Fraud/Legitimate.
        *   *Multi-class:* Single label from multiple categories (e.g., classifying a support ticket into one of five departments).
        *   *Multi-label:* Assigning multiple tags (e.g., tagging a blog post with 'tech', 'cloud', 'ml').
*   **Unsupervised Learning:**
    *   **Clustering:** Grouping similar data points without labels (e.g., customer segmentation).
    *   **Anomaly Detection:** Identifying outliers or rare occurrences (e.g., network intrusion, equipment failure).
*   **Recommendation Systems:** Matching users with items (e.g., content recommendation, product suggestions).
*   **Time-Series Forecasting:** Predicting future values based on past observations over time (e.g., retail sales forecast, energy demand).

---

## 2. ML Evaluation Metrics

Choosing the right metric is critical. The exam will present scenarios where you must select the appropriate metric based on the business cost of errors.

| Metric | Formula | When to Use | Exam Scenario Example |
| :--- | :--- | :--- | :--- |
| **Accuracy** | $\frac{TP+TN}{TP+TN+FP+FN}$ | Balanced datasets where both classes are equally important. | Not recommended for rare event detection (e.g., fraud). |
| **Precision** | $\frac{TP}{TP+FP}$ | Minimizing **False Positives (FP)**. Use when a false alarm is highly disruptive or costly. | **Spam Detection:** You don't want legitimate emails sent to the spam folder. |
| **Recall (Sensitivity)** | $\frac{TP}{TP+FN}$ | Minimizing **False Negatives (FN)**. Use when missing a positive case is critical. | **Medical Screening / Fraud:** You must catch every case of disease or fraud, even if it means some false alarms. |
| **F1-Score** | $2 \cdot \frac{Precision \cdot Recall}{Precision + Recall}$ | Harmonic mean of Precision and Recall. Best for imbalanced datasets. | Balanced optimization between spam classification and customer experience. |
| **AUC-ROC** | Area under TPR vs FPR curve | Evaluates classifier performance across all classification thresholds. | Comparing model robustness regardless of the decision threshold. |
| **RMSE (Root Mean Sq. Error)** | $\sqrt{\frac{1}{n}\sum(y-\hat{y})^2}$ | Penalizes larger errors more heavily due to the squaring term. | Predicting delivery times where major delays are highly detrimental. |
| **MAE (Mean Absolute Error)** | $\frac{1}{n}\sum\|y-\hat{y}\|$ | Treats all errors linearly. Robust to outliers. | General business forecasting where errors are linear in cost. |

---

## 3. Selecting the Right GCP Architecture

A common exam pattern asks you to choose the "most efficient," "least effort," or "most scalable" solution. Use the following hierarchy of choices:

```mermaid
graph TD
    A[Start: Define ML Problem] --> B{Pre-trained API fits?}
    B -- Yes: No Custom Code --> C[Use Google Pre-trained API]
    B -- No --> D{Data is in BigQuery & Structured?}
    D -- Yes: Quick SQL approach --> E[Use BigQuery ML (BQML)]
    D -- No --> F{Need Custom Code/Framework?}
    F -- No: Fast code-free baseline --> G[Use Vertex AI AutoML]
    F -- Yes: Max Flexibility --> H[Use Vertex AI Custom Training]
    
    C --> I[Speech, Vision, Translation, Document AI, etc.]
    E --> J[Train models using standard SQL]
    G --> K[AutoML Tabular, Image, Video, Text]
    H --> L[Custom container / pre-built container + TF/PyTorch/JAX]
```

### Google Cloud ML Product Spectrum

#### 1. Pre-trained APIs (No ML experience required, lowest effort)
*   **Vertex AI Vision API:** Image/video analysis, OCR, object detection, face detection.
*   **Natural Language API:** Sentiment analysis, entity extraction, syntax analysis.
*   **Speech-to-Text & Text-to-Speech:** Transcription and voice synthesis.
*   **Translation API:** Language translation.
*   **Document AI:** Structural extraction of data from documents (invoices, receipts, forms).
*   **Vertex AI Search and Conversation:** Out-of-the-box search engines and chatbots.

#### 2. BigQuery ML (Structured data, SQL-based, low-to-medium effort)
*   **Key Advantage:** No data egress (movement). Keeps data in BigQuery, saving storage cost and latency.
*   **Supported Algorithms:** Linear Regression, Logistic Regression, K-Means Clustering, Matrix Factorization (Recommendations), Time-Series (ARIMA_PLUS), Boosted Trees (XGBoost), AutoML, DNNs, and importing TensorFlow models.
*   **Use Case:** Rapid prototyping or production models on tabular data resident in BigQuery.

#### 3. Vertex AI AutoML (Custom data, code-free, medium effort)
*   **Key Advantage:** Automatically handles feature engineering, algorithm selection, and hyperparameter tuning.
*   **Supported Modalities:** Tabular, Image, Video, and Text.
*   **Use Case:** High-accuracy models on custom datasets when the engineering team does not have deep ML framework expertise.

#### 4. Vertex AI Custom Training (Maximum flexibility, highest effort)
*   **Key Advantage:** Total control over network architecture, training loops, hyperparameters, and libraries.
*   **Features:** Distributed training (GPUs/TPUs), custom containers, Vertex AI TensorBoard, and Vertex AI Vizier (hyperparameter tuning).
*   **Use Case:** Custom deep learning architectures, unsupported frameworks, or highly specialized loss functions.

---

## 4. Architectural Decision Matrix (Exam Guide)

*   **Scenario:** You need to build a model to classify support tickets into departments. The data is in Cloud Storage as text files, and your team consists of ML researchers who want to implement a custom Transformer model.
    *   *Solution:* **Vertex AI Custom Training** using custom containers (allows custom framework/Transformer implementation).
*   **Scenario:** You have customer transactional data in BigQuery and need to predict customer churn next week. You want a solution that minimizes data movement.
    *   *Solution:* **BigQuery ML (Logistic Regression or Boosted Trees)**.
*   **Scenario:** You need to extract text and tables from thousands of scanned PDF invoices.
    *   *Solution:* **Document AI (Invoice Parser)**.
*   **Scenario:** You want to build a baseline model for predicting retail sales from historical tables. You have no experience with TensorFlow or PyTorch and want to complete it in 2 days.
    *   *Solution:* **Vertex AI AutoML Tabular**.
