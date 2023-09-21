const Article = require("../../../../model/Article");
const { validationResult } = require("express-validator");
const errorFormate = require("../../../../utils/validatorerrorFormator");
/**
 * post maethod controller and validation of responses
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

exports.createArticle = async (req, res, next) => {
  let errors = validationResult(req).formatWith(errorFormate);

  if (!errors.isEmpty()) {
    let data = errors.mapped();

    return res.status(404).json({
      code: 400,
      message: "bad request",
      data,
    });
  }
  const { title, body, cover } = req.body;

  if (!req.user) {
    return res.status(404).json({ message: "you should have requierd signin" });
  }
  const { id, name } = req.user;

  try {
    let article = new Article({
      title,
      body,
      cover,
      author: { id, name },
    });
    let createNewArticle = await article.save();

    // responses ------
    const respons = {
      code: 201,
      message: "article create successfully",
      data: createNewArticle,
      links: {
        self: req.url,
        author: `${req.url}/1/author`,
        comments: `${req.url}/1/comments`,
      },
    };
    res.status(201).json((message = respons));

    next();
  } catch (e) {
    console.log(e);
    next();
  }
};
