import mongoose from "mongoose";
var Reseller = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: String,
    maps: {
      lat: Number,
      lng: Number
    }
  },
  {
    collection: "reseller",
    timestamps: true
  }
);
module.exports = mongoose.model("reseller", Reseller);
