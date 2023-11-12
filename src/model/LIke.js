const { Schema, model } = require("mongoose");

const likeSchema = new Schema(
  {
    imogi: String,
    authorId: { type: Schema.ObjectId, ref: "User" },
    articleId: { type: Schema.ObjectId, ref: "Article" },
  },
  { timestamps: true, id: true }
);

const Like = model("Like", likeSchema);

module.exports = Like;
