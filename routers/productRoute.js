const express = require("express");
const productController = require("./../controllers/productController");
const { isLoggedIn } = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/product",
  [isLoggedIn, userAuth.checkAdmin],
  productController.store
);

router
  .route("/product")
  .get(productController.index)
  .get(productController.search);

router.route("/products").get(productController.searchByCategory);

router
  .route("/product/:id")
  .patch([isLoggedIn, userAuth.checkAdmin], productController.update)
  .delete([isLoggedIn, userAuth.checkAdmin], productController.destroy);

router.route("/product/:slug").get(productController.show);

// export
module.exports = router;
