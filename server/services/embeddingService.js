const { GoogleGenAI } = require('@google/genai');

// Simple term frequency vectorizer for local fallback
function getLocalTermVector(text) {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2);
  
  const freq = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }
  return freq;
}

function cosineSimilarityLocal(vecA, vecB) {
  if (Array.isArray(vecA) && Array.isArray(vecB) && vecA.length === vecB.length && vecA.length > 0) {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Dictionary term freq fallback
  if (typeof vecA === 'object' && typeof vecB === 'object') {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (const key in vecA) {
      normA += vecA[key] * vecA[key];
      if (vecB[key]) {
        dot += vecA[key] * vecB[key];
      }
    }
    for (const key in vecB) {
      normB += vecB[key] * vecB[key];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  return 0;
}

/**
 * Split text into manageable chunks (~150-250 words) with overlap
 */
function chunkText(text, maxWords = 180, overlap = 30) {
  if (!text || text.trim().length === 0) return [];

  // Split by paragraphs first if available, otherwise by words
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const chunks = [];

  let currentWords = [];
  let currentChunkIndex = 0;

  for (const para of paragraphs) {
    const paraWords = para.trim().split(/\s+/);
    
    if (currentWords.length + paraWords.length <= maxWords) {
      currentWords.push(...paraWords);
    } else {
      if (currentWords.length > 0) {
        chunks.push({
          chunkIndex: currentChunkIndex++,
          content: currentWords.join(' '),
          wordCount: currentWords.length
        });
        // Keep overlap words for context continuity
        currentWords = currentWords.slice(Math.max(0, currentWords.length - overlap));
      }
      currentWords.push(...paraWords);
    }
  }

  if (currentWords.length > 0) {
    chunks.push({
      chunkIndex: currentChunkIndex++,
      content: currentWords.join(' '),
      wordCount: currentWords.length
    });
  }

  return chunks;
}

/**
 * Generate embedding vector using Gemini API or fallback
 */
async function generateEmbedding(text) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: text
      });
      if (response && response.embedding && response.embedding.values) {
        return response.embedding.values;
      }
    } catch (err) {
      console.warn('Gemini embedding error, fallback to local TF-IDF:', err.message);
    }
  }

  // Fallback to local term frequency vector object
  return getLocalTermVector(text);
}

module.exports = {
  chunkText,
  generateEmbedding,
  cosineSimilarity: cosineSimilarityLocal,
  getLocalTermVector
};
