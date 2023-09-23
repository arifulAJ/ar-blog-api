const { findAllArticles } = require("../../api/v1/article/controllers/find");
const createArticleValidator = require("../../../validator/article/createArticleValidator");
const { createArticle } = require("../../api/v1/article/controllers/crate");
const {
  findOneArticleById,
} = require("../../api/v1/article/controllers/findSingle");
const {
  createdOrupdatedArticle,
} = require("../../api/v1/article/controllers/createOrUpdated");

/**
 * this is article route handellare all the articles related route is here
 * create article ,
 * getAll articles ,
 * get article by id ,
 * create or update article,
 * update article and
 * delete article,
 */
const router = require("express").Router();

router.get("/articles", findAllArticles);
router.post(
  "/articles",

  createArticleValidator,
  createArticle
);

router.get("/articles/:id", findOneArticleById);

router.put("/articles/:id", createdOrupdatedArticle);

module.exports = router;
