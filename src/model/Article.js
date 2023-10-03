const { Schema, model } = require("mongoose");

const articleSchema = new Schema(
  {
    title: {
      type: String,
      minLength: 10,
      maxLength: 75,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Simple URL format validation using a regular expression
          const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
          return urlRegex.test(v);
        },
        message: 'Invalid URL format for the cover image.',
      },
    },
    // author: { type: Schema.ObjectId, ref: "User", name: String },
    author: {
      id: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to User model for ID
      name: String, // Include the author's name as a String
    },
    status: {
      type: String,
      enum: ["draft", "published", "unpublished"],
      default: "draft",
    },
  },
  { timestamps: true, id: true }
);

const Article = model("Article", articleSchema);

module.exports = Article;
