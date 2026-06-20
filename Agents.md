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

1.  **Brain:** The LLM (e.g., Gemini 2.0 Flash, Gemini 2.5 Pro) that performs cognitive tasks, reasoning, and instruction-following.
2.  **Memory:**
    *   *Short-term:* Conversation context (chat history) passed within the prompt window.
    *   *Long-term:* Storing user profiles and historical states across sessions (Agent Engine Memory Bank).
3.  **Planning:** Breaking down complex tasks into sub-goals (e.g., ReAct loop: *Reasoning -> Action -> Observation*).
4.  **Tools:** Access to external resources (e.g., executing SQL, invoking APIs via OpenAPI schemas, calling Cloud Functions).

---

## 2. Vertex AI Agent Builder: Platform Overview (Exam Core)

**Vertex AI Agent Builder** is now the **umbrella product** encompassing three distinct components. Understanding this structure is critical for the exam.

```
+---------------------------------------------------------------+
|              Vertex AI Agent Builder                          |
|                                                               |
|  +-------------------+  +-----------------+  +-------------+ |
|  |        ADK        |  |  Agent Studio   |  |Agent Engine | |
|  | (code-first SDK)  |  | (low-code UI)   |  | (runtime)   | |
|  +-------------------+  +-----------------+  +-------------+ |
+---------------------------------------------------------------+
```

| Component | Purpose | Best For |
| :--- | :--- | :--- |
| **ADK** (Agent Development Kit) | Open-source framework for building agents in Python, Go, Java, TypeScript. Model-agnostic. | Custom agent logic, multi-agent systems, LangGraph/LangChain integration. |
| **Agent Studio** | Low-code visual canvas (Playbooks + Agent Designer in Cloud Console). | Conversational designers, minimal Python engineering resources. |
| **Agent Engine** | Managed, serverless runtime for deploying agents at scale. Handles autoscaling, IAM, Sessions, Memory Bank, Code Execution. | Production deployment of any agent (ADK, LangChain, custom Python). |

> **Exam trap:** "Reasoning Engine" is the old name for Agent Engine. Both names may appear on the exam. The REST resource path (`projects/locations/reasoningEngines`) still uses the old name.

---

## 3. ADK — Agent Development Kit

**ADK** is Google's open-source, code-first framework for building agents. It is model-agnostic (works with Gemini, Claude, Gemma, etc.) and framework-agnostic (works standalone, with LangChain, or with LangGraph).

### Key Concepts
- **Agent**: Core reasoning unit wrapping an LLM + tools + instructions.
- **Tool**: Any Python function decorated with `@tool` that the agent can call.
- **Runner**: Executes the agent loop (ReAct, sequential, parallel, custom).
- **Multi-agent**: ADK natively supports hierarchical and parallel multi-agent graphs.

### Install
```bash
pip install --upgrade google-cloud-aiplatform[agent_engines,adk]>=1.112
```

### Minimal ADK Agent Example
```python
from google.adk.agents import Agent
from google.adk.tools import google_search

root_agent = Agent(
    name="research_agent",
    model="gemini-2.0-flash",
    description="Answers questions using Google Search.",
    instruction="Search the web to answer the user's question accurately.",
    tools=[google_search],
)
```

### Deploy to Agent Engine
```python
import vertexai
from vertexai.preview import reasoning_engines  # ponytail: old import still works

vertexai.init(project="my-project", location="us-central1")

# Wrap and deploy
app = reasoning_engines.AdkApp(agent=root_agent, enable_tracing=True)

remote_agent = reasoning_engines.ReasoningEngine.create(
    app,
    requirements=["google-cloud-aiplatform[agent_engines,adk]>=1.112"],
    display_name="research-agent-prod",
)
```

### Query Deployed Agent
```python
import vertexai

client = vertexai.Client(project="my-project", location="us-central1")
remote = client.agent_engines.get(
    name="projects/my-project/locations/us-central1/reasoningEngines/RESOURCE_ID"
)
response = remote.query(input="What is the current Gemini pricing?")
```

---

## 4. Agent Studio (Low-Code Path)

**Agent Studio** (formerly the Playbook-based Agent Builder UI) allows non-engineers to build agents without writing code.

### Key Components
1.  **Playbooks:** Natural language instructions for the agent.
    *   *Example:* "You are a reservation assistant. Ask for name and order ID. Use `CancelOrder` tool for cancellations. Use `CheckAvailability` tool for date changes."
2.  **Agent Designer:** Visual drag-and-drop canvas in the Cloud Console (Preview, Dec 2025) for designing agent flows graphically.
3.  **Data Stores (Grounding):**
    *   Connect to GCS (PDFs, HTML), BigQuery, or web URLs.
    *   Uses RAG under the hood — answers grounded in connected data only.
4.  **Tools:**
    *   **OpenAPI Tool:** Defines REST API endpoints (via OpenAPI JSON/YAML) the agent can call.
    *   **Vertex AI Extensions:** Pre-built integrations (Google Search, Web Interpreter code runner).

---

## 5. Agent Engine — Managed Runtime

**Agent Engine** (formerly Reasoning Engine) is the serverless managed runtime that deploys any Python-based agent. It handles autoscaling, IAM, logging, and tracing automatically.

### Deployment Workflow (Custom Python Agent)
```python
import vertexai
from vertexai.preview import reasoning_engines

vertexai.init(project="my-project", location="us-central1")

class MyCustomAgent:
    def __init__(self, model_name: str):
        self.model_name = model_name

    def set_up(self):
        # Called once on deployment — initialize clients, connections
        pass

    def query(self, text: str) -> str:
        # Custom LangChain/LangGraph/ADK code here
        return f"Processed query with {self.model_name}: {text}"

remote_agent = reasoning_engines.ReasoningEngine.create(
    MyCustomAgent(model_name="gemini-2.0-flash"),
    requirements=["google-cloud-aiplatform[agent_engines]>=1.112", "langchain"],
    display_name="my-custom-agent",
)
```

### Agent Engine Capabilities (GA Status)
| Feature | Status | Notes |
| :--- | :--- | :--- |
| Sessions | GA (Dec 2025) | Short-term state across multiple turns within a user session. |
| Memory Bank | GA (Dec 2025) | Long-term persistent memory across sessions. $0.25/1,000 stored events (from Jan 2026). |
| Code Execution | GA (Feb 2026) | Sandboxed code execution inside the agent runtime. |
| Tracing / Unified Trace Viewer | GA | Debugging agent reasoning paths in Cloud Console. |

> **SDK Deprecation Warning:** `vertexai.generative_models` was deprecated June 24, 2025 and will be **removed June 24, 2026**. Migrate LangchainAgent Tool imports to the `google-genai` SDK (`pip install google-genai`).

---

## 6. Function Calling & Tool Use

**Function Calling** is the mechanism by which Gemini models interact with external systems. The model *does not* execute the function; it outputs a structured JSON object containing the arguments required to run the function.

```
[User Request]
      |
      v
[Gemini Model] + (Function Declarations)
      |
      +---> Outputs: { name: "get_weather", args: { city: "Seattle" } }  (Function Call)
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
*   **Scenario:** You want Gemini to query real-time stock prices from a private internal API.
    *   *Solution:* Define a `get_stock_price` function declaration, pass it during the API call, parse the returned `functionCall` object in client code, fetch from your API, send back as a `functionResponse`.

---

## 7. Memory Patterns on GCP

AI agents require persistent memory to track conversation context across sessions.

| Storage System | Memory Type | Why Choose It on GCP |
| :--- | :--- | :--- |
| **Agent Engine Sessions** | Short-term / Turn state | Managed by Agent Engine natively. GA. No external DB needed. |
| **Agent Engine Memory Bank** | Long-term / Cross-session | Managed persistent memory. GA. Stores distilled facts, preferences. $0.25/1K events. |
| **Cloud Firestore** | Session History / Chat Logs | Serverless NoSQL. Low latency, auto-scaling. Natively supported by LangChain's `FirestoreChatMessageHistory`. Use when you need full control of raw history. |
| **Cloud SQL / Lakebase** | Relational / Long-term Profiles | Best when session states tie to existing transactional customer databases. |
| **Memorystore (Redis)** | Cache / In-memory Context | Sub-millisecond latency for high-scale real-time conversational agents. |

---

## 8. Multi-Agent Systems & A2A Protocol

**A2A (Agent-to-Agent)** is an open protocol (under the Linux Foundation) for agent-to-agent coordination. Agent Engine supports deploying and using A2A-compatible agents.

```
+------------------+      A2A Protocol      +------------------+
| Supervisor Agent | <--------------------> | Specialist Agent |
| (Orchestrator)   |   (task delegation,    | (e.g., SQL Agent)|
+------------------+    result passing)     +------------------+
```

### Key Patterns
*   **Hierarchical:** Supervisor agent delegates sub-tasks to specialist agents.
*   **Parallel:** Multiple agents run concurrently; results merged by orchestrator.
*   **LangGraph on Agent Engine:** Deploy stateful multi-agent graphs using LangGraph; Agent Engine handles the runtime.

### Exam Scenario
*   **Scenario:** Deploy a complex multi-agent system using LangGraph that executes code in a sandbox, checks outputs, and loops recursively.
    *   *Solution:* Deploy using **Vertex AI Agent Engine** with a custom Python class wrapping your LangGraph graph. Use Agent Engine Code Execution (GA) for sandboxed code.

---

## 9. IAM & Security

*   Bind the invoking service account to the **Vertex AI User** (`roles/aiplatform.user`) IAM role on the Agent Engine resource.
*   Agent Engine endpoints are private by default — require authenticated Google Cloud service account tokens.
*   Tool governance: Agent Studio provides enhanced tool governance controls to restrict which tools agents can invoke.

---

## 10. Exam Architectural Decision Matrix

| Scenario | Solution |
| :--- | :--- |
| Conversational designers, minimal Python, GCS PDFs + REST APIs. | **Agent Studio** (Playbooks + OpenAPI Tools + Data Stores) |
| Complex multi-agent LangGraph system with recursive loops and code execution. | **ADK + Agent Engine** with Code Execution enabled. |
| Deploy existing LangChain Python agent to managed serverless runtime. | **Agent Engine** (custom Python class or `AdkApp` wrapper). |
| Agent must remember user preferences across sessions over weeks. | **Agent Engine Memory Bank** (GA). |
| Ultra-low latency in-session context for high-throughput real-time chat. | **Memorystore (Redis)** for in-session cache. |
| Secure Agent Engine endpoint to only specific service accounts. | Bind service account to **Vertex AI User** IAM role on the Agent Engine resource. |
| Agent must coordinate with a specialist agent built by another team. | Use **A2A protocol** (open standard, supported natively on Agent Engine). |
