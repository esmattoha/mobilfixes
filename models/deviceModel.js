// Import Dependencies
const mongoose = require("mongoose");

// Define Mongoose Schema poperty
const Schema = mongoose.Schema;

// Create a New Device Schema
const deviceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title field is required"],
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Device",
      default: null,
    },
    image: {
      type: String,
      // get: (val) => `${process.env.APP_URL}/${val}`,
    },
  },
  {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
  }
);

//Virtual Populate for Device Children
deviceSchema.virtual("children", {
  ref: "Device",
  localField: "_id",
  foreignField: "parent",
});

// Export device Schema
module.exports = mongoose.model("Device", deviceSchema);
