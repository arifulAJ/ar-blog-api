const { body } = require("express-validator");
const User = require("../../src/model/User");

module.exports = [
  body("name")
    .isLength({ min: 2, max: 20 })
    .withMessage("User name must be 2 to 20 later")
    .custom(async (name) => {
      let user = await User.findOne({ name });
      if (user) {
        return Promise.reject("user name already used");
      }
    })
    .trim(),
  body("password")
    .isLength({ min: 5 })
    .withMessage("your password must have more then five char"),

  body("avatar")
    .isURL()
    .withMessage("Please provide a valid URL for the avatar"),
];
