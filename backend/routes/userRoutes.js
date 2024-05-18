const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/checkAdmin');

router.get("/", verifyToken, checkAdmin, userController.getAllUsers);
router.get("/:id", verifyToken, userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser); 

module.exports = router;