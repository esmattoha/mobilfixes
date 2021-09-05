// Import Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const Repair = require("../models/repairModel");

// Create a New Device Schema
const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      unique: [true, "Order Number is already in use."],
      required: [true, "Order Number is required."],
    },
    type: {
      type: String,
      enum: ["appointment", "order"],
    },
    metaData: {
      device: Object,
      model: Object,
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Customer Id is required."],
    },
    items: [
      {
        _id: {
          type: mongoose.Schema.ObjectId,
        },
        title: {
          type: String,
          required: [true, "Title is required."],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required."],
          default: 1,
        },
        price: {
          type: Number,
          required: [true, "Price is required."],
        },
      },
    ],
    customerInfo: {
      name: {
        type: String,
        required: [true, "Customer Name is required."],
      },
      email: {
        type: String,
        required: [true, "Customer Email is required."],
      },
      phone: {
        type: String,
        required: [true, "Customer Phone is required."],
      },
    },
    shippingAddress: {
      long: Number,
      lat: Number,
      addressLine1: {
        type: String,
        required: [true, "Address Line 1 is required."],
      },
      addressLine2: String,
      city: {
        type: String,
        required: [true, "City is required."],
      },
      state: {
        type: String,
        required: [true, "State is required."],
      },
      zipcode: {
        type: String,
        required: [true, "Zipcode is required."],
      },
    },
    billingAddress: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zipcode: Number,
    },
    customerNotes: String,
    totalAmount: Number,
    status: {
      type: String,
      enum: ["hold", "processing", "confirmed", "cancelled", "completed"],
      default: "processing",
    },
    service: {
      type: String,
      enum: ["we-come-to-you", "mail-in"],
    },
    appointmentTime: {
      type: Date,
    },
    customNotes: String,
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

// Create index at orderNumber
// orderSchema.index({ orderNumber: 1, appointmentTime: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ appointmentTime: 1 });

// Virtual Payment populates
orderSchema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "order",
});

orderSchema.virtual("dueAmount").get(function () {
  let totalPayment = 0;
  if (this.payments && this.payments.length > 0) {
    this.payments.forEach((payment) => {
      totalPayment += payment.amount;
    });
  }
  return this.totalAmount ? (this.totalAmount - totalPayment).toFixed(2) : 0;
});

// Export book Schema
module.exports = mongoose.model("Order", orderSchema);
