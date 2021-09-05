// Import Dependencies
const mongoose = require("mongoose");

// Define Mongoose Schema poperty
const Schema = mongoose.Schema;

// Create a New Repair Schema
const repairSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Repair title field is required"],
    },
    price: {
      type: Number,
      required: [true, "Repair price field is required"],
    },
    device: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Device",
      },
    ],
    services: [
      {
        type: String,
        enum: ["we-come-to-you", "mail-in"],
      },
    ],
    image: {
      type: String,
    },
  },
  {
    timeStamp: true,
  }
);

// Export repair Schema
module.exports = mongoose.model("Repair", repairSchema);
