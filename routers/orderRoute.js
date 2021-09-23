// Import Dependencies
const express = require("express");
const orderController = require("../controllers/orderController");
const { isLoggedIn } = require("../middleware/checkAuthMiddleware");
const bookingAuth = require("../middleware/bookingAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");
const cache = require("../middleware/cacheMiddleware/cache");
const shipmentController = require("../controllers/shipmentController");

// Define Express router poperty
const router = express.Router();

router
  .route("/order")
  .post([bookingAuth.bookingMiddlleware], orderController.store)
  .get(
    [isLoggedIn, userAuth.checkAdmin, [cache.cacheMiddleware(30)]],
    orderController.index
  );

router.get("/order/customer-bookings", [isLoggedIn], orderController.showCustomerBookings);

router
  .route("/order/:id")
  .get([isLoggedIn], orderController.show)
  .patch([isLoggedIn, userAuth.checkAdmin], orderController.update)
  .delete([isLoggedIn, userAuth.checkAdmin], orderController.delete);


// Search a date is available or not
router.get(
  "/booked-dates",
  [cache.cacheMiddleware(30)],
  orderController.appointmentDates
);


//
router.get(
  "/order/:id/shipment",
  [isLoggedIn, [cache.cacheMiddleware(30)]],
  shipmentController.getByOrderId
);

// Export Router
module.exports = router;
