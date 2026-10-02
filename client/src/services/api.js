import axios from 'axios';

const API_BASE = '/api';

export const api = {
  // Documents API
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE}/documents/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getDocuments: async () => {
    const response = await axios.get(`${API_BASE}/documents`);
    return response.data;
  },

  getDocumentById: async (id) => {
    const response = await axios.get(`${API_BASE}/documents/${id}`);
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await axios.delete(`${API_BASE}/documents/${id}`);
    return response.data;
  },

  seedSampleDocuments: async () => {
    const response = await axios.post(`${API_BASE}/documents/seed`);
    return response.data;
  },

  // RAG Testing API
  askQuestion: async (question, topK = 3, forceRetrievalFailure = false) => {
    const response = await axios.post(`${API_BASE}/rag/ask`, {
      question,
      topK,
      forceRetrievalFailure
    });
    return response.data;
  },

  // Diagnosis API
  getDiagnoses: async () => {
    const response = await axios.get(`${API_BASE}/diagnosis`);
    return response.data;
  },

  getDiagnosisById: async (id) => {
    const response = await axios.get(`${API_BASE}/diagnosis/${id}`);
    return response.data;
  },

  deleteDiagnosis: async (id) => {
    const response = await axios.delete(`${API_BASE}/diagnosis/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get(`${API_BASE}/diagnosis/stats`);
    return response.data;
  }
};
