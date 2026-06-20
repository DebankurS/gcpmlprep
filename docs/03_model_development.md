# Domain 3: Model Development

This study guide covers Domain 3 of the GCP Machine Learning Engineer Exam: building, training, tuning, and evaluating custom ML models on Google Cloud.

---

## 1. Vertex AI Custom Training

When AutoML or BigQuery ML do not satisfy model requirements, Vertex AI Custom Training provides compute infrastructure to train custom TensorFlow, PyTorch, JAX, or Scikit-learn models.

### Pre-built vs. Custom Containers
*   **Pre-built Containers:** Google provides and maintains docker images with standard ML frameworks (TensorFlow, PyTorch, Scikit-learn, XGBoost) and CUDA drivers installed. **Exam Tip:** Use these by default to minimize operational overhead.
*   **Custom Containers:** Necessary only if your training script:
    *   Requires non-standard or private system libraries (e.g., custom C++ headers).
    *   Needs custom security/authentication tools.
    *   Uses a framework/version not supported by pre-built containers (e.g., custom JAX setup).

### Distributed Training Strategies
For training very large datasets or complex deep learning architectures, you can distribute workloads across multiple GPUs/TPUs using TensorFlow (`tf.distribute.Strategy`) or PyTorch (`DistributedDataParallel`):

| Distributed Strategy | Modality | Hardware Setup | How it Works |
| :--- | :--- | :--- | :--- |
| **MirroredStrategy** | Single VM, Multiple GPUs | 1 Node, Multi-GPU | Synchronous training where each GPU runs a replica of the model and processes a slice of the batch. Gradients are aggregated across all devices. |
| **MultiWorkerMirroredStrategy** | Multiple VMs, Multiple GPUs | Multi-Node, Multi-GPU | Similar to MirroredStrategy, but distributes the replicas across multiple host machines. |
| **ParameterServerStrategy** | Multiple VMs | Multi-Node | Separation of roles. **Parameter Servers** store the model weights; **Workers** fetch parameters, perform forward/backward passes, and send gradients back. Ideal for models with extremely large embeddings. |
| **TPUStrategy** | TPUs | Single or Multi-Node TPUs | Specifically designed to run model training on Google TPU pods. |

---

## 2. Hyperparameter Tuning with Vertex AI Vizier

**Vertex AI Vizier** is Google's black-box optimization service. It is used to tune hyperparameters (such as learning rate, batch size, dropout rate, number of layers) without manually writing grid-search loops.

### How Vizier Works
1.  **Bayesian Optimization:** Instead of randomly searching (Random Search) or checking every combination (Grid Search), Vizier uses probability models to select the next set of hyperparameters based on the results of past trials.
2.  **Configuration:** You define:
    *   **Metric:** What to optimize (e.g., `val_accuracy` max, `val_loss` min).
    *   **Parameters:** Type (Double, Integer, Categorical, Discrete) and Search Space (e.g., learning rate: `1e-4` to `1e-2` on a logarithmic scale).
3.  **Early Stopping:** Vizier can automatically kill trials that are performing poorly compared to previous runs to save costs.

---

## 3. Overfitting, Underfitting, and Remedies

Recognizing model performance issues and applying the correct remedies on Google Cloud is a major focus of the exam.

```
Low Training Error, High Validation Error  ==> Overfitting (High Variance)
High Training Error, High Validation Error ==> Underfitting (High Bias)
```

### Remedies for Overfitting (High Variance)
The model is memorizing the training data.
*   **Regularization:** Add $L1$ (Lasso) or $L2$ (Ridge) weight penalties.
*   **Dropout:** Randomly deactivate neurons during training (Neural Networks).
*   **Early Stopping:** Stop training when validation loss stops improving.
*   **Reduce Complexity:** Reduce the number of parameters/layers.
*   **Data Augmentation:** Synthesize new training data (e.g., rotating images).

### Remedies for Underfitting (High Bias)
The model is too simple to capture the underlying pattern.
*   **Increase Complexity:** Add more layers, neurons, or parameters.
*   **Feature Engineering:** Add polynomial features or interactions.
*   **Train Longer:** Increase the number of epochs or reduce learning rate.
*   **Decrease Regularization:** Loosen weight constraints.
