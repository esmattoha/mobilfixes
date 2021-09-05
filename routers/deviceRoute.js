// Import Dependencies
const express = require("express");
const deviceController = require("../controllers/deviceController");
const { isLoggedIn } = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");
const cache = require("../middleware/cacheMiddleware/cache");
const repairController = require("./../controllers/repairController");

// Define Express router poperty
const router = express.Router();

/*
 *  Store Device
 */
router.post(
  "/device",
  [isLoggedIn, userAuth.checkAdmin],
  deviceController.store
);

/*
 * Update device
 */
router.patch(
  "/device/:id",
  [isLoggedIn, userAuth.checkAdmin],
  deviceController.update
);

/*
 *  Fetch Device
 */
router.get("/device", [cache.cacheMiddleware(30)], deviceController.index);

/*
 *  Fetch Device
 */
router.get(
  "/device/:deviceId",
  [cache.cacheMiddleware(30)],
  deviceController.show
);

/*
 *  Delete Device
 */
router.delete(
  "/device/:deviceId",
  [isLoggedIn, userAuth.checkAdmin],
  deviceController.delete
);

/*
 *  Fetch Repairs of device
 */
router.get(
  "/device/:device/repairs",
  [isLoggedIn],
  repairController.findRepairs
);

// Export Router
module.exports = router;
