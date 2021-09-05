// Import Dependencies
const express = require("express");
const fileController = require("../controllers/fileController");
const upload = require("../utils/fileImage");
const { isLoggedIn } = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");
// const cache = require("../middleware/cacheMiddleware/cache");

// Define Express router poperty
const router = express.Router();

/**
 * GET /file
 */

router.get(
  "/file",
  [isLoggedIn, userAuth.checkAdmin],
  fileController.index
);

/**
 * Stores file path on database
 */
router.post(
  "/file",
  upload.single("file"),
  [isLoggedIn],
  fileController.store
);

router.delete(
  "/file/:fileId",
  [isLoggedIn, userAuth.checkAdmin],
  fileController.delete
);

// Export Router
module.exports = router;
