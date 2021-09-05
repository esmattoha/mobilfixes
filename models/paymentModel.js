// Import Dependencies
const mongoose = require("mongoose");

// Define Mongoose Schema poperty
const Schema = mongoose.Schema;

// Create a New File Schema
const paymentSchema = new Schema(
  {
    order: {
      type: mongoose.Types.ObjectId,
      required: [true, "Order ID is required."],
      ref: "Order",
    },
    customer: {
      type: mongoose.Types.ObjectId,
      required: [true, "Customer Id is required"],
      ref: "User",
    },
    transactionId: {
      type: String,
    },
    gatewayCustomerId: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    status: {
      type: String,
      required: true,
    },
    message: {
      type: Object,
    },
  },
  { timestamps: true }
);

// Export File Schema
module.exports = mongoose.model("Payment", paymentSchema);
