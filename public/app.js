// GCP Machine Learning Engineer Study Dashboard - Application Logic

// =========================================================================
// 0. QUESTIONS LOADER
// =========================================================================

/**
 * Fetches all domain JSON files and merges them into window.PRACTICE_QUESTIONS.
 * Files: public/questions/domain1.json … domain7.json
 */
async function loadQuestions() {
  const files = [
    'questions/domain1.json',
    'questions/domain2.json',
    'questions/domain3.json',
    'questions/domain4.json',
    'questions/domain5.json',
    'questions/domain6.json',
    'questions/domain7.json'
  ];
  const results = await Promise.all(
    files.map(f => fetch(f).then(r => {
      if (!r.ok) throw new Error(`Failed to load ${f}: ${r.status}`);
      return r.json();
    }))
  );
  window.PRACTICE_QUESTIONS = results.flat();
}

// =========================================================================
// 1. DATA AND CONSTANTS
// =========================================================================

// Official Exam Domains and Topics Checklist
const DOMAINS_CHECKLIST = [
  {
    id: 1,
    code: "D1",
    title: "Domain 1: Framing ML Problems & Architecting ML Solutions",
    subtitle: "Translating business challenges into ML solutions, defining metrics, and choosing products.",
    items: [
      { id: "d1_1", text: "Translate business challenges into ML problem types (regression, classification, clustering, anomaly detection, recommendation)." },
      { id: "d1_2", text: "Choose appropriate ML evaluation metrics (Precision, Recall, F1, RMSE, MAE, AUC-ROC) matching business constraints." },
      { id: "d1_3", text: "Select correct GCP ML service (Pre-trained APIs vs. BigQuery ML vs. Vertex AI AutoML vs. Vertex Custom Training)." },
      { id: "d1_4", text: "Analyze architectural trade-offs: cost, training time, deployment complexity, latency, and data movement." }
    ]
  },
  {
    id: 2,
    code: "D2",
    title: "Domain 2: Data Preparation & Processing",
    subtitle: "Inbound ETL pipelines, feature engineering, and managing data quality issues.",
    items: [
      { id: "d2_1", text: "Preprocess tabular and unstructured data in BigQuery and Cloud Storage." },
      { id: "d2_2", text: "Build scalable batch and stream data pipelines with Cloud Dataflow (Apache Beam) using Fixed/Sliding/Session windows." },
      { id: "d2_3", text: "Implement feature engineering and prevent training-serving skew using TensorFlow Transform (tf.Transform) graphs." },
      { id: "d2_4", text: "Design feature tables and fetch point-in-time features with Vertex AI Feature Store (Online vs. Offline storage)." },
      { id: "d2_5", text: "Mitigate data quality issues: missing data imputation, outlier clipping, and highly imbalanced datasets (SMOTE/weights)." }
    ]
  },
  {
    id: 3,
    code: "D3",
    title: "Domain 3: Model Development",
    subtitle: "Model building, distributed training, hyperparameter tuning, and evaluation.",
    items: [
      { id: "d3_1", text: "Develop models with TensorFlow, PyTorch, JAX, Scikit-learn, and XGBoost." },
      { id: "d3_2", text: "Configure Vertex AI Custom Training: choose between Google pre-built containers and custom Dockerfiles." },
      { id: "d3_3", text: "Implement distributed training strategies (tf.distribute.Mirrored, MultiWorkerMirrored, ParameterServer, TPU strategy)." },
      { id: "d3_4", text: "Configure Bayesian hyperparameter tuning jobs using Vertex AI Vizier with early stopping configurations." },
      { id: "d3_5", text: "Diagnose and remedy model training issues: address overfitting (regularization, dropout) and underfitting." }
    ]
  },
  {
    id: 4,
    code: "D4",
    title: "Domain 4: MLOps, Pipelines & Automation",
    subtitle: "Pipeline orchestration, model hosting, CI/CD, and continuous training automation.",
    items: [
      { id: "d4_1", text: "Build automated ML pipelines: compare Kubeflow Pipelines (KFP) and TensorFlow Extended (TFX) components." },
      { id: "d4_2", text: "Manage model versions, tags, and lifecycle states in Vertex AI Model Registry." },
      { id: "d4_3", text: "Host models on Vertex AI Endpoints: configure private endpoints (VPC peering), autoscaling, and traffic splitting." },
      { id: "d4_4", text: "Set up Continuous Training (CT) triggers: Eventarc, Pub/Sub, Cloud Functions, and Cloud Scheduler." }
    ]
  },
  {
    id: 5,
    code: "D5",
    title: "Domain 5: Monitoring, Optimization & Responsible AI",
    subtitle: "Operational monitoring, explainability methods, ethics, and data privacy.",
    items: [
      { id: "d5_1", text: "Configure Vertex AI Model Monitoring to detect training-serving skew and prediction drift (JS divergence, L1 distance, PSI)." },
      { id: "d5_2", text: "Implement Explainable AI (XAI) feature attributions: configure Sampled Shapley, Integrated Gradients, and XRAI." },
      { id: "d5_3", text: "Audit model fairness (Demographic parity, Equal opportunity) and author Model Cards for compliance." },
      { id: "d5_4", text: "Apply privacy practices: anonymization, Cloud DLP, and differential privacy principles." }
    ]
  },
  {
    id: 6,
    code: "D6",
    title: "Domain 6: Generative AI on Google Cloud",
    subtitle: "Foundation models, RAG architectures, model customization, grounding, and safety filters.",
    items: [
      { id: "d6_1", text: "Access and prototype foundation models inside Vertex AI Model Garden and Vertex AI Studio." },
      { id: "d6_2", text: "Design Retrieval-Augmented Generation (RAG) pipelines using Vertex AI Vector Search (Matching Engine)." },
      { id: "d6_3", text: "Differentiate customization paths: choose Prompt Engineering vs. Grounding vs. Supervised Fine-Tuning (SFT) vs. RLHF." },
      { id: "d6_4", text: "Implement Model Grounding with enterprise data sources (Vertex AI Search) and adjust content safety filters." }
    ]
  },
  {
    id: 7,
    code: "AG",
    title: "Domain 7: Agents & Reasoning Engines",
    subtitle: "Orchestrating agents, memory systems, tools, and multi-agent coordination.",
    items: [
      { id: "d7_1", text: "Build code-first agents with the ADK (Agent Development Kit) and deploy them to Vertex AI Agent Engine serverless runtime." },
      { id: "d7_2", text: "Design conversational agents with Agent Studio using playbooks, visual flows, and OpenAPI tools." },
      { id: "d7_3", text: "Configure persistent memory using short-term Sessions and long-term Memory Bank, or Firestore/Redis." },
      { id: "d7_4", text: "Implement multi-agent systems and agent-to-agent coordination using the A2A protocol." }
    ]
  }
];



// =========================================================================
// 2. STATE MANAGEMENT
// =========================================================================
let trackerState = {};
let quizState = {
  activeQuestions: [],
  currentIndex: 0,
  score: 0,
  hasAnswered: false,
  selectedOption: null
};
let _progressData = { tracker: {}, scheduler: null };

async function loadProgress() {
  try {
    const res = await fetch('/api/progress');
    if (res.ok) { const d = await res.json(); if (d && typeof d === 'object') _progressData = d; }
  } catch (e) { /* server unavailable, use empty state */ }
}

let _saveProgressTimer = null;
async function saveProgress() {
  clearTimeout(_saveProgressTimer);
  _saveProgressTimer = setTimeout(async () => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(_progressData)
      });
    } catch (e) { /* silent */ }
  }, 500);
}

// =========================================================================
// 3. INITIALIZATION & ROUTING
// =========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await loadQuestions();
  await loadProgress();
  initTrackerState();
  renderChecklist();
  updateProgressUI();
  setupRouting();
  setupNotesMenu();
  setupQuizEvents();
  setupPlaygroundEvents();
  initStudyPlan();

  // Default: load the first notes doc
  loadNotesDoc("01_framing_and_architecture.md");
});

// Theme Management (Light / Dark Mode)
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem("gcp-mle-theme") || "dark";
  
  if (storedTheme === "light") {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
  
  themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("dark-theme")) {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem("gcp-mle-theme", "light");
    } else {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem("gcp-mle-theme", "dark");
    }
  });
}

// Router/Tab Switcher
function setupRouting() {
  const navItems = document.querySelectorAll(".nav-item");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const tabTitle = document.getElementById("current-tab-title");
  const tabDesc = document.getElementById("current-tab-desc");

  const tabMeta = {
    tracker: { title: "Study Tracker", desc: "Track your progress across the seven official exam domains." },
    notes: { title: "Study Guides", desc: "Read structured, high-fidelity summaries of key exam topics." },
    quiz: { title: "Mock Exam Quiz", desc: "Test your readiness with timed certification-style questions." },
    cheatsheet: { title: "Cheat Sheets", desc: "Quick reference tables, decision metrics, and comparisons." },
    playground: { title: "Code Playground", desc: "Explore common GCP ML code templates and architectures." }
  };

  navItems.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      
      // Update sidebar nav buttons
      navItems.forEach(n => n.classList.remove("active"));
      btn.classList.add("active");
      
      // Switch active panels
      tabPanels.forEach(panel => {
        panel.classList.remove("active");
        if (panel.id === `tab-${tabId}`) {
          panel.classList.add("active");
        }
      });

      // Update header titles
      if (tabMeta[tabId]) {
        tabTitle.textContent = tabMeta[tabId].title;
        tabDesc.textContent = tabMeta[tabId].desc;
      }
    });
  });
}

// =========================================================================
// 4. TAB 1: TRACKER / CHECKLIST ENGINE
// =========================================================================
function initTrackerState() {
  if (_progressData.tracker && Object.keys(_progressData.tracker).length > 0) {
    trackerState = _progressData.tracker;
  } else {
    trackerState = {};
  }
  // Ensure all items in DOMAINS_CHECKLIST are initialized in trackerState
  let _dirty = false;
  DOMAINS_CHECKLIST.forEach(domain => {
    domain.items.forEach(item => {
      if (trackerState[item.id] === undefined) {
        trackerState[item.id] = false;
        _dirty = true;
      }
    });
  });
  if (_dirty) saveTrackerState();
}

function saveTrackerState() {
  _progressData.tracker = trackerState;
  saveProgress();
}

function renderChecklist() {
  const container = document.getElementById("domains-checklist");
  container.innerHTML = "";

  DOMAINS_CHECKLIST.forEach(domain => {
    // Calculate initial progress for this domain
    const totalItems = domain.items.length;
    const completedItems = domain.items.filter(item => trackerState[item.id]).length;
    const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    const accordion = document.createElement("div");
    accordion.className = "domain-accordion";
    accordion.id = `accordion-${domain.id}`;

    accordion.innerHTML = `
      <div class="domain-header" onclick="toggleAccordion(${domain.id})">
        <div class="domain-header-left">
          <div class="domain-badge">${domain.code}</div>
          <div class="domain-title-group">
            <h4>${domain.title}</h4>
            <span>${domain.subtitle}</span>
          </div>
        </div>
        <div class="domain-header-right">
          <div class="domain-progress">
            <div class="dp-bar-outer">
              <div class="dp-bar-inner" id="dp-inner-${domain.id}" style="width: ${pct}%;"></div>
            </div>
            <span id="dp-text-${domain.id}">${pct}%</span>
          </div>
          <i class="fa-solid fa-chevron-down arrow-icon"></i>
        </div>
      </div>
      <div class="domain-content">
        <div class="task-list" id="task-list-${domain.id}">
          <!-- Tasks dynamically listed below -->
        </div>
      </div>
    `;

    container.appendChild(accordion);

    const taskList = document.getElementById(`task-list-${domain.id}`);
    domain.items.forEach(item => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task-item";
      
      const isChecked = trackerState[item.id] ? "checked" : "";
      
      taskDiv.innerHTML = `
        <div class="task-checkbox-container">
          <input type="checkbox" id="${item.id}" ${isChecked} onchange="toggleTask('${item.id}', ${domain.id})">
          <div class="checkmark">
            <i class="fa-solid fa-check"></i>
          </div>
        </div>
        <span class="task-text">${item.text}</span>
      `;
      
      taskList.appendChild(taskDiv);
    });
  });
}

window.toggleAccordion = function(domainId) {
  const el = document.getElementById(`accordion-${domainId}`);
  el.classList.toggle("expanded");
};

window.toggleTask = function(taskId, domainId) {
  const checkbox = document.getElementById(taskId);
  trackerState[taskId] = checkbox.checked;
  saveTrackerState();
  
  // Recalculate domain progress
  const domain = DOMAINS_CHECKLIST.find(d => d.id === domainId);
  const totalItems = domain.items.length;
  const completedItems = domain.items.filter(item => trackerState[item.id]).length;
  const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  document.getElementById(`dp-inner-${domainId}`).style.width = `${pct}%`;
  document.getElementById(`dp-text-${domainId}`).textContent = `${pct}%`;
  
  updateProgressUI();
};

function updateProgressUI() {
  const total = Object.keys(trackerState).length;
  const completed = Object.values(trackerState).filter(v => v).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Update Widget
  document.getElementById("widget-pct").textContent = `${pct}%`;
  document.getElementById("widget-bar").style.width = `${pct}%`;
  
  // Update Stats row on Tracker view
  const statCompleted = document.getElementById("stat-completed-tasks");
  const statRate = document.getElementById("stat-completion-rate");
  if (statCompleted) statCompleted.textContent = `${completed} / ${total}`;
  if (statRate) statRate.textContent = `${pct}%`;
}

// =========================================================================
// 5. TAB 2: STUDY NOTES ENGINE
// =========================================================================
function setupNotesMenu() {
  const notesMenuList = document.getElementById("notes-menu-list");
  if (!notesMenuList) return;
  const listItems = notesMenuList.querySelectorAll("li");
  listItems.forEach(item => {
    item.addEventListener("click", () => {
      listItems.forEach(li => li.classList.remove("active"));
      item.classList.add("active");
      const docName = item.getAttribute("data-doc");
      loadNotesDoc(docName);
    });
  });
}

function loadNotesDoc(filename) {
  const bodyEl = document.getElementById("notes-view-body");
  const loaderEl = document.getElementById("notes-loading");
  
  loaderEl.classList.remove("hidden");
  bodyEl.classList.add("hidden");
  
  // Attempt to fetch the file from workspace (works if served via server)
  const fetchUrl = `./docs/${filename}`;
  fetch(fetchUrl)
    .then(response => {
      if (!response.ok) throw new Error("CORS or File Not Found");
      return response.text();
    })
    .then(markdown => {
      // Parse markdown to HTML (simple custom parser for basic elements)
      const html = parseSimpleMarkdown(markdown);
      bodyEl.innerHTML = html;
      loaderEl.classList.add("hidden");
      bodyEl.classList.remove("hidden");
    })
    .catch(() => {
      bodyEl.innerHTML = '<h3>Content unavailable — server may be offline.</h3>';
      loaderEl.classList.add("hidden");
      bodyEl.classList.remove("hidden");
    });
}

// Simple regex-based Markdown parser to render files correctly in the dashboard
function parseSimpleMarkdown(md) {
  let html = md;
  
  // 1. Strip mermaid blocks before general code block extraction
  html = html.replace(/```mermaid[\s\S]*?```/g, '');

  // 1b. Placeholder Code Blocks
  const codeBlocks = [];
  html = html.replace(/```(?:[a-zA-Z0-9_\-]+)?\n([\s\S]*?)```/g, (match, codeContent) => {
    const placeholder = `__CODE_BLOCK_PLACEHOLDER_${codeBlocks.length}__`;
    codeBlocks.push(codeContent);
    return placeholder;
  });

  // 2. Placeholder Inline Code
  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (match, codeContent) => {
    const placeholder = `__INLINE_CODE_PLACEHOLDER_${inlineCodes.length}__`;
    inlineCodes.push(codeContent);
    return placeholder;
  });

  // 3. Headers
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^---$/gm, '<hr>');

  // 4. Bold and Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 5. Lists (ordered and unordered)
  html = html.replace(/^[*\-] (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/^\d+\.\s+(.*?)$/gm, '<__OL_LI__>$1</__OL_LI__>');
  html = html.replace(/((?:<li>[^\n]*<\/li>\n?)+)/g, '<ul>$1</ul>');
  html = html.replace(/((?:<__OL_LI__>[^\n]*<\/__OL_LI__>\n?)+)/g, (m) => '<ol>' + m.replace(/<__OL_LI__>/g, '<li>').replace(/<\/__OL_LI__>/g, '</li>') + '</ol>');

  // 6. Tables & Blockquotes (line-based parsing)
  const lines = html.split('\n');
  let inTable = false;
  let isFirstRow = true;
  let tableHtml = '<table>';
  let inBlockquote = false;
  let blockquoteContent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Blockquote handling
    if (line.startsWith('>')) {
      if (inTable) {
        inTable = false;
        tableHtml += '</table>';
        lines[i] = tableHtml + '\n' + lines[i];
      }
      
      if (!inBlockquote) {
        inBlockquote = true;
        blockquoteContent = '';
      }
      
      let text = line.substring(1).trim();
      if (text.startsWith('[!')) {
        const closeBracketIdx = text.indexOf(']');
        if (closeBracketIdx !== -1) {
          const alertType = text.substring(2, closeBracketIdx);
          const rest = text.substring(closeBracketIdx + 1).trim();
          text = `<strong>${alertType}:</strong> ${rest}`;
        }
      }
      blockquoteContent += (blockquoteContent ? '<br>' : '') + text;
      lines[i] = '';
      continue;
    } else {
      if (inBlockquote) {
        inBlockquote = false;
        lines[i] = `<blockquote>${blockquoteContent}</blockquote>\n` + lines[i];
      }
    }

    // Table handling
    if (line.startsWith('|')) {
      if (!inTable) {
        inTable = true;
        isFirstRow = true;
        tableHtml = '<table>';
      }
      const cols = line.split('|').slice(1, -1).map(c => c.trim());
      // Skip delimiter lines e.g. | :--- | :--- |
      if (cols.every(c => c.startsWith(':') || c.startsWith('-'))) {
        lines[i] = '';
        continue;
      }
      
      const tag = isFirstRow ? 'th' : 'td';
      tableHtml += '<tr>' + cols.map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>';
      isFirstRow = false;
      lines[i] = '';
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</table>';
        lines[i] = tableHtml + '\n' + lines[i];
      }
    }
  }
  
  if (inBlockquote) {
    lines.push(`<blockquote>${blockquoteContent}</blockquote>`);
  }
  if (inTable) {
    tableHtml += '</table>';
    lines.push(tableHtml);
  }
  
  html = lines.join('\n');

  const escHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 7. Restore Inline Code
  inlineCodes.forEach((codeContent, index) => {
    html = html.replace(`__INLINE_CODE_PLACEHOLDER_${index}__`, () => `<code>${escHtml(codeContent)}</code>`);
  });

  // 8. Restore Code Blocks
  codeBlocks.forEach((codeContent, index) => {
    html = html.replace(`__CODE_BLOCK_PLACEHOLDER_${index}__`, () => `<pre><code>${escHtml(codeContent)}</code></pre>`);
  });

  return html;
}

// =========================================================================
// 6. TAB 3: MOCK EXAM QUIZ ENGINE
// =========================================================================
function setupQuizEvents() {
  document.getElementById("start-quiz-btn").addEventListener("click", startQuiz);
  document.getElementById("quiz-next-btn").addEventListener("click", nextQuestion);
  document.getElementById("restart-quiz-btn").addEventListener("click", resetQuizIntro);
  document.getElementById("quiz-review-tracker-btn").addEventListener("click", () => {
    document.querySelector('[data-tab="tracker"]').click();
  });
}

function startQuiz() {
  const mode = document.getElementById("quiz-mode").value;
  let pool = [...window.PRACTICE_QUESTIONS];

  // Filter based on mode selection
  if (mode === "quick") {
    // Select 10 random questions
    pool = shuffleArray(pool).slice(0, 10);
  } else if (mode === "all") {
    // Full pool, shuffled
    pool = shuffleArray(pool);
  } else if (mode.startsWith("d")) {
    const domainNum = mode.substring(1);
    pool = pool.filter(q => q.domain.includes(`Domain ${domainNum}`));
    if (pool.length === 0) {
      alert("No questions found for this domain yet.");
      return;
    }
  }

  quizState.activeQuestions = pool;
  quizState.currentIndex = 0;
  quizState.score = 0;
  quizState.hasAnswered = false;
  quizState.selectedOption = null;

  document.getElementById("quiz-intro-card").classList.add("hidden");
  document.getElementById("quiz-results-card").classList.add("hidden");
  document.getElementById("quiz-running-card").classList.remove("hidden");

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const question = quizState.activeQuestions[quizState.currentIndex];
  quizState.hasAnswered = false;
  quizState.selectedOption = null;

  // Question metadata
  document.getElementById("quiz-question-number").textContent = `Question ${quizState.currentIndex + 1} of ${quizState.activeQuestions.length}`;
  document.getElementById("quiz-question-domain").textContent = question.domain;
  document.getElementById("quiz-question-text").textContent = question.question;

  // Progress Bar
  const pct = Math.round((quizState.currentIndex / quizState.activeQuestions.length) * 100);
  document.getElementById("quiz-progress-fill").style.width = `${pct}%`;

  // Options
  const optionsContainer = document.getElementById("quiz-options-list");
  optionsContainer.innerHTML = "";

  question.options.forEach((optText, index) => {
    const letter = String.fromCharCode(65 + index); // A, B, C, D
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `
      <span class="option-letter">${letter}</span>
      <span class="option-text">${optText}</span>
    `;
    btn.addEventListener("click", () => selectOption(index));
    optionsContainer.appendChild(btn);
  });

  // Reset controls
  document.getElementById("quiz-next-btn").disabled = true;
  document.getElementById("quiz-next-btn").querySelector("span").textContent = 
    quizState.currentIndex === quizState.activeQuestions.length - 1 ? "Finish Quiz" : "Submit Answer";
  
  // Hide feedback box
  const feedbackBox = document.getElementById("quiz-feedback-box");
  feedbackBox.classList.add("hidden");
  feedbackBox.classList.remove("correct-fb", "wrong-fb");
  
  // Update scoreboard
  document.getElementById("quiz-score-indicator").textContent = `Score: ${quizState.score} / ${quizState.currentIndex}`;
}

function selectOption(index) {
  if (quizState.hasAnswered) return;

  const options = document.querySelectorAll(".option-btn");
  options.forEach((btn, idx) => {
    if (idx === index) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });

  quizState.selectedOption = index;
  document.getElementById("quiz-next-btn").disabled = false;
}

function nextQuestion() {
  const nextBtn = document.getElementById("quiz-next-btn");
  
  // If the user hasn't submitted their answer yet, check the choice
  if (!quizState.hasAnswered) {
    evaluateChoice();
    quizState.hasAnswered = true;
    nextBtn.querySelector("span").textContent = 
      quizState.currentIndex === quizState.activeQuestions.length - 1 ? "Show Results" : "Next Question";
  } else {
    // Proceed to next question or show results
    if (quizState.currentIndex < quizState.activeQuestions.length - 1) {
      quizState.currentIndex++;
      renderQuizQuestion();
    } else {
      showQuizResults();
    }
  }
}

function evaluateChoice() {
  const question = quizState.activeQuestions[quizState.currentIndex];
  const selectedIndex = quizState.selectedOption;
  const correctIndex = question.answer;
  const isCorrect = (selectedIndex === correctIndex);

  if (isCorrect) quizState.score++;

  const options = document.querySelectorAll(".option-btn");
  options.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correctIndex) {
      btn.classList.remove("selected");
      btn.classList.add("correct");
    } else if (idx === selectedIndex) {
      btn.classList.remove("selected");
      btn.classList.add("wrong");
    }
  });

  // Render feedback details
  const feedbackBox = document.getElementById("quiz-feedback-box");
  const heading = document.getElementById("feedback-heading");
  const explanation = document.getElementById("feedback-explanation");
  const icon = document.getElementById("feedback-icon");

  if (isCorrect) {
    feedbackBox.classList.add("correct-fb");
    heading.textContent = "Correct!";
    icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
  } else {
    feedbackBox.classList.add("wrong-fb");
    heading.textContent = `Incorrect (Correct Option: ${String.fromCharCode(65 + correctIndex)})`;
    icon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
  }

  explanation.textContent = question.explanation;
  feedbackBox.classList.remove("hidden");
  
  // Update scoreboard
  document.getElementById("quiz-score-indicator").textContent = `Score: ${quizState.score} / ${quizState.currentIndex + 1}`;
}

function showQuizResults() {
  document.getElementById("quiz-running-card").classList.add("hidden");
  document.getElementById("quiz-results-card").classList.remove("hidden");

  const total = quizState.activeQuestions.length;
  const finalScore = quizState.score;
  const pct = Math.round((finalScore / total) * 100);

  document.getElementById("results-score").textContent = `${finalScore} / ${total}`;
  document.getElementById("results-percentage").textContent = `${pct}%`;

  const feedbackTextEl = document.getElementById("results-feedback-text");
  if (pct >= 85) {
    feedbackTextEl.innerHTML = "<strong>Incredible!</strong> You scored in the master range. You have a deep grasp of Vertex AI, MLOps, and architecture designs. Keep reviewing and you're ready for the official exam!";
  } else if (pct >= 70) {
    feedbackTextEl.innerHTML = "<strong>Solid Effort!</strong> You passed. Focus a bit more on domains where you missed questions (refer to Study Guides) to secure a higher margin.";
  } else {
    feedbackTextEl.innerHTML = "<strong>Keep Studying!</strong> You missed the passing mark (typically ~70-75% equivalence). Review the domain checklists, read the cheat sheets, and try the quiz again.";
  }
}

function resetQuizIntro() {
  document.getElementById("quiz-results-card").classList.add("hidden");
  document.getElementById("quiz-intro-card").classList.remove("hidden");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// =========================================================================
// 7. TAB 5: CODE PLAYGROUND ENGINE
// =========================================================================
function setupPlaygroundEvents() {
  const buttons = document.querySelectorAll(".snippet-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const file = btn.getAttribute("data-file");
      loadCodeSnippet(file);
    });
  });

  // Copy Clipboard
  document.getElementById("copy-snippet-btn").addEventListener("click", () => {
    const codeText = document.getElementById("snippet-code-block").textContent;
    navigator.clipboard.writeText(codeText).then(() => {
      const copyBtn = document.getElementById("copy-snippet-btn");
      copyBtn.querySelector("span").textContent = "Copied!";
      copyBtn.querySelector("i").className = "fa-solid fa-check";
      
      setTimeout(() => {
        copyBtn.querySelector("span").textContent = "Copy";
        copyBtn.querySelector("i").className = "fa-regular fa-copy";
      }, 2000);
    });
  });

  // Load first snippet by default
  loadCodeSnippet("bqml_model.sql");
}

function loadCodeSnippet(filename) {
  const codeEl = document.getElementById("snippet-code-block");
  const nameEl = document.getElementById("current-snippet-name");
  
  nameEl.textContent = filename;
  
  // Set language highlights
  const ext = filename.split('.').pop();
  codeEl.className = ext === 'sql' ? 'language-sql' : 'language-python';
  
  // Attempt to fetch from GCS / Local workspace
  fetch(`./src/snippets/${filename}`)
    .then(response => {
      if (!response.ok) throw new Error("CORS or Snippet Not Found");
      return response.text();
    })
    .then(code => {
      codeEl.textContent = code;
    })
    .catch(() => {
      codeEl.textContent = '# Snippet unavailable — server may be offline.';
    });
}

// =========================================================================
// 8. TAILORED STUDY PLAN SCHEDULER ENGINE
// =========================================================================

const STUDY_PLANS = {
  14: [
    { day: 1, title: "Problem Framing & Objectives", desc: "Translate business challenges into ML tasks and select appropriate metrics.", tasks: [ { id: "sp_14_1_1", text: "Read Framing & Architecture notes", action: "notes", target: "01_framing_and_architecture.md" }, { id: "sp_14_1_2", text: "Take Domain 1 mock questions 1-3", action: "quiz", target: "d1" } ] },
    { day: 2, title: "GCP ML Architecture Choice", desc: "Compare Pre-trained APIs, BigQuery ML, AutoML, and Custom Training setups.", tasks: [ { id: "sp_14_2_1", text: "Read Framing & Architecture notes", action: "notes", target: "01_framing_and_architecture.md" }, { id: "sp_14_2_2", text: "Analyze BQML TRANSFORM SQL structure", action: "playground", target: "bqml_model.sql" } ] },
    { day: 3, title: "Data Prep & Dataflow", desc: "Learn to design data preprocessing workflows using Cloud Dataflow at scale.", tasks: [ { id: "sp_14_3_1", text: "Read Data Preparation notes", action: "notes", target: "02_data_preparation.md" }, { id: "sp_14_3_2", text: "Study Dataflow pipeline code snippet", action: "playground", target: "dataflow_pipeline.py" } ] },
    { day: 4, title: "Feature Store & Data Quality", desc: "Understand Vertex AI Feature Store components and addressing data imbalances.", tasks: [ { id: "sp_14_4_1", text: "Read Data Preparation notes", action: "notes", target: "02_data_preparation.md" }, { id: "sp_14_4_2", text: "Take Domain 2 mock questions 4-6", action: "quiz", target: "d2" } ] },
    { day: 5, title: "Vertex Custom Training", desc: "Learn custom training, choosing containers, and distributed strategies.", tasks: [ { id: "sp_14_5_1", text: "Read Model Development notes", action: "notes", target: "03_model_development.md" }, { id: "sp_14_5_2", text: "Study distributed training strategies", action: "notes", target: "03_model_development.md" } ] },
    { day: 6, title: "Vizier & Model Tuning", desc: "Tune hyperparameters via Vizier Bayesian optimization and remedy overfitting.", tasks: [ { id: "sp_14_6_1", text: "Read Model Development notes", action: "notes", target: "03_model_development.md" }, { id: "sp_14_6_2", text: "Take Domain 3 mock questions 7-9", action: "quiz", target: "d3" } ] },
    { day: 7, title: "Mid-Term Review & Checkpoint", desc: "Review templates and run quick practice quizzes.", tasks: [ { id: "sp_14_7_1", text: "Review bqml_model.sql in playground", action: "playground", target: "bqml_model.sql" }, { id: "sp_14_7_2", text: "Take a 10-Question Quick Practice test", action: "quiz", target: "quick" } ] },
    { day: 8, title: "Vertex AI Pipelines & MLOps", desc: "Build orchestration pipelines using KFP or TFX SDKs.", tasks: [ { id: "sp_14_8_1", text: "Read MLOps & Pipelines notes", action: "notes", target: "04_mlops_and_pipelines.md" }, { id: "sp_14_8_2", text: "Analyze Vertex AI KFP pipeline script", action: "playground", target: "vertex_pipeline.py" } ] },
    { day: 9, title: "Model Registry & Endpoints", desc: "Understand model registry lifecycle, traffic splitting, and private endpoints.", tasks: [ { id: "sp_14_9_1", text: "Read MLOps & Pipelines notes", action: "notes", target: "04_mlops_and_pipelines.md" }, { id: "sp_14_9_2", text: "Take Domain 4 mock questions 10-12", action: "quiz", target: "d4" } ] },
    { day: 10, title: "Model Monitoring (Skew/Drift)", desc: "Set up Vertex AI Model Monitoring to detect statistical feature shifts.", tasks: [ { id: "sp_14_10_1", text: "Read Monitoring & Responsible AI notes", action: "notes", target: "05_monitoring_and_responsible_ai.md" }, { id: "sp_14_10_2", text: "Understand PSI and JS divergence metrics", action: "notes", target: "05_monitoring_and_responsible_ai.md" } ] },
    { day: 11, title: "Explainable AI & Ethics", desc: "Understand attribution methods (Shapley, Integrated Gradients) and fairness.", tasks: [ { id: "sp_14_11_1", text: "Read Monitoring & Responsible AI notes", action: "notes", target: "05_monitoring_and_responsible_ai.md" }, { id: "sp_14_11_2", text: "Take Domain 5 mock questions 13-15", action: "quiz", target: "d5" } ] },
    { day: 12, title: "Generative AI & Agents", desc: "Explore foundation models, Model Garden, and Vertex AI Agents & Reasoning Engines.", tasks: [ { id: "sp_14_12_1", text: "Read AI Agents & Engines notes", action: "notes", target: "07_agents_and_reasoning_engines.md" }, { id: "sp_14_12_2", text: "Understand ADK, Agent Engine, and Memory Bank", action: "notes", target: "07_agents_and_reasoning_engines.md" } ] },
    { day: 13, title: "RAG & Custom Model Tuning", desc: "Differentiate Prompt Engineering, RAG, Fine-Tuning, and RLHF paths.", tasks: [ { id: "sp_14_13_1", text: "Read Generative AI notes", action: "notes", target: "06_generative_ai.md" }, { id: "sp_14_13_2", text: "Take Domain 6 mock questions 16-18", action: "quiz", target: "d6" } ] },
    { day: 14, title: "Final Practice & Mock Exams", desc: "Simulate real exam scenarios and address final revision items.", tasks: [ { id: "sp_14_14_1", text: "Take a Full 30-Question Mock Exam", action: "quiz", target: "all" }, { id: "sp_14_14_2", text: "Review all Cheat Sheets comparison tables", action: "cheatsheet", target: "" } ] }
  ],
  28: [
    { day: 1, title: "ML Problem Framing", desc: "Translate business challenges into ML problems.", tasks: [ { id: "sp_28_1_1", text: "Read Framing & Architecture notes", action: "notes", target: "01_framing_and_architecture.md" } ] },
    { day: 2, title: "ML Metrics Choice", desc: "Define evaluation metrics matching business goals.", tasks: [ { id: "sp_28_2_1", text: "Read evaluation metrics details", action: "notes", target: "01_framing_and_architecture.md" } ] },
    { day: 3, title: "GCP Product Selection", desc: "Compare pre-trained APIs, AutoML, BQML, and custom.", tasks: [ { id: "sp_28_3_1", text: "Study product decision trees", action: "notes", target: "01_framing_and_architecture.md" } ] },
    { day: 4, title: "BigQuery ML Essentials", desc: "Learn about BigQuery ML SQL options and training.", tasks: [ { id: "sp_28_4_1", text: "Study BQML SQL code snippet", action: "playground", target: "bqml_model.sql" } ] },
    { day: 5, title: "Domain 1 Quiz Practice", desc: "Practice framing and architecture questions.", tasks: [ { id: "sp_28_5_1", text: "Take Domain 1 mock questions 1-3", action: "quiz", target: "d1" } ] },
    { day: 6, title: "Data Preparation Needs", desc: "Learn data formats and staging options on GCP.", tasks: [ { id: "sp_28_6_1", text: "Read Data Preparation notes", action: "notes", target: "02_data_preparation.md" } ] },
    { day: 7, title: "Week 1 Review", desc: "Summarize framing and data preparation needs.", tasks: [ { id: "sp_28_7_1", text: "Review week 1 notes", action: "notes", target: "01_framing_and_architecture.md" } ] },
    { day: 8, title: "Cloud Dataflow Batch", desc: "Learn to build batch preprocessing pipelines.", tasks: [ { id: "sp_28_8_1", text: "Read Dataflow & Apache Beam notes", action: "notes", target: "02_data_preparation.md" } ] },
    { day: 9, title: "Cloud Dataflow Streaming", desc: "Learn windowing strategies for streaming inputs.", tasks: [ { id: "sp_28_9_1", text: "Study Dataflow code snippet in playground", action: "playground", target: "dataflow_pipeline.py" } ] },
    { day: 10, title: "Training-Serving Skew", desc: "Prevent skew using tf.Transform preprocessing graphs.", tasks: [ { id: "sp_28_10_1", text: "Read tf.Transform notes", action: "notes", target: "02_data_preparation.md" } ] },
    { day: 11, title: "Vertex Feature Store", desc: "Manage and share features across different models.", tasks: [ { id: "sp_28_11_1", text: "Read Feature Store components", action: "notes", target: "02_data_preparation.md" } ] },
    { day: 12, title: "Handling Data Quality", desc: "Address class imbalances, outliers, and missing data.", tasks: [ { id: "sp_28_12_1", text: "Read data quality strategies", action: "notes", target: "02_data_preparation.md" } ] },
    { day: 13, title: "Domain 2 Quiz Practice", desc: "Test data prep and pipeline knowledge.", tasks: [ { id: "sp_28_13_1", text: "Take Domain 2 mock questions 4-6", action: "quiz", target: "d2" } ] },
    { day: 14, title: "Week 2 Review", desc: "Check progress on data preparation and pipelines.", tasks: [ { id: "sp_28_14_1", text: "Review data preparation sheets", action: "cheatsheet", target: "" } ] },
    { day: 15, title: "Custom Model Training", desc: "Learn custom model execution configurations.", tasks: [ { id: "sp_28_15_1", text: "Read Model Development notes", action: "notes", target: "03_model_development.md" } ] },
    { day: 16, title: "Distributed Training", desc: "Distribute training workloads on GPUs/TPUs.", tasks: [ { id: "sp_28_16_1", text: "Study Mirrored vs Parameter Server strategies", action: "notes", target: "03_model_development.md" } ] },
    { day: 17, title: "Vizier Hyperparameters", desc: "Configure Vizier hyperparameter tuning.", tasks: [ { id: "sp_28_17_1", text: "Read Vizier Bayesian tuning options", action: "notes", target: "03_model_development.md" } ] },
    { day: 18, title: "Overfitting Remedies", desc: "Implement regularization, dropout, and early stopping.", tasks: [ { id: "sp_28_18_1", text: "Review overfitting and underfitting remedies", action: "notes", target: "03_model_development.md" } ] },
    { day: 19, title: "Domain 3 Quiz Practice", desc: "Practice custom model training questions.", tasks: [ { id: "sp_28_19_1", text: "Take Domain 3 mock questions 7-9", action: "quiz", target: "d3" } ] },
    { day: 20, title: "Vertex AI Pipelines", desc: "Orchestrate pipelines using Kubeflow SDK.", tasks: [ { id: "sp_28_20_1", text: "Read MLOps & Pipelines notes", action: "notes", target: "04_mlops_and_pipelines.md" }, { id: "sp_28_20_2", text: "Analyze Vertex AI KFP pipeline", action: "playground", target: "vertex_pipeline.py" } ] },
    { day: 21, title: "Week 3 Review", desc: "Review model development and pipelines.", tasks: [ { id: "sp_28_21_1", text: "Take a 10-Question Quick Practice test", action: "quiz", target: "quick" } ] },
    { day: 22, title: "Model Deployments", desc: "Host endpoints, traffic split, and VPC peer.", tasks: [ { id: "sp_28_22_1", text: "Read endpoint deployments notes", action: "notes", target: "04_mlops_and_pipelines.md" } ] },
    { day: 23, title: "Model Monitoring", desc: "Track prediction drift and training-serving skew.", tasks: [ { id: "sp_28_23_1", text: "Read skew and drift monitoring notes", action: "notes", target: "05_monitoring_and_responsible_ai.md" } ] },
    { day: 24, title: "Explainable AI (XAI)", desc: "Examine Shapley, Integrated Gradients, XRAI.", tasks: [ { id: "sp_28_24_1", text: "Read Explainable AI methods", action: "notes", target: "05_monitoring_and_responsible_ai.md" } ] },
    { day: 25, title: "Responsible AI & Ethics", desc: "Audit fairness, demographic parity, and Model Cards.", tasks: [ { id: "sp_28_25_1", text: "Read fairness and privacy notes", action: "notes", target: "05_monitoring_and_responsible_ai.md" } ] },
    { day: 26, title: "AI Agents & Reasoning Engines", desc: "Explore ADK, Agent Studio, and Agent Engine managed runtime.", tasks: [ { id: "sp_28_26_1", text: "Read AI Agents & Engines notes", action: "notes", target: "07_agents_and_reasoning_engines.md" } ] },
    { day: 27, title: "RAG & Foundation Tuning", desc: "Understand RAG, Vector Search, fine-tuning, filters.", tasks: [ { id: "sp_28_27_1", text: "Study RAG vs SFT fine-tuning", action: "notes", target: "06_generative_ai.md" }, { id: "sp_28_27_2", text: "Take Domain 6 mock questions 16-18", action: "quiz", target: "d6" } ] },
    { day: 28, title: "Final Exam Simulation", desc: "Pass the full exam simulator.", tasks: [ { id: "sp_28_28_1", text: "Take the full 30-question Mock Exam", action: "quiz", target: "all" } ] }
  ]
};

let schedulerState = {
  activeDuration: 14,
  14: {},
  28: {},
  selectedDay: 1
};

function initStudyPlan() {
  if (_progressData.scheduler) {
    schedulerState = _progressData.scheduler;
  }
  
  if (!schedulerState[14]) schedulerState[14] = {};
  if (!schedulerState[28]) schedulerState[28] = {};
  
  [14, 28].forEach(duration => {
    STUDY_PLANS[duration].forEach(dayData => {
      dayData.tasks.forEach(task => {
        if (schedulerState[duration][task.id] === undefined) {
          schedulerState[duration][task.id] = false;
        }
      });
    });
  });
  saveSchedulerState();

  // Set duration buttons and render
  setStudyPlanDuration(schedulerState.activeDuration || 14);
}

function saveSchedulerState() {
  _progressData.scheduler = schedulerState;
  saveProgress();
}

window.setStudyPlanDuration = function(duration) {
  schedulerState.activeDuration = duration;
  
  // Ensure selected day is within range
  if (schedulerState.selectedDay > duration) {
    schedulerState.selectedDay = 1;
  }
  
  saveSchedulerState();
  
  // Update toggle buttons active class
  document.getElementById("plan-btn-14").className = duration === 14 ? "btn-timeline-toggle active" : "btn-timeline-toggle";
  document.getElementById("plan-btn-28").className = duration === 28 ? "btn-timeline-toggle active" : "btn-timeline-toggle";
  
  renderSchedulerTimeline();
  renderSelectedDayDetails();
};

function renderSchedulerTimeline() {
  const track = document.getElementById("timeline-days-track");
  track.innerHTML = "";
  
  const duration = schedulerState.activeDuration;
  const daysData = STUDY_PLANS[duration];
  
  daysData.forEach(dayData => {
    const btn = document.createElement("button");
    btn.className = "timeline-day-btn";
    
    const isSelected = dayData.day === schedulerState.selectedDay;
    if (isSelected) btn.classList.add("active");
    
    // Check if all tasks for this day are completed
    const dayTasks = dayData.tasks;
    const allCompleted = dayTasks.every(t => schedulerState[duration][t.id]);
    if (allCompleted) btn.classList.add("completed");
    
    btn.innerHTML = `
      <span class="day-num">${dayData.day}</span>
      <span class="day-lbl">Day</span>
    `;
    
    btn.addEventListener("click", () => {
      schedulerState.selectedDay = dayData.day;
      saveSchedulerState();
      
      // Update active classes
      document.querySelectorAll(".timeline-day-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      renderSelectedDayDetails();
    });
    
    track.appendChild(btn);
  });
}

function renderSelectedDayDetails() {
  const detailBox = document.getElementById("timeline-day-detail-box");
  const duration = schedulerState.activeDuration;
  const dayNum = schedulerState.selectedDay;
  const dayData = STUDY_PLANS[duration].find(d => d.day === dayNum);
  
  if (!dayData) return;
  
  const dayTasks = dayData.tasks;
  const allCompleted = dayTasks.every(t => schedulerState[duration][t.id]);
  const statusLabel = allCompleted ? "Completed" : "In Progress";
  const badgeClass = allCompleted ? "tdd-status-badge completed" : "tdd-status-badge";
  
  let tasksHtml = "";
  dayTasks.forEach(task => {
    const isTaskDone = schedulerState[duration][task.id];
    const taskDoneClass = isTaskDone ? "tdd-task-item completed" : "tdd-task-item";
    const iconClass = isTaskDone ? "fa-solid fa-circle-check" : "fa-regular fa-circle";
    
    tasksHtml += `
      <li class="${taskDoneClass}" data-task-id="${task.id}">
        <i class="${iconClass}"></i>
        <span>${task.text}</span>
        ${task.action ? `<span style="font-size: 0.75rem; color: var(--primary); margin-left: auto;">[Launch <i class="fa-solid fa-arrow-right" style="font-size: 0.65rem; color: var(--primary); margin-left: 2px;"></i>]</span>` : ""}
      </li>
    `;
  });
  
  detailBox.innerHTML = `
    <div class="tdd-header">
      <h4>Day ${dayData.day}: ${dayData.title}</h4>
      <span class="${badgeClass}" id="tdd-badge">${statusLabel}</span>
    </div>
    <p class="tdd-description">${dayData.desc}</p>
    
    <ul class="tdd-tasks-list">
      ${tasksHtml}
    </ul>
    
    <div class="tdd-actions">
      <button class="btn-secondary" id="tdd-mark-all-btn">
        <i class="fa-solid ${allCompleted ? 'fa-xmark' : 'fa-check'}"></i>
        <span>${allCompleted ? 'Mark Day Incomplete' : 'Mark Day Complete'}</span>
      </button>
    </div>
  `;
  
  // Attach event listeners (no inline onclick)
  const taskElements = detailBox.querySelectorAll(".tdd-tasks-list li");
  taskElements.forEach((el, index) => {
    const task = dayTasks[index];
    el.addEventListener("click", (e) => {
      const launchSpan = el.querySelector("span[style]");
      if (launchSpan && launchSpan.contains(e.target)) return;
      toggleSchedulerTask(task.id);
    });
    const launchSpan = el.querySelector("span[style]");
    if (launchSpan) {
      launchSpan.addEventListener("click", (e) => {
        e.stopPropagation();
        executeSchedulerAction(task.action, task.target);
      });
    }
  });
  const markAllBtn = detailBox.querySelector("#tdd-mark-all-btn");
  if (markAllBtn) {
    markAllBtn.addEventListener("click", () => markAllDayTasks(!allCompleted));
  }
}

window.toggleSchedulerTask = function(taskId) {
  const duration = schedulerState.activeDuration;
  schedulerState[duration][taskId] = !schedulerState[duration][taskId];
  saveSchedulerState();
  
  renderSchedulerTimeline();
  renderSelectedDayDetails();
};

window.markAllDayTasks = function(shouldComplete) {
  const duration = schedulerState.activeDuration;
  const dayNum = schedulerState.selectedDay;
  const dayData = STUDY_PLANS[duration].find(d => d.day === dayNum);
  
  dayData.tasks.forEach(task => {
    schedulerState[duration][task.id] = shouldComplete;
  });
  
  saveSchedulerState();
  renderSchedulerTimeline();
  renderSelectedDayDetails();
};

function executeSchedulerAction(action, target) {
  if (action === "notes") {
    // Switch to notes tab
    document.querySelector('[data-tab="notes"]').click();
    
    // Find note link in menu and click it
    const menuItems = document.querySelectorAll("#notes-menu-list li");
    menuItems.forEach(li => {
      if (li.getAttribute("data-doc") === target) {
        li.click();
      }
    });
  } else if (action === "playground") {
    // Switch to playground tab
    document.querySelector('[data-tab="playground"]').click();
    
    // Find code snippet link and click it
    const snippetBtns = document.querySelectorAll("#snippet-btn-container button");
    snippetBtns.forEach(btn => {
      if (btn.getAttribute("data-file") === target) {
        btn.click();
      }
    });
  } else if (action === "quiz") {
    // Switch to quiz tab
    document.querySelector('[data-tab="quiz"]').click();
    
    // Adjust select mode value
    const modeSelect = document.getElementById("quiz-mode");
    if (modeSelect) {
      modeSelect.value = target;
      // Start the quiz automatically
      startQuiz();
    }
  } else if (action === "cheatsheet") {
    // Switch to cheatsheet tab
    document.querySelector('[data-tab="cheatsheet"]').click();
  }
}


