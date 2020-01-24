import mongoose from "mongoose";
var Manufacturer = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    logo: String,
    appIcon: String,
    description: String
  },
  {
    collection: "manufacturer",
    timestamps: true
  }
);
module.exports = mongoose.model("manufacturer", Manufacturer);
