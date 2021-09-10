// Import Dependencies
const mongoose = require("mongoose");

// Define Mongoose Schema poperty
const Schema = mongoose.Schema;

// Create a New File Schema
const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    image: {
      type: String,
    },
    highest_price: {
      type: Number,
      required: [true, "Price is required."],
    },
    variations: [
      {
        storage: {
          size: {
            type: Number,
            required: [true, "Storage is required."],
          },
          deduction: {
            type: Number,
            required: [true, "Deduction is required."],
          },
        },
        colour: {
          title: {
            type: String,
            required: [true, "Colour is required."],
          },
          deduction: {
            type: Number,
            required: [true, "Deduction is required."],
          },
        },
      },
    ],
  },
  {
    toJSON: { getters: true },
  }
);

// export
module.exports = mongoose.model("Product", productSchema);
