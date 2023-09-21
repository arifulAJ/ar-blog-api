const findAllArticles = require("./controllers/find");
const createArticle = require("./controllers/crate");

// module.exports = { findAllArticles, createArticle }= articles;

const artilceControler = () => {
  return {
    findAllArticles,
    createArticle,
  };
};
module.exports = artilceControler;
