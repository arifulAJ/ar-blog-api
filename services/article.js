const Article = require("../models/Article");
const databaseConnection = require("../db");
const findArticles = async ({ page, limit, sortType, sortBy, search }) => {
  const articleInstance = new Article(databaseConnection.db.articles);

  let articles;
  // search article by search tarm
  if (search) {
    articles = await articleInstance.search(search);
  } else {
    articles = await articleInstance.find();
  }

  //sorting
  // by the localCompayer it also shortable
  articles = [...articles];
  articles = await articleInstance.sort(articles, sortType, sortBy);

  // pagination
  const { totalitems, totalpage, result, hasNext, hasPrev } =
    await articleInstance.pagination(articles, page, limit);

  return {
    totalitems,
    totalpage,
    hasNext,
    hasPrev,
    articles: result,
  };
};

const transfromeArticles = ({ articles = [] }) => {
  return articles.map((article) => {
    const transfromed = { ...article };
    transfromed.author = {
      id: transfromed.authorId,
      //TODO: find the author name
    };
    transfromed.link = `/articles/${transfromed.id}`;
    delete transfromed.body;
    delete transfromed.authorId;

    return transfromed;
  });
};
const creatArticle = async ({ title, body, cover = "", status = "draft" }) => {
  const articleInstance = new Article(databaseConnection.db.articles);
  const article = await articleInstance.creat(
    { title, body, cover, status },
    databaseConnection
  );
  return article;
};
module.exports = { findArticles, transfromeArticles, creatArticle };
