// Import Dependencies
const express = require("express");
const cancelationRequestesController = require("../controllers/cancelationRequestesController");
const { isLoggedIn } = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");

// Define Express router poperty
const router = express.Router();

//  store the user cancelation
router.post(
  "/cancelled-order",
  [isLoggedIn],
  cancelationRequestesController.store
);

// show user cancelations
router.get(
    "/user/cancelled-orders",
    [isLoggedIn],
    cancelationRequestesController.showUserCancelations
  );

// Show All Cancelations
router.get(
  "/cancelled-orders",
  [isLoggedIn, userAuth.checkAdmin],
  cancelationRequestesController.index
);

// Update Cancelation 
router.patch(
  "/cancelled-order",
  [isLoggedIn, userAuth.checkAdmin],
  cancelationRequestesController.update
);

// Delete  Cancelation
router.delete(
  "/cancelled-order",
  [isLoggedIn, userAuth.checkAdmin],
  cancelationRequestesController.delete
);

// Export Router
module.exports = router;
