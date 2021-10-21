const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    // Material path
    device: {
      type: String,
      reuired: [true, "Device is required."],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
    },
    category:{
      type : String,
      required: [true, "Category is required."]
    },
    image: {
      type: String,
    },
    maxPrice: {
      type: Number,
      required: [true, "Highest Price is required"],
    },
    slug : {
      type : String,
      slug : "title"
    },
    variations: [
      {
        title: String,
        options: [
          {
            title: String,
            deduction: Number,
            image: String,
          },
        ],
      },
    ],
    questions: [
      {
        title: String,
        deduction: Number,
        notes: String,
      },
    ],
    conditions: [
      {
        title: String,
        notes: String,
        deduction: Number,
      },
    ],
    status: {
      type: String,
      enum: ["published", "hold"],
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
