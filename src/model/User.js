const { Schema, model } = require("mongoose");

const userSchmeas = new Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true, id: true }
);

const User = model("User", userSchmeas);

module.exports = User;
