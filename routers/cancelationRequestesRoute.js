// Import Dependencies
const express = require("express");
const cancelationRequestesController = require("../controllers/cancelationRequestesController");
const { isLoggedIn } = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");

// Define Express router poperty
const router = express.Router();


router.route("/cancelled-order")
.post([isLoggedIn],cancelationRequestesController.store)
.get( [isLoggedIn, userAuth.checkAdmin],cancelationRequestesController.index)
.patch([isLoggedIn, userAuth.checkAdmin],cancelationRequestesController.update)
.delete([isLoggedIn, userAuth.checkAdmin],cancelationRequestesController.delete);

// show user cancelations
router.get(
    "/user/cancelled-orders",
    [isLoggedIn],
    cancelationRequestesController.showUserCancelations
  );


// Export Router
module.exports = router;
