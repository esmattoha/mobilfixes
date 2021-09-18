// Import Dependencies
const express = require("express");
const userController = require("../controllers/userController");
const { isLoggedIn } = require("./../middleware/checkAuthMiddleware");
const userAuthMiddleware = require("./../middleware/userAuthMiddleware");
const cache = require("../middleware/cacheMiddleware/cache");

// Define Express router poperty
const router = express.Router();


router.post("/signup", userController.signUp);

router.post("/email-verification/:token", userController.verifyEmail);

router.route("/login").post(userController.signIn);

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
