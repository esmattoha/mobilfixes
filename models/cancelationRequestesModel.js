// Import Dependencies
const mongoose = require("mongoose");

// Define Mongoose Schema poperty
const Schema = mongoose.Schema;

// Create a New File Schema
const cancelationSchema = new Schema(
  {
    order: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    cancelledAt: {
      type: Date,
      default: new Date(),
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export File Schema
module.exports = mongoose.model("Cancelation", cancelationSchema);
