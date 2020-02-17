import mongoose from "mongoose";
var Tools = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "manufacturer",
    },
    description: String,
    video: {
      link: String,
      web: Boolean
    },
    images: [],
    mainFeatures: ""
  },
  {
    collection: "tools",
    timestamps: true
  }
);
module.exports = mongoose.model("tools", Tools);
