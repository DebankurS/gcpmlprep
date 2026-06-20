-- BigQuery ML (BQML) Reference Template
-- This SQL script demonstrates the lifecycle of training, evaluating, and predicting
-- with a classification model in BigQuery using SQL-based preprocessing.

-- =========================================================================
-- 1. CREATE AND TRAIN THE MODEL WITH PREPROCESSING
-- =========================================================================
-- The TRANSFORM clause encapsulates all preprocessing logic within the model.
-- This guarantees that the exact same preprocessing is applied during prediction,
-- completely preventing training-serving skew.
CREATE OR REPLACE MODEL `your_project.your_dataset.churn_classifier`
TRANSFORM(
  -- Label is passed through directly
  churned,
  -- Scale numerical features to a standard normal distribution (mean=0, std=1)
  ML.STANDARD_SCALER(customer_age) OVER() AS age_scaled,
  ML.STANDARD_SCALER(total_spend) OVER() AS spend_scaled,
  -- One-hot encode categorical features (handled automatically by BQML for string fields,
  -- but we can explicitly parse or clean strings here)
  LOWER(country) AS country_clean,
  -- Bucketize features (e.g. converting numeric to ordinal intervals)
  ML.QUANTILE_BUCKETIZER(tenure_months, 4) OVER() AS tenure_bucket
)
OPTIONS(
  MODEL_TYPE = 'LOGISTIC_REG',
  INPUT_LABEL_COLS = ['churned'],
  -- Enable L2 regularization to prevent overfitting
  L2_REG = 0.1,
  -- Automatically split data for evaluation (80/20 train/eval)
  DATA_SPLIT_METHOD = 'AUTO_SPLIT'
) AS
SELECT
  churned,
  customer_age,
  total_spend,
  country,
  tenure_months
FROM
  `your_project.your_dataset.customer_transactions`
WHERE
  -- Exclude records with missing labels
  churned IS NOT NULL;


-- =========================================================================
-- 2. EVALUATE MODEL PERFORMANCE
-- =========================================================================
-- ML.EVALUATE returns precision, recall, accuracy, f1_score, log_loss, and roc_auc.
SELECT
  *
FROM
  ML.EVALUATE(
    MODEL `your_project.your_dataset.churn_classifier`,
    (
      SELECT
        churned,
        customer_age,
        total_spend,
        country,
        tenure_months
      FROM
        `your_project.your_dataset.customer_transactions_test`
    )
  );


-- =========================================================================
-- 3. RUN BATCH PREDICTION
-- =========================================================================
-- ML.PREDICT joins the model outputs (predicted_label, predicted_label_probs)
-- directly with your query inputs.
SELECT
  customer_id,
  predicted_churned,
  predicted_churned_probs[OFFSET(0)].prob AS probability_not_churned,
  predicted_churned_probs[OFFSET(1)].prob AS probability_churned
FROM
  ML.PREDICT(
    MODEL `your_project.your_dataset.churn_classifier`,
    (
      SELECT
        customer_id,
        customer_age,
        total_spend,
        country,
        tenure_months
      FROM
        `your_project.your_dataset.customer_transactions_new`
    )
  );


-- =========================================================================
-- 4. EXPLAIN PREDICTIONS (EXPLAINABLE AI)
-- =========================================================================
-- ML.EXPLAIN_PREDICT returns predictions along with the top feature attributions
-- showing which features drove the decision for each row.
SELECT
  customer_id,
  predicted_churned,
  probability,
  top_feature_attributions
FROM
  ML.EXPLAIN_PREDICT(
    MODEL `your_project.your_dataset.churn_classifier`,
    (
      SELECT
        customer_id,
        customer_age,
        total_spend,
        country,
        tenure_months
      FROM
        `your_project.your_dataset.customer_transactions_new`
    ),
    STRUCT(3 AS top_k_features) -- return top 3 contributing features
  );
