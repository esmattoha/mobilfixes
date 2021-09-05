const mongoose = require("mongoose");

const ShipmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Booking is required."],
    },
    gatewayId: {
      type: String,
    },
    trackingNumber: {
      type: String,
    },
    trackingUrl: {
      type: String,
    },
    labelUrl: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Shipment", ShipmentSchema);
