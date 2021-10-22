// Import Dependencies
const express = require("express");
const userController = require("../controllers/userController");
const { isLoggedIn } = require("./../middleware/checkAuthMiddleware");
const userAuthMiddleware = require("./../middleware/userAuthMiddleware");
const cache = require("../middleware/cacheMiddleware/cache");
const { check } = require("express-validator");

// Define Express router poperty
const router = express.Router();

router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Email is not valid."),
    check("name")
      .isString()
      .isLength({ min: 5, max: 20 })
      .withMessage("Name must be 5 to 14 charaters. "),
    check("password")
      .isLength({ min: 6, max: 12 })
      .withMessage("Password must be in 6-12 character ."),
    check("phone")
      .isNumeric()
      .isLength({ min: 8, max: 14 })
      .withMessage("Put a valid phone number. "),
  ],
  userController.signUp
);

router.post("/email-verification/:token", userController.verifyEmail);

router
  .route("/login")
  .post(
    [
      check("email").isEmail().withMessage("Email is not valid."),
      check("password")
        .isLength({ min: 6, max: 12 })
        .not()
        .withMessage("Password must be in 6-12 character ."),
    ],
    userController.signIn
  );

  ///
  router.post("/token",  userController.newToken);

  router.post("/token/disable",  userController.disabledToken);

  ///
/*
 *  Returns authenticated user
 */
router
  .route("/me")
  .get([isLoggedIn, cache.cacheMiddleware(30)], userController.me)
  .patch([isLoggedIn, userController.update]);

router.delete(
  "/delete/:id",
  [isLoggedIn, userAuthMiddleware.checkAdmin],
  userController.delete
);

router
  .route("/address")
  .post([isLoggedIn], userController.addNewAddress)
  .get([isLoggedIn], userController.showAddresses)
  .patch([isLoggedIn], userController.updateAddress)
  .delete([isLoggedIn], userController.deleteAddress);

router.post("/reset", userController.resetPassword);

router.post("/reset/:buffer", userController.updatePassword);

// Export Router
module.exports = router;
