const Document = require('../models/Document');
const Diagnosis = require('../models/Diagnosis');
const { generateEmbedding, cosineSimilarity, getLocalTermVector } = require('../services/embeddingService');
const { generateAnswer } = require('../services/llmService');
const { evaluateRAGPipeline } = require('../services/ragEvaluator');

// POST /api/rag/ask
exports.askQuestion = async (req, res) => {
  try {
    const { question, topK = 3, forceRetrievalFailure = false } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter a question.' });
    }

    // Check if any documents exist
    const documents = await Document.find({});
    if (!documents || documents.length === 0) {
      return res.status(400).json({
        error: 'Please upload a document first before asking questions.',
        noDocuments: true
      });
    }

    let retrievedChunks = [];

    if (forceRetrievalFailure) {
      // Simulate retrieving wrong/irrelevant documents (e.g., retrieving Employee Policy when asked about Refund)
      const irrelevantDoc = documents.find(d => d.filename.includes('employee') || d.filename.includes('leave')) || documents[0];
      if (irrelevantDoc && irrelevantDoc.chunks && irrelevantDoc.chunks.length > 0) {
        retrievedChunks = irrelevantDoc.chunks.slice(0, topK).map(c => ({
          docId: irrelevantDoc._id,
          docName: irrelevantDoc.filename,
          chunkId: c.chunkId,
          chunkIndex: c.chunkIndex,
          content: c.content,
          pageNumber: c.pageNumber || 1,
          similarityScore: 0.28,
          status: '🔴 Irrelevant'
        }));
      }
    } else {
      // Real Retrieval
      const qEmbedding = await generateEmbedding(question);
      const qTermVector = getLocalTermVector(question);

      const allScoredChunks = [];

      for (const doc of documents) {
        for (const chunk of doc.chunks) {
          let score = 0;

          if (Array.isArray(qEmbedding) && qEmbedding.length > 0 && Array.isArray(chunk.embedding) && chunk.embedding.length > 0) {
            score = cosineSimilarity(qEmbedding, chunk.embedding);
          } else {
            const chunkVector = getLocalTermVector(chunk.content);
            score = cosineSimilarity(qTermVector, chunkVector);
          }

          let status = '🔴 Irrelevant';
          if (score >= 0.50) status = '🟢 Relevant';
          else if (score >= 0.30) status = '🟡 Weak';

          allScoredChunks.push({
            docId: doc._id,
            docName: doc.filename,
            chunkId: chunk.chunkId,
            chunkIndex: chunk.chunkIndex,
            content: chunk.content,
            pageNumber: chunk.pageNumber || 1,
            similarityScore: parseFloat(score.toFixed(4)),
            status
          });
        }
      }

      // Sort by similarity score descending
      allScoredChunks.sort((a, b) => b.similarityScore - a.similarityScore);
      retrievedChunks = allScoredChunks.slice(0, Math.min(topK, allScoredChunks.length));
    }

    // Generate Answer using LLM
    const generatedAnswer = await generateAnswer(question, retrievedChunks);

    // Run RAG Doctor Diagnostic Checks
    const evaluation = await evaluateRAGPipeline(question, retrievedChunks, generatedAnswer, {
      forceRetrievalFailure,
      topK
    });

    // Save Diagnosis Report to MongoDB
    const diagnosisRecord = new Diagnosis({
      question: question.trim(),
      generatedAnswer,
      healthScore: evaluation.healthScore,
      healthStatus: evaluation.healthStatus,
      primaryProblem: evaluation.primaryProblem,
      retrievedChunks,
      checks: evaluation.checks,
      pipelineStatus: evaluation.pipelineStatus,
      evidence: evaluation.evidence,
      suggestedFixes: evaluation.suggestedFixes,
      simulationFlags: {
        forceRetrievalFailure: !!forceRetrievalFailure,
        topK: Number(topK)
      }
    });

    await diagnosisRecord.save();

    res.status(200).json({
      success: true,
      diagnosis: diagnosisRecord
    });
  } catch (err) {
    console.error('Error executing RAG diagnosis:', err);
    res.status(500).json({ error: 'Unable to generate diagnosis: ' + err.message });
  }
};
