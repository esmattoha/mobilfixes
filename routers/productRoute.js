const express = require("express");
const productController = require("./../controllers/productController");
const { isLoggedIn } = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");

const router = express.Router();

router
  .route("/product")
  .get(productController.index)
  .get( productController.search)
  .post([isLoggedIn, userAuth.checkAdmin], productController.store);

router
  .route("/product/:id")
  .get(productController.show)
  .patch([isLoggedIn, userAuth.checkAdmin], productController.update)
  .delete([isLoggedIn, userAuth.checkAdmin], productController.destroy);


// export
module.exports = router;
