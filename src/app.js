require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");
const OpenApiValidator = require("express-openapi-validator");
const port = process.env.PORT || 4000;
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
// router of user
const userrouter = require("./routes/auth/index");
// router of articles
const articleRouter = require("./routes/article/articlesRoutes");
// middleware
const { bindUserWithrequest } = require("./middleware/authMieeleware");
const setLocals = require("./middleware/setLocals");

// users
const user = require("../src/model/User");

//express app

const app = express();
// app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// app.use(
//   OpenApiValidator.middleware({
//     apiSpec: "./swagger.yaml",
//   })
// );
const customeMiddleware = async (req, res, next) => {
  console.log("this is custome middleware", req.url);

  next();
};

//mongodb url
let connectionURL = process.env.DB_CONNECTION_URL;
connectionURL = connectionURL.replace("<username>", process.env.DB_USERNAME);
connectionURL = connectionURL.replace("<password>", process.env.DB_PASSWORD);
connectionURL = `${connectionURL}${process.env.DB_NAME}?${process.env.DB_URL_QUERY}`;

const store = new MongoDBStore({
  uri: connectionURL,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 2,
});
const middleware = [
  express.json(),
  OpenApiValidator.middleware({
    apiSpec: "./swagger.yaml",
  }),
  customeMiddleware,
  session({
    secret: process.env.SECRET_KEY || "SECRET_KEY",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
    },
    store: store,
  }),
  bindUserWithrequest(),

  setLocals(),
];
app.use(middleware);
//auth
app.use("/api/v1/auth", userrouter);
// articles all kind of route handel this middelware
app.use("/api/v1", articleRouter);

// health route
app.get("/health", (_req, res) => {
  res.send("now we can say this is working well if we get this path");
});
// root  of the app
app.get("/", (_req, res) => {
  res.send("you run your codes sucsessfully");
});

mongoose
  .connect(connectionURL, {})
  .then(() => {
    console.log("Database connected");
    app.listen(port, async () => {
      console.log("i am listening on port ", port);
    });
  })
  .catch((e) => {
    console.log("Database connection faild");
    console.log("message", e.message);
  });
