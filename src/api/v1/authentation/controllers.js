const bcrypt = require("bcryptjs");
const User = require("../../../model/User");
const { validationResult } = require("express-validator");
const errorFormate = require("../../../utils/validatorerrorFormator");

/**
 * signup get method controller for get the profile of signup user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.signupGetController = (req, res, next) => {
  res.send({ message: "signup get " });
};
/**
 * signup post method  controller for create new user in this app
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

exports.signupPostController = async (req, res, next) => {
  let errors = validationResult(req).formatWith(errorFormate);

  if (!errors.isEmpty()) {
    let data = errors.mapped();

    return res.status(409).json({
      code: 400,
      message: "bad request",
      data,
    });
  }
  const { name, email, password } = req.body;

  try {
    let hashPassword = await bcrypt.hash(password, 11);

    let user = new User({
      name,
      email,
      password: hashPassword,
    });
    let createUser = await user.save();
    // Storing user-related data in the session
    req.session.userId = createUser._id; // Store the user's unique identifier
    req.session.userName = user.name; // Store the user's name
    console.log(createUser);
    const respons = {
      code: 201,
      message: "signup successfully",
      data: { token: "sdkjflsdflksjfkljsdklf" },
      links: {
        self: req.url,
        signin: "/auth/signin",
      },
    };
    res.status(201).json(respons);
  } catch (e) {
    console.log(e);
    next(e);
  }

  // respons
};

/**
 * signin get method  controller for profile get
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.signinGetController = (req, res, next) => {
  res.send(req?.session?.user?.name);

  next();
};
/**
 * signin post method  controller for autheraziation delling
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.signinPostController = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormate);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.json({
        code: "401",
        error: "Unauthorized",
        message: "Invalid Credentials ",
      });
    }
    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({
        code: "401",
        error: "Unauthorized",
        message: "Invalid Credentials  ",
      });
    }
    console.log("successfully login");
    req.session.isLoggedIn = true;
    req.session.user = user;

    const respons = {
      code: 200,
      message: "signin successfully ",
      data: {
        access: "sdkjflsjflksjdfkljsdlkfjlsdkfj",
      },
      links: {
        self: req.url,
      },
    };
    res.status(200).json({
      message: respons,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};
/**
 * logout from the app
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.logoutPostController = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return next();
    }

    return res.send(
      res.locals.user
        ? `${res?.locals?.user?.name} you have loged out from  your account`
        : " you dont have any account"
    );
  });
};
