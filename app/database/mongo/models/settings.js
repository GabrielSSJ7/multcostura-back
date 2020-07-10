import mongoose from "mongoose";
var Reseller = new mongoose.Schema(
  {
    desativatedFilters: [{
      name: { 
        type: String,
      },
      status: {
        type: Boolean,
        default: true
      }
    }]
  },
  {
    collection: "settings",
    timestamps: true
  }
);
module.exports = mongoose.model("settings", Reseller);
