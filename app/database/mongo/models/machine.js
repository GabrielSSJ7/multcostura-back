import mongoose from "mongoose";
var Machine = new mongoose.Schema(
   {
    name: {
      type: String,
      required: true
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "manufacturer",
      required: true
    },
    description: String,
    video: {
      link: String,
      web: Boolean
    },
    images: [],
    productRef: [],
    sewingType: "",
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true
    },
    mainFeatures: String,
    specifications: {}
  },
  {
    collection: "machine",
    timestamps: true
  }
);
module.exports = mongoose.model("machine", Machine);
