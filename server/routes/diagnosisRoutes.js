const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/diagnosisController');

router.get('/', diagnosisController.getDiagnoses);
router.get('/stats', diagnosisController.getDashboardStats);
router.get('/:id', diagnosisController.getDiagnosisById);
router.delete('/:id', diagnosisController.deleteDiagnosis);

module.exports = router;
