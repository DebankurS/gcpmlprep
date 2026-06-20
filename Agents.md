# GCP AI Agents & Reasoning Engines Study Guide

This guide covers the architectural design, implementation, and deployment of **AI Agents and Reasoning Engines** on Google Cloud Platform (GCP)—a critical topic in the updated GCP Professional Machine Learning Engineer exam.

---

## 1. Conceptual Framework: What is an Agent?

In the context of Vertex AI, an **AI Agent** is an autonomous system that uses a Large Language Model (LLM) as its central reasoning engine to decide actions, access tools, utilize memory, and interact with users or external systems to achieve a goal.

```
                  +-----------------------------------+
                  |            LLM Brain              |
                  |     (Gemini/Claude/Gemma)         |
                  +-----------------+-----------------+
                                    |
            +-----------------------+-----------------------+
            |                       |                       |
            v                       v                       v
      +-----+------+          +-----+------+          +-----+------+
      |   Memory   |          |    Planning|          |    Tools   |
      | (Firestore)|          | (ReAct/DAG)|          |  (APIs/SQL)|
      +------------+          +------------+          +------------+
```

1.  **Brain:** The LLM (e.g., Gemini) that performs cognitive tasks, reasoning, and instruction-following.
2.  **Memory:**
    *   *Short-term:* Conversation context (chat history) passed within the prompt window.
    *   *Long-term:* Storing user profiles and historical states across sessions.
3.  **Planning:** Breaking down complex tasks into sub-goals (e.g., ReAct loop: *Reasoning -> Action -> Observation*).
4.  **Tools:** Access to external resources (e.g., executing SQL, invoking APIs via OpenAPI schemas, calling Cloud Functions).

---

## 2. Agent Builder vs. Reasoning Engine (Exam Core)

Google Cloud provides two primary paths for building agents. Choosing the right one based on developer skill set and customization requirements is a common exam pattern.

| Feature | Vertex AI Agent Builder | Vertex AI Reasoning Engine |
| :--- | :--- | :--- |
| **Pace / Coding** | **No-code / Low-code** configuration UI. | **Code-first** development in Python (SDK). |
| **Orchestration** | Configured via **Playbooks** (natural language instructions). | Programmed using frameworks like **LangChain**, LlamaIndex, or custom code. |
| **Hosting** | Fully managed, serverless agent runner. | Deploys local Python agent code as a microservice on Vertex AI. |
| **Grounding** | Integrates directly with Vertex AI Search (data stores). | Handled programmatically via retrievers or custom vector search APIs. |
| **Best For** | Business logic, customer support bots, data search portals. | Complex software engineering loops, custom agent loops, research. |

---

## 3. Vertex AI Agent Builder

**Agent Builder** allows developers to build enterprise-ready agents grounded in company data.

### Key Components
1.  **Playbooks:** Instead of writing complex state machine code (like Dialogflow CX pages), you write playbooks using natural language.
    *   *Example Instruction:* "You are a reservation assistant. First, ask the user for their name and order ID. If they want to cancel, use the CancelOrder tool. If they want to change the date, verify availability using the CheckAvailability tool."
2.  **Data Stores (Grounding):**
    *   Connect the agent to Google Cloud Storage (PDFs, HTML), BigQuery, or web URLs.
    *   The agent uses RAG under the hood to answer questions *only* based on the connected data stores.
3.  **Tools:**
    *   **OpenAPI Tool:** Defines REST API endpoints (via OpenAPI JSON/YAML) that the agent can call to perform actions (e.g., checking a database).
    *   **Vertex AI Extensions:** Pre-built integrations (e.g., Google Search, Web Interpreter code runner).

---

## 4. Vertex AI Reasoning Engine (Template-based Agent)

The **Reasoning Engine** (formerly known as LangChain on Vertex AI) lets you build custom Python agents locally and deploy them to a managed, serverless runtime on GCP.

### Deployment Workflow
1.  **Define local Python Class:**
    ```python
    from google.cloud import aiplatform

    class MyCustomAgent:
        def __init__(self, model_name: str):
            self.model_name = model_name
            
        def query(self, text: str) -> str:
            # Custom LangChain/LlamaIndex or Python code here
            return f"Processed query with {self.model_name}: {text}"
    ```
2.  **Initialize and Register:**
    ```python
    aiplatform.init(project="my-project", location="us-central1")
    
    # Deploy to Vertex AI
    reasoning_engine = aiplatform.ReasoningEngine.create(
        MyCustomAgent(model_name="gemini-1.5-pro"),
        requirements=["google-cloud-aiplatform", "langchain"],
        display_name="my-custom-python-agent"
    )
    ```
3.  **Query the deployed endpoint:** The agent is exposed as a secure REST API endpoint managed by Vertex AI, handling autoscaling and IAM security automatically.

---

## 5. Function Calling & Tool Use

**Function Calling** is the mechanism by which Gemini models interact with external systems. The model *does not* execute the function; it outputs a structured JSON object containing the arguments required to run the function.

```
[User Request] 
      |
      v
[Gemini Model] + (Function Declarations) 
      |
      +---> Outputs: { name: "get_weather", args: { city: "Seattle" } } (Function Call)
      |
      v
[Client App] (Executes actual API request locally or via server)
      |
      +---> Fetches result: { temp: "62F", condition: "Rain" }
      |
      v
[Gemini Model] + (Function Response)
      |
      v
[Final Answer to User]: "It is currently 62F and raining in Seattle."
```

### Exam Scenarios
*   **Scenario:** You want Gemini to query real-time stock prices. Stock data is in a private internal API.
    *   *Solution:* Define a `get_stock_price` function declaration, pass it to Gemini during the API call, parse the returned `functionCall` object in your client code, fetch the data from your API, and send it back to Gemini as a `functionResponse`.

---

## 6. Memory Patterns on GCP

AI agents require persistent memory to track conversation context across sessions.

| Storage System | Memory Type | Why Choose It on GCP |
| :--- | :--- | :--- |
| **Cloud Firestore** | Session History / Short-term Chat Logs | Serverless NoSQL database. Low latency, auto-scaling, natively supported by LangChain's `FirestoreChatMessageHistory`. |
| **Cloud SQL / Lakebase** | Relational / Long-term Profiles | Best when session states are tied to existing transactional customer databases. |
| **Memorystore (Redis)** | Cache / In-memory Context | Ultra-low latency (sub-millisecond) for high-scale real-time conversational agents. |

---

## 7. Exam Architectural Decision Matrix

*   **Scenario:** You need to build a customer assistant chatbot that integrates with your internal REST APIs and GCS PDF brochures. Your development team consists of conversational designers with minimal Python engineering resources.
    *   *Solution:* Use **Vertex AI Agent Builder (Playbooks)**. You can define the bot instructions in plain English, attach the GCS bucket as a Data Store, and configure the REST APIs as OpenAPI Tools.
*   **Scenario:** You need to deploy a complex multi-agent system utilizing LangGraph that executes code in a sandbox, checks outputs, and loops recursively.
    *   *Solution:* Deploy using **Vertex AI Reasoning Engine** with custom Python agent templates.
*   **Scenario:** You want to secure your Agent API endpoint so that only specific service accounts can invoke it.
    *   *Solution:* Bind the service account to the **Vertex AI User** IAM role on the deployed Reasoning Engine or Agent Builder endpoint.
