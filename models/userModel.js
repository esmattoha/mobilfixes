// Import Dependencies
const mongoose = require("mongoose");

// Define Mongoose Schema poperty
const Schema = mongoose.Schema;

// Create a New User Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Email id is already exists."],
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required."],
    },
    password: {
      type: String,
      require: [true, "Password is required."],
      select: false,
    },
    type: {
      type: String,
      required: true,
      default: "customer",
      enum: ["customer", "manager", "admin"],
    },
    address: [
      {
        long: Number,
        lat: Number,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        zipcode: Number,
      },
    ],
    loaction: {
      type: Object,
    },
    blockedAt: {
      type: Date,
      default: null,
    },
    stripeId: String,
    otpToken: String,
    otpTokenExpiration: Date,
    resetToken: String,
    resertTokenExpiration: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Payments property
userSchema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "customer",
});

// Export User Schema
module.exports = mongoose.model("User", userSchema);
