const express = require('express');
const { getDashboardStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardStats);

module.exports = router;
