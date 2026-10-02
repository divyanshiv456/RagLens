const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const documentRoutes = require('./routes/documentRoutes');
const ragRoutes = require('./routes/ragRoutes');
const diagnosisRoutes = require('./routes/diagnosisRoutes');
const { seedSampleDocuments } = require('./services/seedService');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/diagnosis', diagnosisRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'RAG Doctor 🩺 API',
    timestamp: new Date()
  });
});

// Database Connection & Server Initialization
async function startServer() {
  let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rag-doctor';

  try {
    // Attempt connecting to specified MongoDB URI
    console.log(`📡 Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
    console.log('✅ Connected to MongoDB successfully.');
  } catch (err) {
    console.warn(`⚠️ Local MongoDB connection failed: ${err.message}`);
    console.log('🔄 Launching in-memory MongoDB server (zero setup required!)...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to In-Memory MongoDB successfully.');
    } catch (memErr) {
      console.error('❌ Failed to launch in-memory MongoDB server:', memErr);
    }
  }

  // Auto-seed sample documents if collection is empty
  await seedSampleDocuments(false);

  app.listen(PORT, () => {
    console.log(`\n🩺 RAG Doctor Server running on http://localhost:${PORT}`);
    console.log(`   - Documents API: http://localhost:${PORT}/api/documents`);
    console.log(`   - RAG API:       http://localhost:${PORT}/api/rag/ask`);
    console.log(`   - Diagnosis API: http://localhost:${PORT}/api/diagnosis\n`);
  });
}

startServer();
