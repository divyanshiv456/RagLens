const { GoogleGenAI } = require('@google/genai');
const { STOP_WORDS } = require('./embeddingService');

/**
 * Generate answer using Gemini model given a question and retrieved chunks context
 */
async function generateAnswer(question, contextChunks) {
  const apiKey = process.env.GEMINI_API_KEY;
  const contextText = (contextChunks || [])
    .map(c => `[Doc: ${c.docName}, Page ${c.pageNumber || 1}, Chunk ${c.chunkIndex + 1}]:\n"${c.content}"`)
    .join('\n\n');

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a RAG assistant. Answer the user's question accurately based STRICTLY on the retrieved document context below.
If the context does not contain enough information to answer the question, state clearly: "The provided context does not contain sufficient information to answer this question."

Context:
${contextText}

Question: ${question}

Answer:`;

      // Try gemini-2.0-flash first, fallback to gemini-1.5-flash
      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt
        });
      } catch (modelErr) {
        response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: prompt
        });
      }

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini LLM error, using intelligent local generator:', err.message);
    }
  }

  // Smart local fallback generator if GEMINI_API_KEY is not configured
  if (!contextChunks || contextChunks.length === 0) {
    return "No document context was retrieved to answer your question.";
  }

  const topChunk = contextChunks[0];
  const qLower = question.toLowerCase();

  // If top chunk score is zero or clearly irrelevant (< 0.15), indicate insufficient information
  if ((topChunk.similarityScore || 0) < 0.15 && topChunk.status === '🔴 Irrelevant') {
    return "The provided context does not contain sufficient information to answer this question.";
  }

  // Extract key search terms from question (excluding conversational stop words)
  const qKeywords = qLower
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  // Check if user is asking for summary or overview
  const isSummaryQuery = qLower.includes('summar') || qLower.includes('overview') || qLower.includes('about') || qLower.includes('explain') || qKeywords.length === 0;

  // Score sentences across all retrieved chunks for best answer extraction
  const scoredSentences = [];
  for (const chunk of contextChunks) {
    const sentences = chunk.content
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 15);

    for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
      const sentence = sentences[sIdx];
      const sLower = sentence.toLowerCase();
      let matchCount = 0;

      for (const kw of qKeywords) {
        if (sLower.includes(kw)) matchCount++;
      }

      // Early sentence in chunk bonus for summaries
      const positionBonus = (isSummaryQuery && sIdx < 3) ? 0.4 : 0;
      const score = (qKeywords.length > 0 ? (matchCount / qKeywords.length) : 0.5) + positionBonus;

      if (matchCount > 0 || (isSummaryQuery && sIdx < 3)) {
        scoredSentences.push({
          sentence,
          score,
          chunkIndex: chunk.chunkIndex
        });
      }
    }
  }

  // Sort by highest keyword relevance
  scoredSentences.sort((a, b) => b.score - a.score);

  if (scoredSentences.length > 0) {
    const topSentences = [];
    for (const item of scoredSentences) {
      if (!topSentences.includes(item.sentence)) {
        topSentences.push(item.sentence);
      }
      if (topSentences.length >= 3) break;
    }
    return topSentences.join(' ');
  }

  // Fallback to the first complete sentences of the top chunk
  const fallbackSentences = topChunk.content
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15)
    .slice(0, 2);

  if (fallbackSentences.length > 0) {
    return fallbackSentences.join(' ');
  }

  return topChunk.content.trim();
}

module.exports = {
  generateAnswer
};
