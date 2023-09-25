const mongoose = require("mongoose");
const Article = require("../../../../model/Article");
const Comment = require("../../../../model/Comment");

/**
 * Create a new comment for a specific article
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.createComments = async (req, res, next) => {
  if (!req.user) {
    return res.status(404).json({ message: "You should be signed in." });
  }

  const { body, status, articleId } = req.body;
  const authorId = req.user.id;

  // Check if articleId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    return res.status(400).json({
      message: "Your article id is not valid or you did not provied  .",
    });
  }

  // Find the article to which the comment will be associated
  const articleComment = await Article.findById(articleId);

  if (!articleComment) {
    return res.status(404).json({
      message: `Article not found to comment on.`,
    });
  }

  try {
    // Create and save the new comment
    const newComment = await Comment.create({
      body,
      status,
      articleId, // Associate the comment with the specified article
      authorId,
    });

    const response = {
      code: 201,
      message: "Created successfully",
      newComment,
    };

    res.status(201).json(response); // Respond with the created comment
  } catch (e) {
    console.error(e);
    next(e);
  }
};
