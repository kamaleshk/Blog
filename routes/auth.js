const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { validateRegister } = require("../middleware/validation");
const { authLimiter } = require("../middleware/rateLimiter");


router.post("/register", validateRegister, authController.register);
router.post("/login", authLimiter, authController.login);

router.get("/profile", protect, authController.getProfile);
router.put("/profile", protect, authController.updateProfile);
router.put("/change-password", protect, authController.changePassword);


module.exports = router;