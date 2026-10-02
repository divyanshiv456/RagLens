const express = require('express');
const router = express.Router();
const ragController = require('../controllers/ragController');

router.post('/ask', ragController.askQuestion);

module.exports = router;
