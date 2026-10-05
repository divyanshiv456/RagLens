const mongoose = require('mongoose');

const testSuiteSchema = new mongoose.Schema({
  testName: { type: String, default: 'Automated RAG Test Suite' },
  questions: [String],
  results: [mongoose.Schema.Types.Mixed],
  totalTests: { type: Number, default: 0 },
  passedCount: { type: Number, default: 0 },
  warningCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestSuite', testSuiteSchema);
