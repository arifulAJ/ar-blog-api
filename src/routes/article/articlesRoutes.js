const { findAllArticles } = require("../../api/v1/article/controllers/find");
const createArticleValidator = require("../../../validator/article/createArticleValidator");
const { createArticle } = require("../../api/v1/article/controllers/crate");
const { isUnAuthenteacetUser } = require("../../middleware/authMieeleware");

const router = require("express").Router();
// const { findAllArticles, createArticle } = artilceControler;

router.get("/articles", findAllArticles);
router.post(
  "/articles",

  createArticleValidator,
  createArticle
);

module.exports = router;
