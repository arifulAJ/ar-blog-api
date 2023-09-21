const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    body: String,
    author: { type: Schema.ObjectId, ref: "User" },
    article: { type: Schema.ObjectId, ref: "Article" },
    status: {
      type: String,
      enum: ["private", "public"],
      default: "public",
    },
  },
  { timestamps: true, id: true }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
