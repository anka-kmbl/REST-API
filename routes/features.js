const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const User = require('../models/user');
const path = require('path');
const htmlPath = path.resolve(__dirname, '../public', 'html');
const featuresController = require('../controllers/featuresController');

router.get('/info', isLoggedIn, featuresController.getUserInfo);
router.get('/latency', isLoggedIn, featuresController.getLatency);

module.exports = router;