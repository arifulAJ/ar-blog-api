const mongoose = require("mongoose");
const Article = require("../../../../model/Article");

/**
 * create or update article using put method
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.createdOrupdatedArticle = async (req, res, next) => {
  if (!req.user) {
    return res.status(404).json({ message: "you should have requierd signin" });
  }

  try {
    const authenticatedUserId = req.user.id;
    const articleId = req.params.id;
    const updateData = req.body;

    // Check if the provided ID is a valid ObjectId

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      // If the ID is not a valid ObjectId, create a new article
      const newArticle = new Article({
        ...updateData,
        author: { id: authenticatedUserId, name: req.user.name }, // Set the author
      });
      await newArticle.save();
      const respons = {
        message: "created successfully",
        newArticle,
      };

      return res.status(201).json(respons); // 201 Created status for a new article
    }

    // Find the article by ID
    const foundArticle = await Article.findById(articleId);

    if (!foundArticle) {
      // If the article with the provided ID doesn't exist, create a new one
      const newArticle = new Article({
        ...updateData,
        author: { id: authenticatedUserId, name: req.user.name }, // Set the author
      });
      await newArticle.save();
      const respons = {
        message: "created successfully",
        newArticle,
      };
      return res.status(201).json(respons); // 201 Created status for a new article
    }

    // Get the authenticated user's ID from your authentication system
    // Replace with your actual method to get user ID.

    // Check if the authenticated user is the author of the article
    if (foundArticle.author.id.toString() !== authenticatedUserId) {
      return res.status(403).json({
        message: "Unauthorized: You are not the author of this article",
      });
    }

    // Try to find the article by ID and update it
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      updateData,
      { new: true, upsert: true } // Use `upsert` to create if not found
    );
    const response = {
      code: updatedArticle.isModified ? 200 : 201,
      message: "updated successfuly",
      updatedArticle,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
