import mongoose from "mongoose";
var News = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    date: String,
    description: String,
    image: String,
    gallery: [
      {
        type: String
      }
    ]
  },
  {
    collection: "news",
    timestamps: true
  }
);
module.exports = mongoose.model("news", News);
