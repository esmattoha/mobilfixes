// Import Dependencies
const mongoose = require("mongoose");

// Define Mongoose Schema poperty
const Schema = mongoose.Schema;

// Create a New File Schema
const fileSchema = new Schema(
  {
    path: {
      type: String,
      required: true,
      get: (val) => `${process.env.APP_URL}/${val}`,
    },
  },
  {
    toJSON: { getters: true },
  }
);

// Export File Schema
module.exports = mongoose.model("File", fileSchema);
