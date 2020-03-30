import mongoose from "mongoose";
var User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: false
    },
    usernick: {
      type: String,
      required: false
    },
    cpf: {
      type: String,
      required: false
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
