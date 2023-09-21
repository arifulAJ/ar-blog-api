// const { body } = require("express-validator");
// module.exports = [
//   body("email").not().isEmpty().withMessage("Email cann't be empty"),
//   body("password").not().isEmpty().withMessage("password cann't be empty"),
// ];
const { body } = require("express-validator");

module.exports = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email can't be empty")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("password").not().isEmpty().withMessage("Password can't be empty"),
];
