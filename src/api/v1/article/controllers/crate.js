const Article = require("../../../../model/Article");
const { validationResult } = require("express-validator");
const errorFormate = require("../../../../utils/validatorerrorFormator");
/**
 * post maethod controller and validation of responses
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

// exports.createArticle = async (req, res, next) => {
//   let errors = validationResult(req).formatWith(errorFormate);

//   if (!errors.isEmpty()) {
//     let data = errors.mapped();

//     return res.status(404).json({
//       code: 400,
//       message: "bad request",
//       data,
//     });
//   }
//   const { title, body, cover, tags } = req.body;

//   if (!req.user) {
//     return res.status(404).json({ message: "you should have requierd signin" });
//   }
//   const { id, name } = req.user;
//   function capitalizeFirstLetter(word) {
//     // Check if the input is not an empty string
//     if (word.length === 0) {
//       return word; // Return the input unchanged
//     }

//     // Capitalize the first letter and concatenate it with the rest of the word
//     return word.charAt(0).toUpperCase() + word.slice(1);
//   }
// const tagUpper=capitalizeFirstLetter(tags)
// console.log(tagUpper)
//   try {
//     let article = new Article({
//       title,
//       body,
//       cover,
//       tags:tagUpper,
//       author: { id, name },
//     });

//     let createNewArticle = await article.save();

//     // responses ------
//     const respons = {
//       code: 201,
//       message: "article create successfully",
//       data: createNewArticle,
//       links: {
//         self: req.url,
//         author: `${req.url}/1/author`,
//         comments: `${req.url}/1/comments`,
//       },
//     };
//     res.status(201).json((message = respons));

//     next();
//   } catch (e) {
//     console.log(e);
//     next(e);
//   }
// };
// exports.createArticle = async (req, res, next) => {
//   try {
//     // Ensure the user is authenticated
//     if (!req.user) {
//       return res
//         .status(401)
//         .json({ message: "You must be authenticated to create an article" });
//     }

//     const errors = validationResult(req).formatWith(errorFormate);

//     if (!errors.isEmpty()) {
//       const data = errors.mapped();

//       return res.status(400).json({
//         code: 400,
//         message: "Bad request",
//         data,
//       });
//     }

//     const { title, body, cover, tags } = req.body;
//     const { id, name } = req.user;

//     function capitalizeFirstLetter(word) {
//       if (word.length === 0) {
//         return word;
//       }

//       return word.charAt(0).toUpperCase() + word.slice(1);
//     }

//     const tagUpper = capitalizeFirstLetter(tags);

//     const article = new Article({
//       title,
//       body,
//       cover,
//       tags: tagUpper,
//       author: { id, name },
//     });

//     const createNewArticle = await article.save();

//     const response = {
//       code: 201,
//       message: "Article created successfully",
//       data: createNewArticle,
//       links: {
//         self: req.url,
//         author: `${req.url}/1/author`,
//         comments: `${req.url}/1/comments`,
//       },
//     };

//     res.status(201).json(response);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };
exports.createArticle = async (req, res, next) => {
  try {
    // Check if the user is authenticated with a valid token
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "You must be authenticated to create an article" });
    }

    const errors = validationResult(req).formatWith(errorFormate);

    if (!errors.isEmpty()) {
      const data = errors.mapped();

      return res.status(400).json({
        code: 400,
        message: "Bad request",
        data,
      });
    }

    const { title, body, cover, tags } = req.body;
    const { userId: id, userName: name } = req.user;

    function capitalizeFirstLetter(word) {
      if (word.length === 0) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    }

    const tagUpper = capitalizeFirstLetter(tags);

    const article = new Article({
      title,
      body,
      cover,
      tags: tagUpper,
      author: { id, name },
    });

    const createNewArticle = await article.save();

    const response = {
      code: 201,
      message: "Article created successfully",
      data: createNewArticle,
      links: {
        self: req.url,
        author: `${req.url}/1/author`,
        comments: `${req.url}/1/comments`,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
