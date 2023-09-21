const { Schema, model } = require("mongoose");

const likeSchema = new Schema(
  {
    imogi: String,
    author: { type: Schema.ObjectId, ref: "User" },
    article: { type: Schema.ObjectId, ref: "Article" },
    article: { type: Schema.ObjectId, ref: "Comment" },
  },
  { timestamps: true, id: true }
);

const Like = model("Like", likeSchema);

module.exports = Like;
