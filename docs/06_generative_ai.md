# Domain 6: Generative AI on Google Cloud

This study guide covers the newly updated Generative AI domain of the GCP Machine Learning Engineer Exam: foundations of LLMs, engineering options (RAG vs. Tuning), and Google Cloud GenAI tools.

---

## 1. Vertex AI Generative AI Ecosystem

Vertex AI includes a complete suite of tools to prototype, customize, evaluate, and deploy generative models.

```
[Vertex AI Model Garden] --> [Vertex AI Studio] --> [Vertex AI Agent Builder]
(Access Models)               (Test & Customize)      (Deploy Grounded Agents)
```

*   **Vertex AI Model Garden:** A curated catalog containing first-party Google foundation models (Gemini, Imagen, Codey, Chirp), open-source models (Gemma, LLaMA 3, Mistral), and third-party models.
*   **Vertex AI Studio (formerly Generative AI Studio):** A console workspace for designing, testing, and saving prompts (text, chat, multimodal) and initiating model tuning jobs.
*   **Vertex AI Agent Builder:** A developer platform that integrates search engines, conversational playbooks, and grounding tools to build enterprise AI agents using natural language instructions.

---

## 2. Choosing the Right Customization Method

The exam will test your ability to select the most cost-effective and appropriate architecture for generative AI systems.

| Method | What it is | Best For | Implementation Cost |
| :--- | :--- | :--- | :--- |
| **Prompt Engineering** | Crafting system instructions, few-shot examples, and input templates. | General reasoning, summarization, simple classification. | **Lowest** (No training required, standard inference costs). |
| **Retrieval-Augmented Generation (RAG)** | Grounding the model by querying a search index or vector database for context *before* invoking the LLM. | Accessing private enterprise knowledge, reducing hallucinations, real-time facts. | **Medium** (Vector database hosting, search pipeline setup). |
| **Supervised Fine-Tuning (SFT)** | Retraining a foundation model on a dataset of prompt-response pairs to adjust weights. | Changing model tone/style, teaching specific output formats (e.g., JSON structure), specialized vocabulary. | **High** (Requires preparation of labeled datasets, compute GPU/TPU hours). |
| **Reinforcement Learning from Human Feedback (RLHF)** | Aligning model outputs using human preferences and reward models. | Minimizing toxicity, alignment with human values/intent. | **Highest** (Requires human annotator feedback loop and complex training). |

---

## 3. Vertex AI Vector Search

Formerly known as **Matching Engine**, this is a fully managed, highly scalable vector database designed to index and perform Approximate Nearest Neighbor (ANN) search on high-dimensional embeddings.

### Key Use Cases
*   **Vector Search for RAG:** Convert documents into embedding vectors (using Vertex AI Embeddings API), index them in Vector Search, and query the index using a user's question embedding to fetch relevant chunks.
*   **Recommendation Systems:** Index user and item embeddings to find similar items in sub-millisecond response times.
*   **Supported Indexing Algorithms:** ScaNN (Scalable Nearest Neighbors), IVFs (Inverted File Index).

---

## 4. Grounding and Responsible GenAI

### Grounding
Grounding is the process of anchoring LLM outputs to verifiable sources of truth.
*   **Vertex AI Search Grounding:** Ground Gemini predictions using enterprise data in Google Cloud Storage, BigQuery, or web search.
*   **How it Works:** The system searches the grounded source, passes the context documents, and forces the model to cite sources and stay within the boundaries of the provided data.

### Safety Filters
Vertex AI provides built-in safety filters for foundation models to block harmful content.
*   **Categories:** Hate Speech, Harassment, Sexually Explicit, Dangerous Content.
*   **Configuration:** You can adjust the threshold for each category (e.g., `BLOCK_LOW_AND_ABOVE`, `BLOCK_MEDIUM_AND_ABOVE`, `BLOCK_ONLY_HIGH`).
*   **Response:** If a filter is triggered, the API returns a safety warning and blocks the completion, which your application must handle.
