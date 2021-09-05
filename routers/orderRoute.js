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

/*
 *   Loging Check & Store Booking
 */
router.post("/order", [bookingAuth.bookingMiddlleware], orderController.store);

/*
 *  Shows customers bookings
 */
router.get(
  "/order/customer-bookings",
  [isLoggedIn],
  orderController.showCustomerBookings
);
/*
 *   Loging Check & Fetch All Booking
 */
router.get(
  "/order",
  [isLoggedIn, userAuth.checkAdmin, [cache.cacheMiddleware(30)]],
  orderController.index
);

/*
 *   Loging Check & Fetch Booking
 */
router.get("/order/:id", [isLoggedIn], orderController.show);

/*
 *   Loging Check & Update Booking
 */
router.patch(
  "/order/:id",
  [isLoggedIn, userAuth.checkAdmin],
  orderController.update
);

/*
 *   Loging Check & Delete Booking
 */
router.delete(
  "/order/:id",
  [isLoggedIn, userAuth.checkAdmin],
  orderController.delete
);

/*
 *   Search a date is available or not
 */
router.get(
  "/booked-dates",
  [cache.cacheMiddleware(30)],
  orderController.appointmentDates
);

/**
 * 
 */
router.get(
  "/order/:id/shipment",
  [isLoggedIn, [cache.cacheMiddleware(30)]],
  shipmentController.getByOrderId
);

// Export Router
module.exports = router;
