const mongoose = require('mongoose');

// Schema for individual text chunk of a document
const chunkSchema = new mongoose.Schema({
  chunkId: { type: String, required: true },
  chunkIndex: { type: Number, required: true },
  content: { type: String, required: true },
  pageNumber: { type: Number, default: 1 },
  wordCount: { type: Number, default: 0 },
  embedding: { type: [Number], default: [] }
});

// Schema for uploaded documents
const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  fileType: { type: String, required: true }, // 'PDF' | 'TXT' | 'MD'
  content: { type: String, required: true },
  chunks: [chunkSchema],
  chunkCount: { type: Number, default: 0 },
  fileSize: { type: Number, default: 0 },
  isSample: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
