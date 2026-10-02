const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const { chunkText, generateEmbedding } = require('./embeddingService');

const SAMPLE_DOCS = [
  { filename: 'refund_policy.txt', type: 'TXT' },
  { filename: 'employee_policy.txt', type: 'TXT' },
  { filename: 'leave_policy.txt', type: 'TXT' }
];

async function seedSampleDocuments(force = false) {
  try {
    const existingCount = await Document.countDocuments();
    if (existingCount > 0 && !force) {
      console.log(`ℹ️ Seed check: ${existingCount} documents already present in database.`);
      return { seeded: false, count: existingCount, message: 'Database already populated' };
    }

    if (force) {
      await Document.deleteMany({ isSample: true });
    }

    const sampleDir = path.join(__dirname, '../sample_docs');
    const seededDocs = [];

    for (const sample of SAMPLE_DOCS) {
      const filePath = path.join(sampleDir, sample.filename);
      if (!fs.existsSync(filePath)) {
        console.warn(`Sample file not found at ${filePath}`);
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const rawChunks = chunkText(content, 180, 30);

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
        filename: sample.filename,
        fileType: sample.type,
        content: content,
        chunks: processedChunks,
        chunkCount: processedChunks.length,
        fileSize: Buffer.byteLength(content, 'utf-8'),
        isSample: true
      });

      await doc.save();
      seededDocs.push(doc);
    }

    console.log(`✅ Successfully seeded ${seededDocs.length} sample documents into database.`);
    return { seeded: true, count: seededDocs.length, docs: seededDocs };
  } catch (err) {
    console.error('Error seeding sample documents:', err);
    return { seeded: false, error: err.message };
  }
}

module.exports = {
  seedSampleDocuments
};
