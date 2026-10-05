const mongoose = require('mongoose');

const repairRunSchema = new mongoose.Schema({
  question: { type: String, required: true },
  originalScore: { type: Number, required: true },
  newScore: { type: Number, required: true },
  improvement: { type: Number, required: true },
  isImproved: { type: Boolean, required: true },
  appliedFix: { type: String, required: true },
  originalSettings: {
    topK: Number,
    forceRetrievalFailure: Boolean
  },
  newSettings: {
    topK: Number,
    forceRetrievalFailure: Boolean
  },
  beforeDiagnosis: mongoose.Schema.Types.Mixed,
  afterDiagnosis: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RepairRun', repairRunSchema);
