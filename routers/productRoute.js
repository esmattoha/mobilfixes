// Import Dependencies
const express = require("express");
const productController = require("../controllers/productController");

// Define Express router poperty
const router = express.Router();

router.post("/product", productController.store);

router.patch("/product/:id", productController.addNewVariation);

router.patch("/variation", productController.removeVariation);

router.delete("/product/:id", productController.delete);

// Export Router
module.exports = router;
