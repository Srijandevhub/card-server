const express = require('express');
const router = express.Router();
const multer = require('multer');
const { saveCard, getCard, getCards, deleteCard, updateCard } = require('../controllers/cardController');
const { authenticateToken, authenticateforCard } = require('../middlewares/auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
})

const upload = multer({
    storage: storage
})


router.post("/savecard", authenticateToken, upload.single('profileimage'), saveCard);
router.get("/getcards", authenticateToken, getCards);
router.get("/getcard/:id", authenticateforCard, getCard);
router.delete("/deletecard/:id", deleteCard);
router.put("/updatecard/:id", upload.single("profileimage"), updateCard);

module.exports = router;