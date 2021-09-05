const express = require("express");
const { isLoggedIn } = require("../middleware/checkAuthMiddleware");
const paymentController = require("../controllers/paymentController");
const router = express.Router();

router.post("/payment/get-intent", [isLoggedIn], paymentController.getIntent);
router.post("/payment", [isLoggedIn], paymentController.store);
router.get("/payment", [isLoggedIn], paymentController.index);
router.get(
  "/payment/billing",
  [isLoggedIn],
  paymentController.getPaymentMethods
);
module.exports = router;
