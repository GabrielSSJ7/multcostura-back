import mongoose from "mongoose";
var Categories = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    appIcon: String,
    description: String,
    bannerImages: [
      {
        link: String,
        id: Number,
        image: String
      }
    ]
  },
  {
    collection: "categories",
    timestamps: true
  }
);
module.exports = mongoose.model("categories", Categories);
