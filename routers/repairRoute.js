// Import Dependencies
const express = require("express");
const repairController = require("../controllers/repairController");
const { isLoggedIn } = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");
const cache = require("../middleware/cacheMiddleware/cache");

// Define Express router poperty
const router = express.Router();

router
  .route("/repair")
  .post([isLoggedIn, userAuth.checkAdmin], repairController.store)
  .get([cache.cacheMiddleware(30)], repairController.index);

router
  .route("/repair/:repairId")
  .get([isLoggedIn], repairController.show)
  .patch([isLoggedIn, userAuth.checkAdmin], repairController.update)
  .delete([isLoggedIn, userAuth.checkAdmin], repairController.delete);

// Find Repair By Device
router.get(
  "/repair/device/:device",
  [cache.cacheMiddleware(30)],
  repairController.findRepairs
);

// Export Router
module.exports = router;
