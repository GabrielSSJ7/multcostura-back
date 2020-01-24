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
    address: {
      publicPlace: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      number: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true }
    },
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
