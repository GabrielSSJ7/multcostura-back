import mongoose from "mongoose";
var Categories = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    appIcon: String,
    description: String,
		banner: {
			title: String,
			description: String,
			link: String,
			image: [{
				order: Number,
				url: String
			}],
			txtBtn: String,
			show: { 
				type: Boolean,
				default: true,
			}
		}
  },
  {
    collection: "categories",
    timestamps: true
  }
);
module.exports = mongoose.model("categories", Categories);
