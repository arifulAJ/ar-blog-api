const { body } = require("express-validator");
module.exports = [
  body("title")
    .isLength({ min: 10, max: 75 })
    .withMessage("user must be provide more then 10 char")
    .trim(),
  body("body")
    .isLength({ min: 20 })
    .withMessage("body should have more then 20 char")
    .trim(),
  body("tags")
    .isLength({ min: 2, max: 20 })
    .withMessage("tage should have more then 2 and less then 20 char")
    .trim(),
  body("cover")
    .optional() // Make the "cover" field optional
    .isURL() // Allow any format if provided
    .withMessage("Cover must be a valid URL"),
];
