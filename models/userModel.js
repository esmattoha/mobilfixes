// Import Dependencies
const mongoose = require("mongoose");

// Define Mongoose Schema poperty
const Schema = mongoose.Schema;

// Create a New User Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      min:[4, "Atleast 4 character is required."],
      max:[20, "You exceed charater limit."],
      trim: true ,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true ,
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
      trim: true ,
      min: [4, "Must be 4 charater."],
      max: [12, "You exceed charater limit."],
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
    verification_token: String,
    verification_expire_at: Date,
    reset_token: String,
    reset_expire_at: Date,
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
