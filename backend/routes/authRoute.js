const { Router } = require("express");
const { check, body } = require("express-validator");
const { ImageSetup } = require("../middlewares/multer_setup.js");

const authController = require("../controllers/authController.js");

const router = Router();

const multerUpload = ImageSetup("profile");

router.post(
  "/signup",
  multerUpload.single("image"),
  [
    body("email", "invalid email").isEmail().notEmpty().trim(),
    body("name", "invalid name").notEmpty().trim(),
    body("password", "invalid password")
      .notEmpty()
      .isStrongPassword({ min: 5, minSymbols: 0, minLength: 5, minNumbers: 0 })
      .trim(),
  ],
  authController.postSignup
);

router.post(
  "/login",
  [
    body("email", "invalid email").isEmail().notEmpty().trim(),
    body("password", "invalid password").notEmpty().trim(),
  ],
  authController.postLogin
);

module.exports = router;
