const fs = require("fs/promises");
const path = require("path");

class DatabaseConnection {
  constructor(dbUrl) {
    this.db = null;
    this.dbUrl = dbUrl;
  }
  async connect() {
    const dbSting = await fs.readFile(this.dbUrl, { encoding: "utf-8" });
    this.db = JSON.parse(dbSting);
  }
  async write() {
    if (this.db) {
      await fs.writeFile(this.dbUrl, JSON.stringify(this.db));
    }
  }
}
const databaseConnection = new DatabaseConnection(
  path.resolve(process.env.DB_URL)
);

module.exports = databaseConnection;
