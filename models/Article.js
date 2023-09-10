const connection = require("../db");

class Articel {
  constructor() {
    this.articles = [];
  }
  async init() {
    const db = await connection.getDb();
    this.articles = db.articles;
  }
  async find() {
    return this.articles;
  }
  async findById(id) {
    return this.articles.find((article) => article.id === id);
  }
  async findByProps(prop) {
    return this.articles.find((article) => article.prop === prop);
  }
  async search(term) {
    return this.articles.filter((article) =>
      article.title.toLowerCase().includes(term)
    );
  }
  async sort(articles, sortType = "acc", sortBy = "updatedAt") {
    let result = [];
    if (sortType === "acc") {
      result = await this.#sortAcc(articles, sortBy);
    } else {
      result = await this.#sortDec(articles.sortBy);
    }

    return result;
  }
  pagination(articles, page, limit) {
    const skip = page * limit - limit;
    const totalitems = articles.length;
    const totalpage = Math.ceil(totalitems / limit);
    const result = articles.slice(skip, skip + limit);
    return {
      totalitems,
      totalpage,
      result,
      hasNext: page < totalpage,
      hasPrev: page > 1,
    };
  }
  async #sortAcc(articles, sortBy) {
    return articles.sort((a, b) =>
      a[sortBy].toString().localeCompare(b[sortBy].toString())
    );
  }
  async #sortDec(articles, sortBy) {
    return articles.sort((a, b) =>
      b[sortBy].toString().localeCompare(a[sortBy].toString())
    );
  }
}

module.exports = Articel;
