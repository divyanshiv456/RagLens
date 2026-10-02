const { GoogleGenAI } = require('@google/genai');

// Comprehensive English stop words set including conversational question framing
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'arent', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but',
  'by', 'can', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn', 'isnt', 'it', 'its', 'itself',
  'let', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only',
  'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should',
  'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very',
  'was', 'wasnt', 'we', 'were', 'werent', 'what', 'when', 'where', 'which', 'while', 'who', 'whom',
  'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
  // Conversational and question-framing words that should not dilute semantic content
  'tell', 'summarize', 'summary', 'explain', 'explanation', 'give', 'detail', 'details',
  'describe', 'description', 'overview', 'list', 'mention', 'mentioned', 'document', 'doc',
  'paper', 'file', 'pdf', 'text', 'content', 'info', 'information', 'please', 'say', 'says',
  'state', 'states', 'according', 'provide', 'provides', 'provided', 'find', 'know', 'want',
  'can', 'could', 'would', 'should', 'might', 'must', 'mean', 'meaning', 'defined', 'define'
]);

// Rule-based root stemmer for common suffixes (plurals, verb tenses)
function stemWord(word) {
  if (!word || word.length <= 3) return word || '';
  let w = word.toLowerCase();
  if (w.endsWith('leaves')) return w.slice(0, -6) + 'leave';
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if (w.endsWith('ves') && w.length > 4) return w.slice(0, -3) + 'f';
  if (w.endsWith('sses')) return w.slice(0, -2);
  if (w.endsWith('ses') || w.endsWith('zes') || w.endsWith('ches') || w.endsWith('shes')) return w.slice(0, -2);
  if (w.endsWith('ing') && w.length > 5) return w.slice(0, -3);
  if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) return w.slice(0, -1);
  return w;
}

/**
 * Extracts term frequencies with stop-word removal and basic stemming
 */
function getLocalTermVector(text) {
  if (!text) return {};
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));

  const freq = {};
  for (const raw of words) {
    const stem = stemWord(raw);
    freq[stem] = (freq[stem] || 0) + 1;
  }
  return freq;
}

/**
 * Calculates similarity score:
 * - Dense cosine similarity for AI embeddings (e.g. Gemini 768-dim vectors)
 * - Hybrid BM25 keyword-coverage + phrase proximity scoring for local fallback
 */
function cosineSimilarityLocal(vecA, vecB, rawTextA = '', rawTextB = '') {
  // 1. Dense Float Array Similarity (Gemini Embeddings)
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
    return Math.max(0, dot / (Math.sqrt(normA) * Math.sqrt(normB)));
  }

  // 2. Hybrid Keyword Coverage, BM25 TF & Phrase Proximity (Term Vectors)
  if (typeof vecA === 'object' && vecA !== null && typeof vecB === 'object' && vecB !== null) {
    const qKeys = Object.keys(vecA);
    if (qKeys.length === 0) {
      // If question had only general words (e.g. 'summarize document'), grant baseline relevance if doc has substance
      return Object.keys(vecB).length > 5 ? 0.55 : 0.20;
    }

    const bKeys = Object.keys(vecB);
    let matchedCount = 0;
    let tfSum = 0;

    for (const qk of qKeys) {
      // Check direct stem match
      if ((vecB[qk] || 0) > 0) {
        matchedCount++;
        tfSum += Math.min(vecB[qk], 4) / 4;
      } else {
        // Partial substring / prefix match (e.g. 'refund' matching 'refundable')
        const partialMatch = bKeys.find(bk => (bk.length > 3 && (bk.startsWith(qk) || qk.startsWith(bk))));
        if (partialMatch) {
          matchedCount++;
          tfSum += Math.min(vecB[partialMatch] || 1, 4) / 4;
        }
      }
    }

    if (matchedCount === 0) return 0;

    // Check phrase bonus if consecutive query terms appear together in chunk text
    let phraseBonus = 0;
    if (rawTextA && rawTextB && qKeys.length >= 2) {
      const lowerB = rawTextB.toLowerCase();
      const qWords = rawTextA.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
      for (let i = 0; i < qWords.length - 1; i++) {
        const pair = qWords[i] + ' ' + qWords[i + 1];
        if (lowerB.includes(pair)) {
          phraseBonus = 0.15;
          break;
        }
      }
    }

    // Keyword coverage ratio
    const coverage = matchedCount / qKeys.length;
    const avgTf = tfSum / matchedCount;

    // High quality score calibration:
    // If all keywords match: 0.60 (coverage) + 0.15 (tf) + phraseBonus + 0.15 base = ~0.90 (Passed)
    // If 1 of 2 keywords match: 0.30 + 0.10 + 0.15 = 0.55 (Passed)
    // If 1 of 3 keywords match with high frequency: 0.20 + 0.15 + 0.15 = 0.50 (Passed)
    const score = (coverage * 0.60) + (avgTf * 0.15) + phraseBonus + 0.15;
    return Math.min(0.98, Math.max(0.0, parseFloat(score.toFixed(4))));
  }

  return 0;
}

/**
 * Split text into manageable chunks (~150-200 words) with overlap.
 * Enforces strict chunk sizes for PDFs to prevent oversized paragraph blocks.
 */
function chunkText(text, maxWords = 180, overlap = 30) {
  if (!text || text.trim().length === 0) return [];

  // Normalize PDF whitespace and line breaks
  const cleanText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/(\w+)-\n(\w+)/g, '$1$2') // Fix hyphenated line wraps
    .replace(/[ \t]+/g, ' ')
    .trim();

  // Try splitting by double newline paragraphs first
  let paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 0);

  // If no double newlines detected (common in raw PDF text), split on single newlines
  if (paragraphs.length <= 1) {
    const lines = cleanText.split(/\n+/).filter(p => p.trim().length > 0);
    if (lines.length > 2) {
      paragraphs = lines;
    }
  }

  const chunks = [];
  let currentWords = [];
  let currentChunkIndex = 0;

  for (const para of paragraphs) {
    const paraWords = para.trim().split(/\s+/).filter(w => w.length > 0);
    if (paraWords.length === 0) continue;

    // If a paragraph is larger than maxWords, use sliding window across it
    if (paraWords.length > maxWords) {
      if (currentWords.length > 0) {
        chunks.push({
          chunkIndex: currentChunkIndex++,
          content: currentWords.join(' '),
          wordCount: currentWords.length
        });
        currentWords = currentWords.slice(Math.max(0, currentWords.length - overlap));
      }

      let pStart = 0;
      while (pStart < paraWords.length) {
        const pEnd = Math.min(pStart + maxWords, paraWords.length);
        const slice = paraWords.slice(pStart, pEnd);
        chunks.push({
          chunkIndex: currentChunkIndex++,
          content: slice.join(' '),
          wordCount: slice.length
        });

        if (pEnd >= paraWords.length) {
          currentWords = slice.slice(Math.max(0, slice.length - overlap));
          break;
        }
        pStart += Math.max(1, maxWords - overlap);
      }
    } else if (currentWords.length + paraWords.length <= maxWords) {
      currentWords.push(...paraWords);
    } else {
      if (currentWords.length > 0) {
        chunks.push({
          chunkIndex: currentChunkIndex++,
          content: currentWords.join(' '),
          wordCount: currentWords.length
        });
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
  getLocalTermVector,
  STOP_WORDS
};
