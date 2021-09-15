const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");
const statsController = require("../controllers/statsController");

router.get("/dasboard", statsController.getStats);

module.exports = router;
