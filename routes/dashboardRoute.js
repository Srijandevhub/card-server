const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const { getPaneCounts } = require('../controllers/dashboardController');

const router = express.Router();

router.get("/panecounts", authenticateToken, getPaneCounts);



module.exports = router;