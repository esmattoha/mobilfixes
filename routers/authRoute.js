// Import Dependencies
const express = require("express");
const authController = require('../controllers/authController');

// Define Express router poperty
const router = express.Router();

router.post("/refresh-token", authController.tokenRegenarate);

// Export Router
module.exports = router;
