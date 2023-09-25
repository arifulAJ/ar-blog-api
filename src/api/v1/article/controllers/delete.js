const mongoose = require("mongoose");
const Article = require("../../../../model/Article");
/**
 * delete the article from the database
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

exports.deleteArticle = async (req, res, next) => {
  if (!req.user) {
    return res.status(404).json({ message: "you should have require signin" });
  }
  try {
    const articleId = req.params.id;
    const authenticatedUserId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ message: "invalid article ID " });
    }
    const foundArticle = await Article.findById(articleId);
    if (!foundArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    if (foundArticle.author.id.toString() !== authenticatedUserId) {
      return res.status(403).json({
        message: "Unauthorized: You are not the author of this article",
      });
    }
    await Article.findByIdAndDelete(articleId);
    res.status(204).json({ message: "deleted successfully" });
  } catch (e) {
    console.log(e);
    next(e);
  }
};
