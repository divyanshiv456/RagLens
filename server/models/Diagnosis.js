const mongoose = require('mongoose');

// Schema for retrieved document chunks in a diagnosis run
const retrievedChunkSchema = new mongoose.Schema({
  docId: String,
  docName: String,
  chunkId: String,
  chunkIndex: Number,
  content: String,
  pageNumber: Number,
  similarityScore: Number, // 0.0 - 1.0
  status: String           // '🟢 Relevant' | '🟡 Weak' | '🔴 Irrelevant'
});

// Schema for individual diagnostic check result
const checkSchema = new mongoose.Schema({
  name: String,            // 'Retrieval' | 'Context Relevance' | 'Groundedness' | 'Evidence'
  status: String,          // 'Passed' | 'Warning' | 'Failed'
  score: Number,           // 0 to 25
  explanation: String,     // Human-readable rationale
  details: mongoose.Schema.Types.Mixed
});

// Main Diagnosis record schema
const diagnosisSchema = new mongoose.Schema({
  question: { type: String, required: true },
  generatedAnswer: { type: String, required: true },
  healthScore: { type: Number, required: true }, // Total score 0 - 100
  healthStatus: { type: String, required: true }, // 'Healthy' | 'Needs Attention' | 'Problem Detected' | 'Critical'
  primaryProblem: { type: String, required: true },
  retrievedChunks: [retrievedChunkSchema],
  checks: {
    retrieval: checkSchema,
    relevance: checkSchema,
    groundedness: checkSchema,
    evidence: checkSchema
  },
  pipelineStatus: {
    question: { type: String, default: 'Passed' },
    queryProcessing: { type: String, default: 'Passed' },
    retrieval: { type: String, default: 'Passed' },
    context: { type: String, default: 'Passed' },
    llm: { type: String, default: 'Passed' },
    answer: { type: String, default: 'Passed' }
  },
  evidence: {
    docName: String,
    pageNumber: Number,
    chunkId: String,
    snippet: String,
    matchedSentence: String,
    hasEvidence: Boolean
  },
  securityCheck: {
    isSafe: { type: Boolean, default: true },
    detectedTriggers: [String],
    warningMessage: String
  },
  summary: {
    headline: String,
    explanation: String,
    severity: String,
    recommendedAction: String
  },
  suggestedFixes: [String],
  simulationFlags: {
    forceRetrievalFailure: Boolean,
    topK: Number
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Diagnosis', diagnosisSchema);
