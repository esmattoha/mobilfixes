// Import Dependencies
const mongoose = require("mongoose");

// Define Mongoose Schema poperty
const Schema = mongoose.Schema;

// Create a New Shop Schema
const shopSchema = new Schema({
  // Who Add the The shop
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  title: {
    type: String,
    required: true,
  },
  phone:[Number],
  address: {
    type: String,
    required: true,
  },

  // Which Services provide the shop
  services: [{
    type: String,
    enum: ["we-come-to-you", "mail-in"],
  }],

  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },

  // Shop image
  cover: {
    type: String,
    required: true,
  },

  // What repairs , the shop Provide
  repairs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Repair",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

shopSchema.index({ location: "2dsphere" });

// Method to add Repair in shop
// shopSchema.methods.addToRepair = function (p) {
//   const updatedRepairItems = [...this.repairs];

//   updatedRepairItems.push({
//     repair: p._id,
//   });
//   this.repairs = updatedRepairItems;
//   return this.save();
// };

// Export User Schema
module.exports = mongoose.model("Shop", shopSchema);
