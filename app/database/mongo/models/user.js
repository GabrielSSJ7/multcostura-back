import mongoose from "mongoose";
var User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    cpf: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    collection: "user",
    timestamps: true
  }
);
module.exports = mongoose.model("user", User);
