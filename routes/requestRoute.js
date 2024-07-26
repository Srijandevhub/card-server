const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const { saveRequest, getRequests, getRequest, sendChat } = require('../controllers/requestController');

const router = express.Router();

router.post("/saverequest", authenticateToken, saveRequest);
router.get("/getrequests", authenticateToken, getRequests);
router.get("/getrequest/:id", authenticateToken ,getRequest);
router.put("/chat/:id", sendChat);

module.exports = router;