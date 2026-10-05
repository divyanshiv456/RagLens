const express = require('express');
const router = express.Router();
const ragController = require('../controllers/ragController');

// Standard RAG Diagnosis
router.post('/ask', ragController.askQuestion);

// Smart RAG Repair Lab
router.post('/repair', ragController.repairPipeline);

// Automated Batch RAG Testing
router.post('/test-suite', ragController.runTestSuite);

// RAG Performance Analytics
router.get('/performance', ragController.getPerformanceMetrics);

// Interactive Pipeline Replay Data
router.post('/replay', ragController.getPipelineReplay);

// Export Diagnosis Report
router.post('/export-report', ragController.exportReport);

module.exports = router;
