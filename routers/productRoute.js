// Import Dependencies
const express = require("express");
const productController = require("../controllers/productController");

// Define Express router poperty
const router = express.Router();

router.post("/product", productController.store);

router.patch("/product/:id", productController.addNewVariation);

// Export Router
module.exports = router;
