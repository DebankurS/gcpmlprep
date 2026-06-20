# Domain 6: Generative AI on Google Cloud

This study guide covers the Generative AI domain of the GCP Machine Learning Engineer Exam: foundations of LLMs, engineering options (RAG vs. Tuning), Google Cloud GenAI tools, and the current SDK landscape.

---

## 1. Vertex AI Generative AI Ecosystem

Vertex AI includes a complete suite of tools to prototype, customize, evaluate, and deploy generative models.

```
[Vertex AI Model Garden] --> [Vertex AI Studio] --> [Vertex AI Agent Builder]
(Access Models)               (Test & Customize)      (Deploy Grounded Agents)
```

*   **Vertex AI Model Garden:** Curated catalog of first-party Google foundation models (Gemini, Imagen, Chirp), open-source models (Gemma 3, LLaMA 3, Mistral), and third-party models. Supports one-click deployment to Vertex AI Endpoints.
*   **Vertex AI Studio:** Console workspace for designing, testing, and saving prompts (text, chat, multimodal) and initiating model tuning jobs.
*   **Vertex AI Agent Builder:** Developer platform integrating search engines, conversational playbooks, and grounding tools to build enterprise AI agents.

---

## 2. Gemini Model Lineup (Exam Critical)

The exam tests your ability to select the right Gemini model for cost, speed, and capability trade-offs.

| Model | Best For | Context Window | Key Capability |
| :--- | :--- | :--- | :--- |
| **Gemini 2.5 Pro** | Complex reasoning, coding, long-context analysis. | 1M tokens | Highest accuracy. Built-in thinking/reasoning mode. |
| **Gemini 2.5 Flash** | High-throughput, low-latency production workloads. | 1M tokens | Best price-performance. Thinking mode optional. |
| **Gemini 2.0 Flash** | Fast, general-purpose tasks. | 1M tokens | Multimodal (text, image, video, audio). |
| **Gemma 3** | On-device / private inference. Open weights. | 128K tokens | Runs locally or on GKE; no data leaves your infra. |

> **Exam trap:** "Most cost-effective for high-throughput batch summarization" → Gemini 2.5 Flash. "Most accurate for complex multi-step reasoning" → Gemini 2.5 Pro.

---

## 3. SDK Migration: `google-genai` (Critical — June 2026)

> **WARNING:** The `vertexai.generative_models` module is **removed on June 24, 2026**. All production code must migrate to the `google-genai` SDK.

### Old SDK (deprecated)
```python
# DO NOT USE — removed June 24, 2026
from vertexai.generative_models import GenerativeModel
model = GenerativeModel("gemini-2.0-flash")
response = model.generate_content("Summarize this contract.")
```

### New SDK (google-genai)
```python
pip install google-genai
```
```python
from google import genai
from google.genai.types import GenerateContentConfig

client = genai.Client(vertexai=True, project="my-project", location="us-central1")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Summarize this contract.",
    config=GenerateContentConfig(temperature=0.2),
)
print(response.text)
```

---

## 4. Choosing the Right Customization Method

| Method | What it is | Best For | Implementation Cost |
| :--- | :--- | :--- | :--- |
| **Prompt Engineering** | System instructions, few-shot examples, input templates. | General reasoning, summarization, simple classification. | **Lowest** |
| **Retrieval-Augmented Generation (RAG)** | Query a vector database for context before invoking the LLM. | Private enterprise knowledge, reducing hallucinations, real-time facts. | **Medium** |
| **Supervised Fine-Tuning (SFT)** | Retrain foundation model on prompt-response pairs. | Specific output formats (JSON schema), specialized vocabulary, tone/style. | **High** |
| **PEFT / Adapter Tuning (LoRA)** | Freeze base model weights; train small adapter layers only. | Same use cases as SFT but with far less GPU memory and compute. | **Medium-High** |
| **RLHF** | Align outputs using human preference reward models. | Minimizing toxicity, aligning with human values. | **Highest** |

> **Exam trap:** "Fine-tune but minimize GPU hours" → **LoRA/PEFT adapter tuning**, not full SFT.

### Gemini Fine-Tuning on Vertex AI
```python
import vertexai
from vertexai.preview.tuning import sft

vertexai.init(project="my-project", location="us-central1")

tuning_job = sft.train(
    source_model="gemini-2.0-flash",
    train_dataset="gs://my-bucket/tuning_data.jsonl",  # prompt-response pairs
    validation_dataset="gs://my-bucket/validation_data.jsonl",
    epochs=3,
    adapter_size=4,  # LoRA rank — lower = fewer params trained
    tuned_model_display_name="my-contract-summarizer",
)
```

---

## 5. Controlled Generation (`response_schema`)

When prompt engineering alone cannot enforce a rigid JSON output structure, use `response_schema` to guarantee schema compliance.

```python
from google import genai
from google.genai import types

client = genai.Client(vertexai=True, project="my-project", location="us-central1")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Extract the invoice data from the following text: ...",
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema={
            "type": "object",
            "properties": {
                "vendor_name": {"type": "string"},
                "invoice_date": {"type": "string"},
                "total_amount": {"type": "number"},
            },
            "required": ["vendor_name", "invoice_date", "total_amount"],
        },
    ),
)
```

> **Exam trap:** "Prompt engineering not reliably producing JSON" → use `response_schema` (controlled generation), not fine-tuning, as the first step.

---

## 6. Context Caching

Context caching reduces cost and latency when the **same large context** (e.g., a 500-page document, a system prompt) is reused across many requests.

*   **How it works:** Upload a large prompt prefix to the Gemini API once; receive a `cache_name`. Subsequent calls reference the cache instead of re-sending the tokens.
*   **Billing:** Cached tokens cost ~4x less than input tokens. Cache has a configurable TTL (default 1 hour).
*   **When to use:** Same document/system prompt sent with >32K tokens across many requests.

```python
from google import genai
from google.genai import types
import datetime

client = genai.Client(vertexai=True, project="my-project", location="us-central1")

# Create cache from a large document
cache = client.caches.create(
    model="gemini-2.5-flash",
    contents=[types.Content(role="user", parts=[types.Part(text=LARGE_DOCUMENT)])],
    config=types.CreateCachedContentConfig(
        display_name="legal-corpus-cache",
        ttl=datetime.timedelta(hours=2),
    ),
)

# Reference cache in subsequent calls
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Summarize the liability clauses.",
    config=types.GenerateContentConfig(cached_content=cache.name),
)
```

---

## 7. Multimodal Capabilities

Gemini 2.0 Flash and 2.5 models are natively multimodal — they accept **text, images, video, audio, and PDF** inputs in a single API call.

```python
from google import genai
from google.genai import types

client = genai.Client(vertexai=True, project="my-project", location="us-central1")

with open("invoice.pdf", "rb") as f:
    pdf_bytes = f.read()

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[
        types.Part(inline_data=types.Blob(mime_type="application/pdf", data=pdf_bytes)),
        types.Part(text="Extract the vendor name and total amount."),
    ],
)
```

> **Exam trap:** "Extract structured fields from scanned PDF with least code" → Document AI (Invoice Parser). "Complex reasoning over a PDF alongside text" → Gemini multimodal.

---

## 8. System Instructions

System instructions set persistent behavior for the model across the entire conversation — role, tone, output format, constraints.

```python
from google import genai
from google.genai import types

client = genai.Client(vertexai=True, project="my-project", location="us-central1")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="What is our return policy?",
    config=types.GenerateContentConfig(
        system_instruction="You are a customer support agent for Acme Corp. "
                           "Only answer questions about Acme products. "
                           "Always respond in formal English. "
                           "Never reveal internal pricing structures.",
    ),
)
```

---

## 9. Vertex AI Vector Search

Formerly **Matching Engine** — fully managed, highly scalable vector database for Approximate Nearest Neighbor (ANN) search on high-dimensional embeddings.

### Key Use Cases
*   **RAG pipelines:** Convert documents into embeddings (Vertex AI Embeddings API), index in Vector Search, query with user question embedding to fetch relevant chunks.
*   **Recommendation systems:** Index user/item embeddings to find similar items in sub-millisecond response times.
*   **Supported algorithms:** ScaNN (Scalable Nearest Neighbors), IVF (Inverted File Index).

### RAG Architecture on GCP
```
[User Query]
     |
     v
[Vertex AI Embeddings API] --> Query Embedding
     |
     v
[Vertex AI Vector Search] --> Top-K Relevant Chunks
     |
     v
[Gemini (with chunks as context)] --> Grounded Answer
```

---

## 10. Grounding and Safety

### Grounding
*   **Vertex AI Search Grounding:** Anchor Gemini predictions to enterprise data in GCS, BigQuery, or web search.
*   **Google Search Grounding:** Ground responses in live web search results — useful for real-time facts.
*   **Effect:** Forces the model to cite sources and stay within boundaries of provided data.

### Safety Filters
Vertex AI provides built-in safety filters for foundation models.
*   **Categories:** Hate Speech, Harassment, Sexually Explicit, Dangerous Content.
*   **Thresholds:** `BLOCK_LOW_AND_ABOVE`, `BLOCK_MEDIUM_AND_ABOVE`, `BLOCK_ONLY_HIGH`, `OFF`.
*   **Response:** If triggered, API returns a safety warning and blocks the completion — your application must handle `finish_reason == "SAFETY"`.

---

## 11. Architectural Decision Matrix (Exam Guide)

| Scenario | Solution |
| :--- | :--- |
| Private enterprise knowledge base, reduce hallucinations, real-time facts. | **RAG** (Vertex AI Vector Search + Gemini grounding) |
| Rigid JSON output structure that prompt engineering cannot enforce. | **`response_schema`** (controlled generation) |
| Specific output style/vocabulary that prompt engineering cannot teach. | **SFT or LoRA fine-tuning** on Vertex AI |
| Minimize GPU hours for fine-tuning. | **LoRA/PEFT adapter tuning** (not full SFT) |
| Same 500-page document sent in context for 10,000 requests daily. | **Context Caching** |
| Highest accuracy for complex multi-step reasoning tasks. | **Gemini 2.5 Pro** |
| Lowest cost for high-throughput batch summarization. | **Gemini 2.5 Flash** |
| On-device inference; data cannot leave company infrastructure. | **Gemma 3** (open weights, run on GKE) |
