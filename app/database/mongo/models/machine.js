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
    images: [],
    productRef: [],
    sewingType: "",
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true
    },
    video: String,
    files: {
      manual: String,
      folheto: String
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
