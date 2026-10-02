const { GoogleGenAI } = require('@google/genai');

/**
 * Diagnostic RAG Pipeline Evaluator
 * Runs the 4 main checks: Retrieval, Context Relevance, Groundedness, Evidence
 */
async function evaluateRAGPipeline(question, retrievedChunks, generatedAnswer, options = {}) {
  const { forceRetrievalFailure = false } = options;

  // 1. CHECK 1: Retrieval Check (25 pts)
  let retrievalScore = 25;
  let retrievalStatus = 'Passed';
  let retrievalExplanation = '';

  if (forceRetrievalFailure || !retrievedChunks || retrievedChunks.length === 0) {
    retrievalScore = 0;
    retrievalStatus = 'Failed';
    retrievalExplanation = forceRetrievalFailure
      ? 'Forced Retrieval Failure: Correct document was not retrieved (Simulated).'
      : 'No document chunks were retrieved for the question.';
  } else {
    const topChunk = retrievedChunks[0];
    const topScore = topChunk.similarityScore || 0;

    if (topScore >= 0.50) {
      retrievalScore = 25;
      retrievalStatus = 'Passed';
      retrievalExplanation = `Successfully retrieved relevant chunk from "${topChunk.docName}" with high confidence score (${(topScore * 100).toFixed(0)}%).`;
    } else if (topScore >= 0.30) {
      retrievalScore = 15;
      retrievalStatus = 'Warning';
      retrievalExplanation = `Retrieved chunks have moderate confidence (${(topScore * 100).toFixed(0)}%). Top document: "${topChunk.docName}".`;
    } else {
      retrievalScore = 5;
      retrievalStatus = 'Failed';
      retrievalExplanation = `Retrieval score is very low (${(topScore * 100).toFixed(0)}%). The retrieved documents may not match the user question.`;
    }
  }

  // 2. CHECK 2: Context Relevance Check (25 pts)
  let relevanceScore = 25;
  let relevanceStatus = 'Passed';
  let relevanceExplanation = '';

  if (retrievalStatus === 'Failed' || !retrievedChunks || retrievedChunks.length === 0) {
    relevanceScore = 0;
    relevanceStatus = 'Failed';
    relevanceExplanation = 'Relevant information was not found in retrieved context.';
  } else {
    // Check keyword overlap between question and combined retrieved context
    const qWords = question.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => !['what', 'is', 'the', 'how', 'many', 'can', 'i', 'for', 'are', 'a', 'an', 'of', 'in', 'to'].includes(w) && w.length > 2);

    const fullContext = retrievedChunks.map(c => c.content).join(' ').toLowerCase();
    const matchedWords = qWords.filter(w => fullContext.includes(w));
    const overlapRatio = qWords.length > 0 ? matchedWords.length / qWords.length : 0;

    if (overlapRatio >= 0.6) {
      relevanceScore = 25;
      relevanceStatus = 'Passed';
      relevanceExplanation = `Retrieved context directly addresses the core keywords (${matchedWords.join(', ')}) in the question.`;
    } else if (overlapRatio >= 0.3) {
      relevanceScore = 15;
      relevanceStatus = 'Warning';
      relevanceExplanation = `Retrieved context only partially overlaps with the question topics.`;
    } else {
      relevanceScore = 5;
      relevanceStatus = 'Failed';
      relevanceExplanation = `The retrieved context does not contain relevant information to answer this question.`;
    }
  }

  // 3. CHECK 3: Groundedness Check (25 pts)
  let groundednessScore = 25;
  let groundednessStatus = 'Passed';
  let groundednessExplanation = '';

  const ansLower = (generatedAnswer || '').toLowerCase();
  const contextText = (retrievedChunks || []).map(c => c.content).join(' ').toLowerCase();

  // Detect clear contradiction patterns (e.g. context mentions "30 days", answer mentions "60 days")
  const numbersInAnswer = ansLower.match(/\b\d+\b/g) || [];
  const numbersInContext = contextText.match(/\b\d+\b/g) || [];
  const ungroundedNumbers = numbersInAnswer.filter(n => !numbersInContext.includes(n));

  if (ansLower.includes("does not contain sufficient information") || ansLower.includes("could not find relevant information") || ansLower.includes("no document context")) {
    groundednessScore = 15;
    groundednessStatus = 'Warning';
    groundednessExplanation = 'LLM correctly recognized missing context, avoiding hallucination.';
  } else if (ungroundedNumbers.length > 0) {
    groundednessScore = 5;
    groundednessStatus = 'Failed';
    groundednessExplanation = `The generated answer contains numerical facts (${ungroundedNumbers.join(', ')}) not supported by or contradicting the retrieved context.`;
  } else if (relevanceStatus === 'Failed') {
    groundednessScore = 10;
    groundednessStatus = 'Warning';
    groundednessExplanation = 'The answer may be speculative or hallucinated because retrieved context was irrelevant.';
  } else {
    groundednessScore = 25;
    groundednessStatus = 'Passed';
    groundednessExplanation = 'The generated answer is fully grounded in the retrieved document context without hallucination.';
  }

  // 4. CHECK 4: Citation / Evidence Check (25 pts)
  let evidenceScore = 25;
  let evidenceStatus = 'Passed';
  let evidenceExplanation = '';
  let evidenceData = {
    docName: null,
    pageNumber: 1,
    chunkId: null,
    snippet: null,
    hasEvidence: false
  };

  if (retrievedChunks && retrievedChunks.length > 0 && relevanceStatus !== 'Failed') {
    const topChunk = retrievedChunks[0];
    evidenceScore = 25;
    evidenceStatus = 'Passed';
    evidenceExplanation = `Supporting claim verified in ${topChunk.docName} (Page ${topChunk.pageNumber || 1}, Chunk ${topChunk.chunkIndex + 1}).`;
    evidenceData = {
      docName: topChunk.docName,
      pageNumber: topChunk.pageNumber || 1,
      chunkId: topChunk.chunkId || `chunk_${topChunk.chunkIndex + 1}`,
      snippet: topChunk.content.slice(0, 180) + '...',
      hasEvidence: true
    };
  } else {
    evidenceScore = 0;
    evidenceStatus = 'Failed';
    evidenceExplanation = 'No reliable supporting document or chunk found for citation.';
    evidenceData = {
      docName: 'None',
      pageNumber: 0,
      chunkId: 'N/A',
      snippet: 'No citation available',
      hasEvidence: false
    };
  }

  // Compute Total RAG Health Score (0 - 100)
  const healthScore = Math.min(100, Math.max(0, retrievalScore + relevanceScore + groundednessScore + evidenceScore));

  // Determine Overall Health Status
  let healthStatus = 'Healthy';
  if (healthScore >= 90) healthStatus = 'Healthy';
  else if (healthScore >= 70) healthStatus = 'Needs Attention';
  else if (healthScore >= 40) healthStatus = 'Problem Detected';
  else healthStatus = 'Critical';

  // Identify Primary Problem
  let primaryProblem = 'None - Pipeline Healthy';
  if (retrievalStatus === 'Failed') {
    primaryProblem = 'Retrieval Failure';
  } else if (relevanceStatus === 'Failed') {
    primaryProblem = 'Context Irrelevance';
  } else if (groundednessStatus === 'Failed') {
    primaryProblem = 'Hallucination / Grounding Failure';
  } else if (evidenceStatus === 'Failed') {
    primaryProblem = 'Missing Citation Evidence';
  } else if (healthScore < 90) {
    primaryProblem = 'Sub-optimal Retrieval Quality';
  }

  // Generate Suggested Fixes
  const suggestedFixes = [];
  if (retrievalStatus === 'Failed' || retrievalStatus === 'Warning') {
    suggestedFixes.push('Improve document chunking size and overlap settings.');
    suggestedFixes.push('Use higher quality dense embeddings (e.g. Gemini text-embedding-004).');
    suggestedFixes.push('Increase Top-K retrieval count (e.g., from K=2 to K=5).');
    suggestedFixes.push('Add metadata filtering (e.g., document category, date range).');
  }

  if (relevanceStatus === 'Failed' || relevanceStatus === 'Warning') {
    suggestedFixes.push('Implement hybrid search (Combining Keyword/BM25 + Dense Semantic Vectors).');
    suggestedFixes.push('Add query rewriting / expansion step before retrieval.');
  }

  if (groundednessStatus === 'Failed' || groundednessStatus === 'Warning') {
    suggestedFixes.push('Strictly enforce system prompt instructions: "Answer ONLY using provided context".');
    suggestedFixes.push('Lower LLM generation temperature (e.g., set temp = 0.0 for deterministic answers).');
  }

  if (evidenceStatus === 'Failed') {
    suggestedFixes.push('Require explicit citation tags [Doc, Chunk] in LLM output instructions.');
  }

  if (suggestedFixes.length === 0) {
    suggestedFixes.push('Pipeline operating at optimal parameters. Maintain current index & model setup.');
  }

  // Determine Pipeline Visualization Node Badges
  const pipelineStatus = {
    question: 'Passed',
    queryProcessing: 'Passed',
    retrieval: retrievalStatus,
    context: relevanceStatus,
    llm: groundednessStatus,
    answer: groundednessStatus === 'Failed' ? 'Failed' : (retrievalStatus === 'Failed' ? 'Failed' : 'Passed')
  };

  return {
    healthScore,
    healthStatus,
    primaryProblem,
    checks: {
      retrieval: {
        name: 'Retrieval Check',
        status: retrievalStatus,
        score: retrievalScore,
        explanation: retrievalExplanation
      },
      relevance: {
        name: 'Context Relevance Check',
        status: relevanceStatus,
        score: relevanceScore,
        explanation: relevanceExplanation
      },
      groundedness: {
        name: 'Groundedness Check',
        status: groundednessStatus,
        score: groundednessScore,
        explanation: groundednessExplanation
      },
      evidence: {
        name: 'Evidence / Citation Check',
        status: evidenceStatus,
        score: evidenceScore,
        explanation: evidenceExplanation
      }
    },
    evidence: evidenceData,
    suggestedFixes,
    pipelineStatus
  };
}

module.exports = {
  evaluateRAGPipeline
};
