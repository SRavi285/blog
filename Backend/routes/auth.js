const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const {
  signupValidator,
  signinValidator,
  emailValidator,
  verifyUserValidator,
  recoverPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
} = require("../validators/auth");
const validate = require("../validators/validator");
const isAuth = require("../middlewares/isAuth");

router.post("/signup", signupValidator, validate, authController.signup);

router.post("/signin", signinValidator, validate, authController.signin);

router.post(
  "/send-verification-email",
  emailValidator,
  authController.verifyCode
);

router.post(
  "/verify-user",
  verifyUserValidator,
  validate,
  authController.verifyUser
);

router.post(
  "/forgot-password-code",
  emailValidator,
  validate,
  authController.forgotePasswprdCode
);

router.post(
  "/recover-password",
  recoverPasswordValidator,
  validate,
  authController.recoverPassword
);

router.put(
  "/change-password",
  changePasswordValidator,
  validate,
  isAuth,
  authController.chnagePassword
);

router.put(
  "/update-profile",
  isAuth,
  updateProfileValidator,
  validate,
  authController.updateProfile
);

router.get("/current-user", isAuth, authController.currentUser);

module.exports = router;
