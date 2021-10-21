// Import Dependencies
const express = require("express");
const deviceController = require("../controllers/deviceController");
const { isLoggedIn } = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");
const cache = require("../middleware/cacheMiddleware/cache");
const { check } = require("express-validator");

// Define Express router poperty
const router = express.Router();

router
  .route("/device")
  .post([isLoggedIn, userAuth.checkAdmin], [
    check("title").isString().isLength({min:4}).withMessage("Invalid input data , title.")
  ],deviceController.store)
  .get([cache.cacheMiddleware(30)], deviceController.index);


router
  .route("/device/:deviceId")
  .patch([isLoggedIn, userAuth.checkAdmin], deviceController.update)
  .get([cache.cacheMiddleware(30)], deviceController.show)
  .delete([isLoggedIn, userAuth.checkAdmin], deviceController.delete);

// Fetch Repairs of device
router.get(
  "/device/:device/repairs",
  [isLoggedIn],
  deviceController.findRepairs
);


// Export Router
module.exports = router;
