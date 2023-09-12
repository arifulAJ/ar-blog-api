require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");
const OpenApiValidator = require("express-openapi-validator");
const port = process.env.PORT || 4000;

const databaseConnection = require("./db");
const articleServices = require("./services/article");
const creatArticle = require("./services/article");

//express app

const app = express();
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(
  OpenApiValidator.middleware({
    apiSpec: "./swagger.yaml",
  })
);
// health route
app.get("/health", (_req, res) => {
  res.send("now we can say this is working well if we get this path");
});

// get all articles

app.get("/api/v1/articles", async (req, res) => {
  //query params
  const page = +req.query.page;
  const limit = +req.query.limit;
  const sortType = req.query.sort_type || "dec";
  const sortBy = req.query.sort_by || "updatedAt";
  const search = req.query.search || "";
  // all article services fetchi

  let { totalitems, totalpage, hasNext, hasPrev, articles } =
    await articleServices.findArticles({
      sortBy,
      sortType,
      search,
      page,
      limit,
    });

  // search article by search tarm
  // responses articles
  const respons = {
    data: articleServices.transfromeArticles({ articles }),

    pagination: {
      page,
      limit,

      totalpage,
      totalitems,
    },
    links: {
      self: req.url,
    },
  };

  if (hasPrev) {
    respons.pagination.prev = page - 1;
    respons.links.prev = `${req.url}?page=${page - 1}&limit=${limit}`;
  }
  if (hasNext) {
    respons.pagination.next = page + 1;
    respons.links.next = `${req.url}?page=${page + 1}&limit=${limit}`;
  }

  res.status(200).json({ respons });
});
app.post("/api/v1/articles", async (req, res) => {
  // 1 destructer the request body
  const { title, body, cover, status } = req.body;

  // 2 invoce the the busniess logic and process result
  const article = await articleServices.creatArticle({
    title,
    body,
    cover,
    status,
  });

  // 3 response genareated
  const respons = {
    code: 201,
    message: "article create successfully",
    data: article,
    links: {
      self: `${req.url}/articles/id`,
      author: `${req.url}/articles/id/author`,
      comment: `${req.url}/articles/id/comments`,
    },
  };

  res.status(201).json(respons);
});
app.get("/api/v1/articles/:id", (req, res) => {
  res.status(200).json({ path: `/articles/${req.params.id}`, method: "get" });
  console.log(req.query);
});
app.put("/api/v1/articles/:id", (req, res) => {
  res.status(200).json({ path: `/articles/${req.params.id}`, method: "put" });
  console.log(req.query, req.body);
});
app.patch("/api/v1/articles/:id", (req, res) => {
  res.status(200).json({ path: `/articles/${req.params.id}`, method: "patch" });
  console.log(req.query, req.body);
});
app.delete("/api/v1/articles/:id", (req, res) => {
  res
    .status(200)
    .json({ path: `/articles/${req.params.id}`, method: "delete" });
  console.log(req.query, req.body);
});

// error handeling for swagger
app.use((err, _req, res, _next) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

(async () => {
  await databaseConnection.connect();
  app.listen(port, () => {
    console.log(`the server is lisent on ${port}`);
  });
})();
