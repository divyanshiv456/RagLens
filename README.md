# 🩺 RAG Doctor — Diagnostic, Repair, Testing & Monitoring Platform for RAG Systems

> **"A Doctor for Broken RAG Systems."**  
> *RAG Doctor doesn't just tell you that your RAG is wrong — it tells you where it went wrong, why it went wrong, and helps you test and verify a possible fix.*

---

## 🌟 Overview & Key Features

RAG Doctor is an advanced full-stack MERN web application designed to diagnose, debug, test, monitor, and repair Retrieval-Augmented Generation (RAG) AI pipelines.

### 🩺 10 Core Platform Features

1. **🩺 Smart RAG Repair Lab** (`/repair`):
   - Interactive workflow: `Ask Question → Run RAG → RAG Doctor Diagnosis → Problem Detected → Suggested Fix → Apply Fix → Run RAG Again → Compare Results → Improvement Score (+X Points)`.

2. **🔧 Automatic Fix Suggestions** (`RecommendedFix` Component):
   - Categorized by problem type:
     - **Retrieval Failure**: Suggests increasing Top-K, refining chunk size/overlap, upgrading embeddings, adding metadata filters. Includes 1-click **[ Try This Fix ]** button.
     - **Context Relevance Failure**: Suggests chunking improvements, semantic search, and reranking.
     - **Groundedness Failure**: Suggests prompt constraints, lowering temperature, and hallucination reduction.
     - **Missing Evidence**: Suggests mandating citation tags in output.

3. **🔄 Interactive Pipeline Replay** (`/replay`):
   - Visually steps through the 7 stages of a question:
     `USER QUESTION → QUERY PROCESSING → RETRIEVAL → CONTEXT → LLM → FINAL ANSWER → DIAGNOSIS`.
   - Controls: **▶ Replay**, **⏸ Pause**, **↻ Restart** with stage status badges (`🟢 Passed`, `🟡 Warning`, `🔴 Failed`) and detailed stage inspection cards.

4. **🧪 Automated RAG Testing** (`/test-lab`):
   - Batch test lab running multiple questions sequentially.
   - Real-time summary dashboard: Total Tests, Passed, Warnings, Failed, Average Health Score.
   - Itemized query performance matrix.

5. **📊 RAG Performance Monitoring** (`/performance`):
   - Comprehensive performance dashboard: Average Health Score, Retrieval Success Rate %, Groundedness Rate %, Failed Queries Count, Total Tests, Most Common Failure Type.
   - Visual trend line/bar charts for score history and failure category distribution.

6. **🔍 Evidence Highlighting** (`EvidenceHighlight` Component):
   - Displays generated AI Answer alongside exact source document, page number, chunk ID, and highlights the precise matching sentence from the context.
   - Warning banner when no supporting evidence is available.

7. **🛡️ Basic RAG Security Check** (`SecurityCheckBadge` Component):
   - Scans retrieved document chunks for prompt injection / security vectors (e.g., "ignore previous instructions", "reveal system prompt", "admin access").

8. **📄 Export Diagnosis Report** (`ExportReportButton` Component):
   - 1-Click **Download Report (PDF)** button that formats a clean printable PDF diagnosis report.

9. **🧠 Smart Diagnosis Summary** (`SmartSummary` Component):
   - High-level plain-English summary banner explaining the root cause, severity rating (`🔴 High`, `🟡 Medium`, `🟢 Low`), and recommended action in simple terms.

10. **🎯 Before vs After Comparison** (`BeforeAfterComparison` Component):
    - Dedicated visual comparison card displaying initial vs repaired health scores, check matrices, progress bars, and net point improvement (`🎉 +43 points`).

---

## 📁 Updated Project Structure

```text
RagLens/
├── client/                     # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── Navbar.jsx                  # Navigation header (8 pages)
│   │   │   ├── PipelineVisualizer.jsx      # Horizontal RAG flow diagram
│   │   │   ├── DiagnosisCard.jsx           # Main diagnosis report card
│   │   │   ├── CheckResultCard.jsx         # Diagnostic check card
│   │   │   ├── HealthScoreBadge.jsx        # Health score badge (0-100)
│   │   │   ├── SmartSummary.jsx            # Plain-English diagnosis summary
│   │   │   ├── RecommendedFix.jsx          # Automated fix recommendations
│   │   │   ├── EvidenceHighlight.jsx       # Sentence evidence highlighter
│   │   │   ├── SecurityCheckBadge.jsx      # Prompt injection security scanner
│   │   │   ├── BeforeAfterComparison.jsx   # Before vs After repair card
│   │   │   ├── ExportReportButton.jsx      # Download PDF report button
│   │   │   └── ChunkViewerModal.jsx        # Document chunk viewer modal
│   │   ├── pages/              # Application Pages
│   │   │   ├── Dashboard.jsx               # Platform dashboard & metrics
│   │   │   ├── Documents.jsx               # Document repository manager
│   │   │   ├── TestRAG.jsx                 # Interactive RAG tester
│   │   │   ├── History.jsx                 # Historical audit log
│   │   │   ├── TestLabPage.jsx             # Automated RAG test suite
│   │   │   ├── RepairLab.jsx               # Smart RAG Repair Lab
│   │   │   ├── PipelineReplayPage.jsx      # Interactive pipeline replay
│   │   │   └── PerformancePage.jsx         # RAG performance analytics
│   │   ├── services/
│   │   │   └── api.js          # Axios REST client API
│   │   ├── App.jsx             # React Router v6 setup
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express Backend API
│   ├── controllers/            # REST Controllers
│   │   ├── documentController.js
│   │   ├── ragController.js
│   │   └── diagnosisController.js
│   ├── models/                 # Mongoose Data Models
│   │   ├── Document.js
│   │   ├── Diagnosis.js
│   │   ├── RepairRun.js
│   │   └── TestSuite.js
│   ├── routes/                 # Express API Routes
│   │   ├── documentRoutes.js
│   │   ├── ragRoutes.js
│   │   └── diagnosisRoutes.js
│   ├── services/               # Core RAG Logic
│   │   ├── embeddingService.js  # Text chunking & vector matching
│   │   ├── llmService.js        # Gemini LLM answer generation
│   │   ├── ragEvaluator.js      # 4 diagnostic checks & security scanner
│   │   └── seedService.js       # Auto-seeder for demo documents
│   ├── sample_docs/            # Demo documents
│   │   ├── refund_policy.txt
│   │   ├── employee_policy.txt
│   │   └── leave_policy.txt
│   ├── server.js               # Entry point with in-memory MongoDB fallback
│   └── package.json
│
├── .env.example
├── package.json                # Root package for concurrent execution
└── README.md
```

---

## 📝 Modified & New Files Summary

### New Files Created
- `client/src/components/SmartSummary.jsx`
- `client/src/components/RecommendedFix.jsx`
- `client/src/components/EvidenceHighlight.jsx`
- `client/src/components/SecurityCheckBadge.jsx`
- `client/src/components/BeforeAfterComparison.jsx`
- `client/src/components/ExportReportButton.jsx`
- `client/src/pages/RepairLab.jsx`
- `client/src/pages/PipelineReplayPage.jsx`
- `client/src/pages/TestLabPage.jsx`
- `client/src/pages/PerformancePage.jsx`
- `server/models/RepairRun.js`
- `server/models/TestSuite.js`

### Modified Files Enhanced
- `server/models/Diagnosis.js` (Added `securityCheck`, `summary`, `evidence.matchedSentence`)
- `server/services/ragEvaluator.js` (Integrated prompt injection scanner, plain-English summary formulator, sentence matcher)
- `server/controllers/ragController.js` (Added `/repair`, `/test-suite`, `/performance`, `/replay`, `/export-report` handlers)
- `server/routes/ragRoutes.js` (Registered new API endpoints)
- `server/controllers/diagnosisController.js` (Added extended dashboard analytics)
- `client/src/services/api.js` (Added new frontend API methods)
- `client/src/components/DiagnosisCard.jsx` (Integrated all new feature components)
- `client/src/components/Navbar.jsx` (Updated responsive navigation bar with 8 pages)
- `client/src/pages/Dashboard.jsx` (Updated dashboard stats & failure breakdown)
- `client/src/App.jsx` (Registered routes for all 8 application pages)

---

## 🚀 Quick Start & Installation

### 1. Install Dependencies

In the root directory, run:

```bash
npm run install:all
```

This installs packages across root, server, and client.

### 2. Configure Environment Variables

Create `.env` in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/rag-doctor
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: Providing `GEMINI_API_KEY` enables Google Gemini embeddings (`text-embedding-004`) and responses (`gemini-2.5-flash`). If omitted, RAG Doctor automatically falls back to local TF-IDF semantic vector matching!

### 3. Run Application

To launch both backend server (`http://localhost:5000`) and frontend client (`http://localhost:3000` or `3001`) concurrently:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3001` (or `http://localhost:3000`).

---

## 🗄️ MongoDB Setup

RAG Doctor includes zero-setup MongoDB initialization:
- **Local MongoDB**: If a local MongoDB daemon is running at `mongodb://127.0.0.1:27017/rag-doctor`, it connects directly.
- **In-Memory Fallback**: If local MongoDB is not running, RAG Doctor automatically launches an in-memory MongoDB instance via `mongodb-memory-server` out of the box!

---

## 🔌 Complete API Documentation

### Documents
- `POST /api/documents/upload` — Upload PDF/TXT file
- `GET /api/documents` — List all indexed documents
- `GET /api/documents/:id` — Inspect document chunks
- `DELETE /api/documents/:id` — Remove document
- `POST /api/documents/seed` — Seed demo documents

### RAG, Diagnosis & Repair
- `POST /api/rag/ask` — Ask question & generate diagnosis report
- `POST /api/rag/repair` — Run Smart RAG Repair Lab comparison
- `POST /api/rag/test-suite` — Execute automated batch test suite
- `GET /api/rag/performance` — Fetch performance analytics & failure breakdown
- `POST /api/rag/replay` — Fetch interactive pipeline replay steps
- `POST /api/rag/export-report` — Generate exportable diagnosis report

### Diagnosis Audit & Stats
- `GET /api/diagnosis` — List diagnosis history
- `GET /api/diagnosis/:id` — Fetch diagnosis report by ID
- `DELETE /api/diagnosis/:id` — Delete diagnosis record
- `GET /api/diagnosis/stats` — Dashboard statistics & common problems

---

## 🧪 Sample Test Documents & Questions

### Sample Documents Pre-loaded:
1. `refund_policy.txt`: Company refund policy (30-day window, full refund terms).
2. `employee_policy.txt`: General employee workplace conduct and notice period rules.
3. `leave_policy.txt`: Leave entitlements (casual leave, sick leave limits).

### Sample Test Questions to Try:
1. `"What is the refund period?"` (🟢 Expected: Healthy RAG, 100/100)
2. `"What is the cancellation policy?"` (🔴 Expected: Retrieval / Context Warning)
3. `"How many leaves are allowed?"` (🟢 Expected: Healthy RAG)
4. `"What is the employee notice period?"` (🟢 Expected: Healthy RAG)
5. `"Can I get a refund after 60 days?"` (🟡 Expected: Groundedness verification)

---

## 📜 License
MIT License. Built for RAG AI debugging, testing, and monitoring.
