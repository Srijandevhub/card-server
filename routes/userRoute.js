const express = require('express');
const { signup, login, logout, getUser, addUser, getUsers, getSelectedUser, updateUser, firstLogin, removeProfileImage, updateSingleUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

const multer = require('multer');
const { authenticateToken } = require('../middlewares/auth');

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


router.post("/signup", upload.single('image'), signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/get", getUser);
router.put("/removeprofileimage", authenticateToken, removeProfileImage);
router.put("/updatesingleuser", upload.single('image'), authenticateToken, updateSingleUser);

router.post("/adduser", authenticateToken, addUser);
router.get("/getusers", authenticateToken, getUsers);
router.get("/getuser/:id", getSelectedUser);
router.put("/updateuser/:id", updateUser);
router.delete("/deleteuser/:id", deleteUser);

router.put("/firstlogin", authenticateToken, firstLogin);

module.exports = router;