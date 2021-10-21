const express = require("express");
const productController = require("./../controllers/productController");
const { isLoggedIn } = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/product",
  [isLoggedIn, userAuth.checkAdmin],
  [
    check("device")
      .isString()
      .isLength({ min: 4, max: 20 })
      .withMessage("Invalid Input data, device"),
    check("title")
      .isString()
      .isLength({ min: 4, max: 20 })
      .withMessage("Invalid Input data, title"),
    check("category")
      .isString()
      .isLength({ min: 4, max: 20 })
      .withMessage("Invalid Input data, category"),
    check("maxPrice")
      .isNumeric()
      .isLength({ min: 2 })
      .withMessage("Invalid Input data, maxPrice"),
  ],
  productController.store
);

router
  .route("/product")
  .get(productController.index)
  .get(productController.search);

router.route("/products").get(productController.searchByCategory);

router
  .route("/product/:id")
  .patch(
    [isLoggedIn, userAuth.checkAdmin],
    [
      check("device")
        .isString()
        .isLength({ min: 4, max: 20 })
        .withMessage("Invalid Input data, device"),
      check("title")
        .isString()
        .isLength({ min: 4, max: 20 })
        .withMessage("Invalid Input data, title"),
      check("category")
        .isString()
        .isLength({ min: 4, max: 20 })
        .withMessage("Invalid Input data, category"),
      check("maxPrice")
        .isNumeric()
        .isLength({ min: 2 })
        .withMessage("Invalid Input data, maxPrice"),
    ],
    productController.update
  )
  .delete([isLoggedIn, userAuth.checkAdmin], productController.destroy);

router.route("/product/:slug").get(productController.show);

// export
module.exports = router;
