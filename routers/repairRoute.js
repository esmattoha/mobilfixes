// Import Dependencies
const express = require("express");
const repairController = require("../controllers/repairController");
const { isLoggedIn } = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");
const cache = require("../middleware/cacheMiddleware/cache");
const { check } = require("express-validator");

// Define Express router poperty
const router = express.Router();

router
  .route("/repair")
  .post(
    [isLoggedIn, userAuth.checkAdmin],
    [
      check("title")
        .isString()
        .isLength({ min: 3, max: 30 })
        .withMessage("Invalid Input data, Title."),
      check("price")
        .isNumeric()
        .isLength({ min: 2 })
        .withMessage("Invalid Input data, Price."),
    ],
    repairController.store
  )
  .get([cache.cacheMiddleware(30)], repairController.index);

router
  .route("/repair/:repairId")
  .get([isLoggedIn], repairController.show)
  .patch(
    [isLoggedIn, userAuth.checkAdmin],
    [
      check("title")
        .isString()
        .isLength({ min: 3, max: 30 })
        .withMessage("Invalid Input data, Title."),
      check("price")
        .isNumeric()
        .isLength({ min: 2 })
        .withMessage("Invalid Input data, Price."),
    ],
    repairController.update
  )
  .delete([isLoggedIn, userAuth.checkAdmin], repairController.delete);

// Find Repair By Device
router.get(
  "/repair/device/:device",
  [cache.cacheMiddleware(30)],
  repairController.findDevices
);

// Export Router
module.exports = router;
