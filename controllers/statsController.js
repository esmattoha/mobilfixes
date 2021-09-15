const User = require("./../models/userModel");
const Order = require("./../models/orderModel");
const catchAsync = require("./../utils/catchAsync");

const getStats = catchAsync(async (req, res, next) => {
  // Get User Count with customer role
  const userCount = await User.countDocuments({ type: "customer" });
  // Get Pending Orders Count
  const pendingOrders = await Order.countDocuments({ status: "processing" });
  // Get total price of all orders
  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: "hold" } } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
  ]);
  // Get monthly revenue and number of orders and Map the month to month date

  const monthlyRevenue = await Order.aggregate([
    { $match: { status: { $ne: "hold" } } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalPrice: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    // Map the Month number to month name
    {
      $addFields: {
        month: {
          $switch: {
            branches: [
              { case: { $eq: ["$_id", 1] }, then: "January" },
              { case: { $eq: ["$_id", 2] }, then: "February" },
              { case: { $eq: ["$_id", 3] }, then: "March" },
              { case: { $eq: ["$_id", 4] }, then: "April" },
              { case: { $eq: ["$_id", 5] }, then: "May" },
              { case: { $eq: ["$_id", 6] }, then: "June" },
              { case: { $eq: ["$_id", 7] }, then: "July" },
              { case: { $eq: ["$_id", 8] }, then: "August" },
              { case: { $eq: ["$_id", 9] }, then: "September" },
              { case: { $eq: ["$_id", 10] }, then: "October" },
              { case: { $eq: ["$_id", 11] }, then: "November" },
              { case: { $eq: ["$_id", 12] }, then: "December" },
            ],
            default: "Invalid Month",
          },
        },
      },
    },
  ]);

  const citywiseOrders = await Order.aggregate([
    { $match: { status: { $ne: "hold" } } },
    { $group: { _id: "$shippingAddress.city", totalOrders: { $sum: 1 } } },
    { $sort: { totalOrders: -1 } },
  ]);

  // Send response
  res.status(200).json({
    userCount,
    pendingOrders,
    totalRevenue: totalRevenue[0].totalRevenue.toFixed(2),
    monthlyRevenue,
    citywiseOrders,
  });
});

module.exports = {
  getStats,
};
