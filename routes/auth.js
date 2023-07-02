const express = require("express");
const exValidator = require("express-validator");

exValidator.check();

const authController = require("../controllers/auth");

const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    exValidator
      .check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
         return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-mail exists already, please pick a different one"
            );
          }
        });
      }),

    exValidator
      .body(
        "password",
        "Please enter a password with only numbers and text and at least 5 characters"
      )
      .isLength({ min: 5 })
      .isAlphanumeric(),

    exValidator.body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password have to match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);

module.exports = router;
