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
    gallery: {
      images: [
        {
          type: Array
        }
      ],
      videos: [
        {
          type: Array
        }
      ]
    }
  },
  {
    collection: "news",
    timestamps: true
  }
);
module.exports = mongoose.model("news", News);
