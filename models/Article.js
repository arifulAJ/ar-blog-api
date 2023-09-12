class Articel {
  constructor(articles) {
    this.articles = articles;
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
  async sort(articles, sortType = "dec", sortBy = "updatedAt") {
    let result = [];
    if (sortType === "acc") {
      result = await this.sortAcc(articles, sortBy);
    } else {
      result = await this.sortDec(articles, sortBy);
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
  async creat(article, databaseConnection) {
    article.id = this.articles[this.articles.length - 1].id + 1;
    article.createdAt = new Date().toISOString();
    article.updatedAt = new Date().toISOString();
    this.articles.push(article);
    databaseConnection.db.articles = this.articles;
    await databaseConnection.write();
    return article;
  }
  async sortAcc(articles, sortBy) {
    return articles.sort((a, b) =>
      a[sortBy].toString().localeCompare(b[sortBy].toString())
    );
  }
  async sortDec(articles, sortBy) {
    return articles.sort((a, b) =>
      b[sortBy].toString().localeCompare(a[sortBy].toString())
    );
  }
}

module.exports = Articel;
