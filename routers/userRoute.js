// Import Dependencies
const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const { isLoggedIn } = require("./../middleware/checkAuthMiddleware");
const userAuthMiddleware = require("./../middleware/userAuthMiddleware");
const cache = require("../middleware/cacheMiddleware/cache");

// Define Express router poperty
const router = express.Router();

/*
 *   Store User data with User Sign Up Route
 */
router.post(
  "/signup",
  check("email", "Invalid email").isEmail(),
  userController.signUp
);

/**
 * Delete User
 */
router.delete(
  "/delete/:id",
  [isLoggedIn, userAuthMiddleware.checkAdmin],
  userController.delete
);

/**
 * email Verification
 */
router.post("/email-verification", userController.validateEmail);

/*
 *  User Sign In Route
 */
router.route("/login").post(userController.signIn);

/*
 *  Returns authenticated user
 */
router
  .route("/me")
  .get([isLoggedIn, cache.cacheMiddleware(30)], userController.me)
  .patch([isLoggedIn, userController.update]);

/*
 *  Add User new address
 */
router.post("/address", [isLoggedIn], userController.addNewAddress);

/*
 *  show Addresses of User
 */
router.get("/address", [isLoggedIn], userController.showAddresses);

/*
 *  Update User address
 */
router.patch("/address", [isLoggedIn], userController.updateAddress);

/*
 *  Delete User address
 */
router.delete("/address", [isLoggedIn], userController.deleteAddress);

/*
 *  Make a token to reset password
 */
router.post("/reset", userController.resetPassword);

/*
 *  Upadate password
 */
router.post("/reset/:buffer", userController.updatePassword);

// Export Router
module.exports = router;
