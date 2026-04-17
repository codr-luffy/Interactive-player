const { Router } = require("express");
const authController = require("../controllers/auth.Controller.js");
const router = Router();
const authMiddleware = require("../middlewares/auth.middleware.js");

router.post("/register", authController.registerController);

router.post("/login", authController.loginController);

router.get("/getMe", authMiddleware.authUser, authController.getMe);

router.get("/logout", authController.logoutUser);

module.exports = router;
