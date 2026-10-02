const { GoogleGenAI } = require('@google/genai');

/**
 * Generate answer using Gemini model given a question and retrieved chunks context
 */
async function generateAnswer(question, contextChunks) {
  const apiKey = process.env.GEMINI_API_KEY;
  const contextText = contextChunks.map(c => `[Doc: ${c.docName}, Chunk ${c.chunkIndex + 1}]:\n"${c.content}"`).join('\n\n');

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a RAG assistant. Answer the user's question accurately based STRICTLY on the retrieved document context below.
If the context does not contain enough information to answer the question, state clearly: "The provided context does not contain sufficient information to answer this question."

Context:
${contextText}

Question: ${question}

Answer:`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

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

  // If top chunk score is low or unrelated, produce a simulated response or warning
  if (topChunk.similarityScore < 0.25) {
    return "Based on the retrieved context, I could not find relevant information to answer your question.";
  }

  // Extract relevant sentence from top chunk
  const sentences = topChunk.content.split(/(?<=[.?!])\s+/);
  const matchingSentences = sentences.filter(s => {
    const sLower = s.toLowerCase();
    const keywords = qLower.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
    return keywords.some(k => sLower.includes(k));
  });

  if (matchingSentences.length > 0) {
    return matchingSentences.slice(0, 2).join(' ');
  }

  return topChunk.content.slice(0, 220) + "...";
}

module.exports = {
  generateAnswer
};
