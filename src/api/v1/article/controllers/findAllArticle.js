const Article = require("../../../../model/Article");

exports.findAllArticlesNoParams = async (req, res, next) => {
  try {
    const articles = await Article.find({});
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    next(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
