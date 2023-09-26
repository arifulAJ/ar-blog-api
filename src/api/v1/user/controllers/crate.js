const User = require("../../../../model/User");
const { validationResult } = require("express-validator");
const errorFormate = require("../../../../utils/validatorerrorFormator");
const bcrypt = require("bcryptjs");

/**
 * create new user with minimum validation
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.createuserController = async (req, res, next) => {
  if (!req.user) {
    return res.status(404).json({ message: "You need to sign in" });
  }
  let errors = validationResult(req).formatWith(errorFormate);

  if (!errors.isEmpty()) {
    let data = errors.mapped();

    return res.status(409).json({
      code: 400,
      message: "bad request",
      data,
    });
  }
  try {
    const { name, email, password, avatar } = req.body;
    let hashPassword = await bcrypt.hash(password, 11);
    // Create a new user using the User model (assuming it's properly defined)
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      avatar,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (e) {
    console.log(e);
    next(e);
  }
};
