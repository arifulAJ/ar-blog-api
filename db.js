const fs = require("fs/promises");
const path = require("path");

class databaseConnection {
  constructor(dbUrl) {
    this.db = null;
    this.dbUrl = dbUrl;
  }
  async read() {
    const dbSting = await fs.readFile(this.dbUrl, { encoding: "utf-8" });
    this.db = JSON.parse(dbSting);
  }
  async write() {
    if (this.db) {
      await fs.writeFile(this.dbUrl, JSON.stringify(this.db));
    }
  }
  async getDb() {
    if (this.db) {
      return this.db;
    }
    await this.read();
    return this.db;
  }
}

const connection = new databaseConnection(path.resolve(process.env.DB_URL));

module.exports = connection;
