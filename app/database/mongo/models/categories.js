import mongoose from "mongoose";
var Categories = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    appIcon: String,
    description: String
  },
  {
    collection: "categories",
    timestamps: true
  }
);
module.exports = mongoose.model("categories", Categories);
