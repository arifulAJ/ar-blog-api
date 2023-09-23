const mongoose = require("mongoose");
const Article = require("../../../../model/Article");

/**
 * update your article by patch method
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.updateArticle = async (req, res, next) => {
  console.log(req.body);
  if (!req.user) {
    return res.status(404).json({ message: "you need to signin" });
  }

  try {
    const authenticatedUserId = req.user.id;
    const articleId = req.params.id;
    const updateData = req.body;
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      res
        .status(404)
        .json({ message: "article id is not valid please provide right id" });
    }
    // Find the article by ID
    const foundArticle = await Article.findById(articleId);

    // Check if the authenticated user is the author of the article
    if (foundArticle.author.id.toString() !== authenticatedUserId) {
      return res.status(403).json({
        message: "Unauthorized: You are not the author of this article",
      });
    }
    const updateArticle = await Article.findByIdAndUpdate(
      articleId,
      updateData
    );
    const respons = {
      code: 200,
      message: "updated successfully",
      updateArticle,
    };
    res.status(200).json(updateArticle);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
