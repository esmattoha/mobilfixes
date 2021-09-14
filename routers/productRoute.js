// Import Dependencies
const express = require("express");
const productController = require("../controllers/productController");

// Define Express router poperty
const router = express.Router();

router.post("/product", productController.store);

router.patch("/product/variation/:id", productController.addNewVariation);

router.patch("/product/variation", productController.removeVariation);

router.patch("/product/condition/:id", productController.addNewCondition);

router.patch("/product/condition", productController.removeCondition);

router.patch("/product/question/:id", productController.addNewQuestion);

router.patch("/product/question", productController.removeQuestion);


router.delete("/product/:id", productController.delete);

// Export Router
module.exports = router;
