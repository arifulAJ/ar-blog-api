const mongoose = require("mongoose");
const Article = require("../../../../model/Article");

/**
 * Find a single article by specific ID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.findOneArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.id; // Assuming the article ID is passed in the URL as a parameter
    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ message: "Invalid article ID" });
    }
    const query = Article.findById(articleId);

    // Check if the "expand" query parameter exists and includes specific options
    if (req.query.expand) {
      const expandOptions = req.query.expand.split(",");

      if (expandOptions.includes("author")) {
        query.populate("author", "id name");
      }

      if (expandOptions.includes("comment")) {
        query.populate("comments");
      }

      if (expandOptions.includes("like")) {
        query.populate("likes");
      }
    }

    const foundArticle = await query.exec();

    if (!foundArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    // If the article is found, return it as a JSON response
    res.status(200).json(foundArticle);
  } catch (error) {
    // Handle any errors that occur during the database query
    console.log(error.message);
    next(error);
  }
};
