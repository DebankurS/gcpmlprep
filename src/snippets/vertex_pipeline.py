# Vertex AI Pipelines (KFP SDK v2) Reference Template
# This script defines a 3-step ML training pipeline using the Kubeflow Pipelines SDK
# and compiles it for execution on Vertex AI.

import os
from kfp import dsl
from kfp import compiler
from google.cloud import aiplatform

# =========================================================================
# 1. DEFINE PIPELINE COMPONENTS
# =========================================================================
# Components are isolated running containers. We define them using Python-function
# based components with required base images and packages.

@dsl.component(
    base_image="python:3.10",
    packages_to_install=["pandas", "scikit-learn"]
)
def preprocess_data(
    input_gcs_path: str,
    preprocessed_dataset: dsl.Output[dsl.Dataset]
):
    """Component to download raw data, clean it, and save train/test splits."""
    import pandas as pd
    from sklearn.model_selection import train_test_split
    
    # Simulate loading data from Cloud Storage (in production, use smart-open or gcsfs)
    print(f"Reading raw data from: {input_gcs_path}")
    raw_df = pd.DataFrame({
        "feature1": [1.0, 2.0, 3.0, 4.0, 5.0, 6.0],
        "feature2": [10.0, 20.0, 30.0, 40.0, 50.0, 60.0],
        "label": [0, 1, 0, 1, 0, 1]
    })
    
    # Preprocessing logic
    processed_df = raw_df.dropna()
    
    # Save the output to the path provided by Vertex AI
    os.makedirs(preprocessed_dataset.path, exist_ok=True)
    processed_df.to_csv(os.path.join(preprocessed_dataset.path, "data.csv"), index=False)
    print("Preprocessing completed and artifact saved.")


@dsl.component(
    base_image="python:3.10",
    packages_to_install=["pandas", "scikit-learn", "joblib"]
)
def train_model(
    dataset: dsl.Input[dsl.Dataset],
    learning_rate: float,
    model_artifact: dsl.Output[dsl.Model]
):
    """Component to train a Scikit-learn Random Forest classifier."""
    import os
    import pandas as pd
    import joblib
    from sklearn.ensemble import RandomForestClassifier
    
    # Read the preprocessed dataset
    df = pd.read_csv(os.path.join(dataset.path, "data.csv"))
    X = df[["feature1", "feature2"]]
    y = df["label"]
    
    # Train the model
    print(f"Training Random Forest with learning_rate multiplier: {learning_rate}")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save model artifact
    os.makedirs(model_artifact.path, exist_ok=True)
    # Define framework/metadata for Vertex AI Model Registry integration
    model_artifact.metadata["framework"] = "scikit-learn"
    joblib.dump(model, os.path.join(model_artifact.path, "model.joblib"))
    print("Model training completed and model saved.")


@dsl.component(
    base_image="python:3.10",
    packages_to_install=["pandas", "scikit-learn", "joblib"]
)
def evaluate_model(
    dataset: dsl.Input[dsl.Dataset],
    model_artifact: dsl.Input[dsl.Model]
) -> str:
    """Component to evaluate the model and determine deployment eligibility."""
    import os
    import pandas as pd
    import joblib
    from sklearn.metrics import accuracy_score
    
    # Load dataset and model
    df = pd.read_csv(os.path.join(dataset.path, "data.csv"))
    X = df[["feature1", "feature2"]]
    y = df["label"]
    
    model = joblib.load(os.path.join(model_artifact.path, "model.joblib"))
    
    # Predict and calculate metric
    preds = model.predict(X)
    accuracy = accuracy_score(y, preds)
    print(f"Model accuracy: {accuracy}")
    
    # Decide deployment status based on threshold
    deploy_decision = "deploy" if accuracy >= 0.8 else "reject"
    return deploy_decision


# =========================================================================
# 2. DEFINE THE WORKFLOW (PIPELINE)
# =========================================================================
@dsl.pipeline(
    name="vertex-ai-demo-pipeline",
    description="An end-to-end training pipeline for Vertex AI."
)
def ml_pipeline(
    input_gcs_path: str = "gs://your-bucket-name/raw_data.csv",
    learning_rate: float = 0.01
):
    # Step 1: Preprocessing
    preprocess_task = preprocess_data(input_gcs_path=input_gcs_path)
    
    # Step 2: Training (depends on preprocess outputs)
    train_task = train_model(
        dataset=preprocess_task.outputs["preprocessed_dataset"],
        learning_rate=learning_rate
    )
    
    # Step 3: Evaluation (depends on preprocess & training outputs)
    eval_task = evaluate_model(
        dataset=preprocess_task.outputs["preprocessed_dataset"],
        model_artifact=train_task.outputs["model_artifact"]
    )


# =========================================================================
# 3. COMPILE AND RUN THE PIPELINE
# =========================================================================
if __name__ == "__main__":
    # Compile the pipeline definition into a JSON file
    pipeline_filename = "vertex_ml_pipeline.json"
    compiler.Compiler().compile(
        pipeline_func=ml_pipeline,
        package_path=pipeline_filename
    )
    print(f"Pipeline compiled successfully to {pipeline_filename}")

    # Code to trigger the pipeline run on Vertex AI
    # (Uncomment and run when configured with correct GCP Credentials/SDK)
    """
    aiplatform.init(
        project="your-gcp-project-id",
        location="us-central1"
    )

    job = aiplatform.PipelineJob(
        display_name="kfp-vertex-demo-run",
        template_path=pipeline_filename,
        pipeline_root="gs://your-vertex-pipelines-bucket/pipeline_root",
        parameter_values={
            "input_gcs_path": "gs://your-bucket-name/raw_data.csv",
            "learning_rate": 0.05
        }
    )

    job.run()
    """
