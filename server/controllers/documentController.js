const fs = require('fs');
const pdfParse = require('pdf-parse');
const Document = require('../models/Document');
const { chunkText, generateEmbedding } = require('../services/embeddingService');
const { seedSampleDocuments } = require('../services/seedService');

// POST /api/documents/upload
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF or TXT document.' });
    }

    const { originalname, mimetype, path: filePath, size } = req.file;
    let textContent = '';
    let fileType = 'TXT';

    if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
      fileType = 'PDF';
      const fileBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(fileBuffer);
      textContent = pdfData.text;
    } else {
      fileType = 'TXT';
      textContent = fs.readFileSync(filePath, 'utf-8');
    }

    // Clean up uploaded file from temporary storage
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({ error: 'The uploaded file is empty or could not be read.' });
    }

    // Chunk text
    const rawChunks = chunkText(textContent, 180, 30);
    const processedChunks = [];

    for (let i = 0; i < rawChunks.length; i++) {
      const chunk = rawChunks[i];
      const embedding = await generateEmbedding(chunk.content);
      processedChunks.push({
        chunkId: `chunk_${i + 1}`,
        chunkIndex: i,
        content: chunk.content,
        pageNumber: 1,
        wordCount: chunk.wordCount,
        embedding: Array.isArray(embedding) ? embedding : []
      });
    }

    const doc = new Document({
      filename: originalname,
      fileType,
      content: textContent,
      chunks: processedChunks,
      chunkCount: processedChunks.length,
      fileSize: size
    });

    await doc.save();

    res.status(201).json({
      message: 'Document uploaded and chunked successfully!',
      document: {
        _id: doc._id,
        filename: doc.filename,
        fileType: doc.fileType,
        chunkCount: doc.chunkCount,
        uploadedAt: doc.uploadedAt
      }
    });
  } catch (err) {
    console.error('Error uploading document:', err);
    res.status(500).json({ error: 'Failed to process document: ' + err.message });
  }
};

// GET /api/documents
exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({}, '-content -chunks.embedding')
      .sort({ uploadedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/documents/:id
exports.getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id, '-chunks.embedding');
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/documents/:id
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json({ message: 'Document deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/documents/seed
exports.seedDocuments = async (req, res) => {
  try {
    const result = await seedSampleDocuments(true);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
