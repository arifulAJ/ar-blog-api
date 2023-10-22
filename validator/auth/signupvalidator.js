const User = require("../../src/model/User");
const { body } = require("express-validator");
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
  body("email")
    .isEmail()
    .withMessage("pleace provide a valid email")
    .custom(async (email) => {
      let user = await User.findOne({ email });
      if (user) {
        return Promise.reject("email already used");
      }
    })
    .normalizeEmail(),
  body("password")
    .isLength({ min: 5 })
    .withMessage("your password must have more then five char"),

  // body("avater").isURL().withMessage("Please provide a valid URL for the ava"),
];
