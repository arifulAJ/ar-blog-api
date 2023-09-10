const Article = require("../models/Article");
const findArticles = async ({
  page = 1,
  limit = 5,
  sortType = "acc",
  sortBy = "updatedAt",
  search = "",
}) => {
  const articleInstance = new Article();
  await articleInstance.init();
  let articles;
  // search article by search tarm
  if (search) {
    articles = await articleInstance.search(search);
  } else {
    articles = await articleInstance.find();
  }
  //sorting
  // by the localCompayer it also shortable
  articles = await articleInstance.sort(articles, sortType, sortBy);

  // pagination
  const { totalitems, totalpage, result, hasNext, hasPrev } =
    await articleInstance.pagination(articles, page, limit);
  console.log(page, limit, sortBy, sortType, search);
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
module.exports = { findArticles, transfromeArticles };
