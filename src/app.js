require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");
const OpenApiValidator = require("express-openapi-validator");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 8080;

const userrouterAuth = require("./routes/auth/index");
// router of articles
const articleRouter = require("./routes/article/articlesRoutes");
//router of comments
const commentRoute = require("./routes/comment/commentRouter");
// user router
const userRoutesPath = require("./routes/user/userRoute");
// middleware
const {
  bindUserWithRequest,

  isAuthenticatedUser,
} = require("./middleware/authMieeleware");
const setLocals = require("./middleware/setLocals");

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
// https://aj-blog-web-app.vercel.app
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "PUT", "PATCH", "UPDATE", "POST"],
  // ... other CORS options
};

app.use(cors(corsOptions));
// app.use(
//   cors({
//     // origin: "http://localhost:3000",
//     origin: process.env.DOMAIN,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true, // Allow credentials (cookies)
//   })
// );
const middleware = [
  express.json(),
  OpenApiValidator.middleware({
    apiSpec: "./swagger.yaml",
  }),
  // Allow requests from http://localhost:3000 (your Next.js app)

  customeMiddleware,
  cookieParser(),
  // bindUserWithRequest(),
  // isAuthenticatedUser,
];
// app.use(bodyParser.json());
app.use(middleware);
// Add this middleware to handle OPTIONS requests

/**
 * for the application of version 1.0.0
 * article
 * comment
 * user
 * every thing are mange from here
 */
//auth
app.use("/api/v1/auth", userrouterAuth);
// articles all kind of route handel this middelware
app.use("/api/v1", articleRouter);
// commnet all kind of route handle hare
app.use("/api/v1", commentRoute);
// users all route handel here
app.use("/api/v1", userRoutesPath);

// Add the OPTIONS request middleware to handle all routes that need it

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
