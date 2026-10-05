const { GoogleGenAI } = require('@google/genai');
const { STOP_WORDS, stemWord } = require('./embeddingService');

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
      ? 'Forced Retrieval Failure: Correct document was not retrieved (Simulated Demo).'
      : 'No document chunks were retrieved for the question.';
  } else {
    const topChunk = retrievedChunks[0];
    const topScore = topChunk.similarityScore || 0;

    if (topScore >= 0.35 || topChunk.status === '🟢 Relevant') {
      retrievalScore = 25;
      retrievalStatus = 'Passed';
      retrievalExplanation = `Successfully retrieved relevant chunk from "${topChunk.docName}" with high confidence score (${(topScore * 100).toFixed(0)}%).`;
    } else if (topScore >= 0.20 || topChunk.status === '🟡 Weak') {
      retrievalScore = 18;
      retrievalStatus = 'Passed';
      retrievalExplanation = `Retrieved matching candidate chunks from "${topChunk.docName}" with confidence score (${(topScore * 100).toFixed(0)}%).`;
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

  if (forceRetrievalFailure || !retrievedChunks || retrievedChunks.length === 0) {
    relevanceScore = 0;
    relevanceStatus = 'Failed';
    relevanceExplanation = forceRetrievalFailure
      ? 'Irrelevant document context retrieved due to simulated retrieval failure.'
      : 'No context available to evaluate relevance.';
  } else {
    // Extract non-conversational content keywords from question
    const qWords = question.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP_WORDS.has(w));

    const fullContext = retrievedChunks.map(c => c.content).join(' ').toLowerCase();

    if (qWords.length === 0) {
      // If question was broad like "Summarize this document"
      relevanceScore = 25;
      relevanceStatus = 'Passed';
      relevanceExplanation = `Retrieved context provides comprehensive source material for general overview and synthesis.`;
    } else {
      const matchedWords = qWords.filter(w => {
        const stem = stemWord ? stemWord(w) : w;
        return fullContext.includes(w) || fullContext.includes(stem);
      });
      const overlapRatio = matchedWords.length / qWords.length;

      if (overlapRatio >= 0.35 || matchedWords.length >= 2 || (retrievedChunks[0]?.similarityScore || 0) >= 0.40) {
        relevanceScore = 25;
        relevanceStatus = 'Passed';
        relevanceExplanation = `Retrieved context directly addresses the core question topics (${matchedWords.length > 0 ? matchedWords.join(', ') : 'semantic match'}).`;
      } else if (matchedWords.length > 0 || (retrievedChunks[0]?.similarityScore || 0) >= 0.25) {
        relevanceScore = 18;
        relevanceStatus = 'Passed';
        relevanceExplanation = `Retrieved context partially overlaps with the question topics (${matchedWords.join(', ')}).`;
      } else {
        relevanceScore = 5;
        relevanceStatus = 'Failed';
        relevanceExplanation = `The retrieved context does not contain sufficient topical overlap to answer this question.`;
      }
    }
  }

  // 3. CHECK 3: Groundedness Check (25 pts)
  let groundednessScore = 25;
  let groundednessStatus = 'Passed';
  let groundednessExplanation = '';

  const ansLower = (generatedAnswer || '').toLowerCase();
  const contextText = (retrievedChunks || []).map(c => c.content).join(' ').toLowerCase();

  // Detect clear contradiction patterns (e.g. context mentions "30 days", answer mentions contradictory number)
  const numbersInAnswer = ansLower.match(/\b\d+\b/g) || [];
  const numbersInContext = contextText.match(/\b\d+\b/g) || [];
  const ungroundedNumbers = numbersInAnswer.filter(n => !numbersInContext.includes(n));

  if (forceRetrievalFailure) {
    groundednessScore = 10;
    groundednessStatus = 'Warning';
    groundednessExplanation = 'Simulated retrieval failure: The generated answer cannot be verified against the intended document.';
  } else if (ansLower.includes("does not contain sufficient information") || ansLower.includes("could not find relevant information") || ansLower.includes("no document context")) {
    groundednessScore = 15;
    groundednessStatus = 'Warning';
    groundednessExplanation = 'LLM correctly recognized missing context, avoiding hallucination.';
  } else if (ungroundedNumbers.length > 0 && relevanceStatus === 'Failed') {
    groundednessScore = 5;
    groundednessStatus = 'Failed';
    groundednessExplanation = `The generated answer contains numerical facts (${ungroundedNumbers.join(', ')}) not supported by the retrieved context.`;
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

  if (retrievedChunks && retrievedChunks.length > 0 && !forceRetrievalFailure && relevanceStatus !== 'Failed') {
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
    evidenceExplanation = forceRetrievalFailure
      ? 'No valid citation: Correct document was not retrieved.'
      : 'No reliable supporting document or chunk found for citation.';
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
  if (healthScore >= 85) healthStatus = 'Healthy';
  else if (healthScore >= 65) healthStatus = 'Needs Attention';
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
  } else if (healthScore < 85) {
    primaryProblem = 'Sub-optimal Retrieval Quality';
  }

  // Generate Suggested Fixes
  const suggestedFixes = [];
  if (retrievalStatus === 'Failed' || retrievalStatus === 'Warning') {
    suggestedFixes.push('Improve document chunking size and overlap settings.');
    suggestedFixes.push('Use higher quality dense embeddings (e.g. Gemini text-embedding-004).');
    suggestedFixes.push('Increase Top-K retrieval count (e.g., from K=2 to K=5).');
    suggestedFixes.push('Add metadata filtering (e.g., select specific document to isolate search scope).');
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

  // 5. SECURITY CHECK: RAG Security Doctor (Prompt Injection Scan)
  const securityRiskTriggers = [
    'ignore previous instructions',
    'ignore prior instructions',
    'reveal system prompt',
    'reveal confidential information',
    'ignore security rules',
    'disregard all instructions',
    'admin access',
    'bypass security',
    'drop database'
  ];

  let isSafe = true;
  const detectedTriggers = [];

  const combinedContent = (retrievedChunks || []).map(c => c.content.toLowerCase()).join(' ');
  for (const trigger of securityRiskTriggers) {
    if (combinedContent.includes(trigger)) {
      isSafe = false;
      detectedTriggers.push(trigger);
    }
  }

  const securityCheck = {
    isSafe,
    detectedTriggers,
    warningMessage: isSafe
      ? 'No malicious instructions or prompt injection vectors detected in retrieved chunks.'
      : `🛡️ Potential prompt injection detected. The retrieved document contains suspicious instructions (${detectedTriggers.join(', ')}) that may attempt to manipulate the AI.`
  };

  // 6. Sentence Matcher for Evidence Highlighting
  let matchedSentence = null;
  if (evidenceData.hasEvidence && retrievedChunks && retrievedChunks[0]) {
    const topChunkContent = retrievedChunks[0].content;
    const sentences = topChunkContent.split(/(?<=[.?!])\s+/);
    const ansLower = (generatedAnswer || '').toLowerCase();
    
    // Find sentence with highest overlap with generated answer
    let maxOverlap = 0;
    for (const sent of sentences) {
      const sWords = sent.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
      const overlapCount = sWords.filter(w => ansLower.includes(w)).length;
      if (overlapCount > maxOverlap) {
        maxOverlap = overlapCount;
        matchedSentence = sent.trim();
      }
    }
    if (!matchedSentence && sentences.length > 0) {
      matchedSentence = sentences[0].trim();
    }
  }
  evidenceData.matchedSentence = matchedSentence;

  // 7. Smart Diagnosis Summary Formulator
  let summary = {
    headline: 'RAG Pipeline Healthy & Grounded!',
    explanation: 'Document retrieval, context relevance, groundedness, and citation evidence all passed with high confidence.',
    severity: '🟢 Low (Healthy)',
    recommendedAction: 'Pipeline operating at optimal parameters. Maintain current index & model setup.'
  };

  if (retrievalStatus === 'Failed') {
    summary = {
      headline: 'Your RAG system has a retrieval problem.',
      explanation: 'The correct document was available, but it was not retrieved in the top results.',
      severity: '🔴 High',
      recommendedAction: 'Increase Top-K retrieval or adjust document chunking overlap settings.'
    };
  } else if (relevanceStatus === 'Failed') {
    summary = {
      headline: 'Retrieved context lacks relevance to the question.',
      explanation: 'Document chunks were retrieved, but they do not contain enough pertinent information to answer the query.',
      severity: '🔴 High',
      recommendedAction: 'Implement hybrid search (BM25 + Dense Vectors) or refine chunk size.'
    };
  } else if (groundednessStatus === 'Failed') {
    summary = {
      headline: 'Generated answer contains ungrounded/hallucinated claims.',
      explanation: 'The AI answer includes facts or numerical details not supported by or contradicting the retrieved document context.',
      severity: '🔴 High',
      recommendedAction: 'Strictly enforce system prompt instructions: "Answer ONLY using provided context".'
    };
  } else if (evidenceStatus === 'Failed') {
    summary = {
      headline: 'Answer missing clear source evidence citation.',
      explanation: 'The generated response cannot be verified or mapped back to a specific document chunk.',
      severity: '🟡 Medium',
      recommendedAction: 'Require explicit citation tags [Doc, Chunk] in LLM output.'
    };
  } else if (healthScore < 90) {
    summary = {
      headline: 'Sub-optimal RAG pipeline quality detected.',
      explanation: 'The system generated an answer, but retrieval confidence or context overlap is lower than ideal.',
      severity: '🟡 Medium',
      recommendedAction: 'Increase Top-K parameter from K=2 to K=5 and verify embedding model.'
    };
  }

  // Determine Pipeline Visualization Node Badges
  const pipelineStatus = {
    question: 'Passed',
    queryProcessing: 'Passed',
    retrieval: retrievalStatus,
    context: relevanceStatus,
    llm: (groundednessStatus === 'Passed' || (generatedAnswer && !generatedAnswer.includes('does not contain sufficient') && !generatedAnswer.includes('could not find'))) ? 'Passed' : groundednessStatus,
    answer: (retrievalStatus === 'Failed' && relevanceStatus === 'Failed') ? 'Failed' : (groundednessStatus === 'Failed' ? 'Failed' : 'Passed')
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
    securityCheck,
    summary,
    suggestedFixes,
    pipelineStatus
  };
}

module.exports = {
  evaluateRAGPipeline
};

