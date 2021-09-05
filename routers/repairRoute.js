// Import Dependencies
const express = require("express");
const repairController = require("../controllers/repairController");
const { isLoggedIn } = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");
const cache = require("../middleware/cacheMiddleware/cache");

// Define Express router poperty
const router = express.Router();

/*
 *   Store Repair, Only Admin can access this routes
 */
router.post(
  "/repair",
  [isLoggedIn, userAuth.checkAdmin],
  repairController.store
);

/*
 *   Fetch All Repairs
 */
router.get("/repair", [cache.cacheMiddleware(30)], repairController.index);

/*
 *   Fetch  Repair
 */
router.get("/repair/:repairId", [isLoggedIn], repairController.show);

/*
 *   Update  Repair
 */
router.patch(
  "/repair/:repairId",
  [isLoggedIn],
  repairController.update
);

/*
 *   Find Repair By Device
 *   device query parameter
 */
router.get(
  "/repair/device/:device",
  [cache.cacheMiddleware(30)],
  repairController.findRepairs
);

/*
 *   Delete Repair
 */
router.delete(
  "/repair/:repairId",
  [isLoggedIn, userAuth.checkAdmin],
  repairController.delete
);

// Export Router
module.exports = router;
