# 🩺 RAG Doctor — Diagnostic & Debugging Tool for RAG Pipelines

> **"A Doctor for Broken RAG Systems."**

RAG Doctor is a beginner-friendly full-stack web application designed to diagnose and debug Retrieval-Augmented Generation (RAG) systems. 

A RAG AI can sometimes give an incorrect or incomplete answer even when uploaded documents contain the correct information. **RAG Doctor** pinpoints exactly **where the RAG pipeline failed** across 4 key stages: **Retrieval**, **Context Relevance**, **Groundedness**, and **Evidence/Citation**.

---

## 🌟 Key Features

1. **🩺 4 Core Diagnostic Checks**:
   - **Check 1 — Retrieval Check**: Evaluates similarity matching scores and checks whether the correct document chunks were retrieved.
   - **Check 2 — Context Relevance Check**: Verifies if the retrieved context contains information related to the question.
   - **Check 3 — Groundedness Check**: Compares the generated LLM answer against retrieved context to detect hallucinations or numerical contradictions.
   - **Check 4 — Evidence / Citation Check**: Maps the generated answer directly to the exact supporting document, page, and chunk.

2. **📊 RAG Health Score (0–100)**:
   - 🟢 **90–100**: Healthy RAG
   - 🟡 **70–89**: Needs Attention
   - 🟠 **40–69**: Problem Detected
   - 🔴 **0–39**: Critical Failure

3. **🔄 Visual Pipeline Flow**:
   - Interactive flow visualizer: `Question → Query Processing → Retrieval → Context → LLM → Answer`
   - Stage status badges: 🟢 Passed | 🟡 Warning | 🔴 Failed.

4. **💡 Actionable Suggested Fixes**:
   - Recommends specific engineering fixes (e.g. increase Top-K, adjust chunk size/overlap, refine grounding prompts, implement hybrid BM25 + vector search).

5. **📄 Document Chunk Inspector**:
   - Upload PDF and TXT documents.
   - Automatically parses and chunks documents with overlap.
   - Inspect individual text chunks and their unique IDs.

6. **📜 Historical Audit Log**:
   - Saves all diagnostic test runs in MongoDB for tracking improvements over time.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, Axios, React Router v6
- **Backend**: Node.js, Express.js, REST APIs
- **Database**: MongoDB & Mongoose (with automatic zero-setup In-Memory MongoDB fallback)
- **AI / RAG**: Google Gemini API (`@google/genai` with `text-embedding-004` & `gemini-2.5-flash`), with intelligent local fallback matchers.

---

## 📁 Project Structure

```
rag-doctor/
├── client/                 # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PipelineVisualizer.jsx
│   │   │   ├── DiagnosisCard.jsx
│   │   │   ├── CheckResultCard.jsx
│   │   │   ├── HealthScoreBadge.jsx
│   │   │   └── ChunkViewerModal.jsx
│   │   ├── pages/          # Application Pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Documents.jsx
│   │   │   ├── TestRAG.jsx
│   │   │   └── History.jsx
│   │   ├── services/
│   │   │   └── api.js      # Axios REST client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express Backend API
│   ├── controllers/        # Express Route Controllers
│   ├── models/             # Mongoose Schemas (Document, Diagnosis)
│   ├── routes/             # REST Route definitions
│   ├── services/           # Core RAG Logic
│   │   ├── embeddingService.js  # Text chunking & Vector embeddings
│   │   ├── llmService.js        # Gemini LLM answer generation
│   │   ├── ragEvaluator.js      # 4 Diagnostic checks & scoring logic
│   │   └── seedService.js       # Sample document seeder
│   ├── sample_docs/        # Demo text documents
│   │   ├── refund_policy.txt
│   │   ├── employee_policy.txt
│   │   └── leave_policy.txt
│   ├── server.js           # Server entry point
│   └── package.json
│
├── .env.example            # Environment template
├── package.json            # Root package for running client & server concurrently
└── README.md
```

---

## 🚀 Quick Start & Installation

### 1. Install Dependencies

In the root directory, run:

```bash
npm run install:all
```

This will automatically install packages for the root, server, and client.

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

`.env` content:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/rag-doctor
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: Providing `GEMINI_API_KEY` enables live Google Gemini embeddings & responses. If omitted, the application uses local semantic/TF-IDF vector matching out of the box!

### 3. Run Application

To launch both backend server (`http://localhost:5000`) and frontend client (`http://localhost:3000`) concurrently:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## 🧪 Demo Scenarios to Try

1. **Healthy Scenario**:
   - Select preset: `"What is the refund period?"`
   - Result: 🟢 **Healthy RAG (100/100)** — Correct document `refund_policy.txt` retrieved.

2. **Retrieval Failure Scenario**:
   - Check the **"Force Retrieval Failure Demo 🧪"** box or ask a mismatched question.
   - Result: 🔴 **Retrieval Failure (45/100)** — RAG Doctor identifies that `employee_policy.txt` was retrieved instead of `refund_policy.txt`.

3. **Groundedness Verification**:
   - Ask `"Can I get a refund after 60 days?"`
   - Result: RAG Doctor checks if the generated answer respects the 30-day policy limit without hallucinating extra terms.

---

## 🔌 API Endpoints Summary

### Documents
- `POST /api/documents/upload` — Upload PDF/TXT file
- `GET /api/documents` — List all indexed documents
- `GET /api/documents/:id` — Inspect document chunks
- `DELETE /api/documents/:id` — Remove document
- `POST /api/documents/seed` — Seed sample demo documents

### RAG & Diagnosis
- `POST /api/rag/ask` — Ask question & generate diagnosis report
- `GET /api/diagnosis` — List diagnosis history
- `GET /api/diagnosis/stats` — Dashboard analytics & health metrics
- `GET /api/diagnosis/:id` — Fetch full diagnosis report by ID

---

## 📜 License
MIT License. Built for learning and debugging RAG AI pipelines.
# RagLens
# RagLens
