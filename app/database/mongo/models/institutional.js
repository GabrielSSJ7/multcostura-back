import mongoose from "mongoose";
var Institutional = new mongoose.Schema(
  {
    homeBanners: [
      {
        link: String,
        pos: Number,
        image: String
      }
    ],
    enterpriseBanner: String,
    contactBanner: String,
    newsBanner: String
  },
  {
    collection: "institutional",
    timestamps: true
  }
);
module.exports = mongoose.model("institutional", Institutional);
