const { Schema, model } = require("mongoose");
/**
 * Comment Schema
 * @param {string} body - The body of the comment.
 * @param {mongoose.Types.ObjectId} author - The author of the comment (a reference to the User model).
 * @param {mongoose.Types.ObjectId} article - The article to which the comment belongs (a reference to the Article model).
 * @param {string} status - The status of the comment, which can be "private" or "public".
 * @param {Date} createdAt - The timestamp when the comment was created.
 * @param {Date} updatedAt - The timestamp when the comment was last updated.
 */

const commentSchema = new Schema(
  {
    body: String,
    authorId: { type: Schema.ObjectId, ref: "User" },
    articleId: { type: Schema.ObjectId, ref: "Article" },

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
