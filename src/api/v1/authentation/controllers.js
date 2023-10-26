const bcrypt = require("bcryptjs");
const User = require("../../../model/User");
const { validationResult } = require("express-validator");
const errorFormate = require("../../../utils/validatorerrorFormator");
const jwt = require("jsonwebtoken");
/**
 * signup get method controller for get the profile of signup user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.signupGetController = (req, res) => {
  res.send({ message: "signup get " });
};
/**
 * signup post method  controller for create new user in this app
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

exports.signupPostController = async (req, res) => {
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

    // Set the 'Access-Control-Allow-Credentials' header to 'true' in the response
    // res.header("Access-Control-Allow-Credentials", "true");
    let createUser = await user.save();
    // Storing user-related data in the session
    const token = jwt.sign(
      { userId: createUser._id, userName: createUser.name },
      process.env.JWT_LOGIN_TOKEN,
      { expiresIn: "1d" }
    );
    console.log(token, "it is singin post ");
    const respons = {
      code: 201,
      message: "signup successfully",
      data: { token },
      links: {
        self: req.url,
        signin: "/auth/signin",
      },
    };

    res.cookie("token", token, {
      domain: "ar-blog-api.onrender.com",
      path: "/api/v1",
      secure: true, // Use true in a production environment when you have HTTPS
      httpOnly: true,
      sameSite: "none", // Ensure it's "none" for cross-origin requests
    });
    res.status(201).json(respons);
  } catch (e) {
    console.log(e.message);
  }

  // respons
};

/**
 * signin get method  controller for profile get
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.signinGetController = async (req, res) => {
  const token = req?.cookies?.token;
  console.log(token, "this is the token controller");
  if (!token) {
    return;
  }
  const data = jwt.verify(token, process.env.JWT_LOGIN_TOKEN);

  const user = await User.findById(data.userId).select("-password");

  res.json(user);
};
exports.getTokenController = async (req, res) => {
  const token = req?.cookies?.token;
  console.log(req.cookies, "get token");
  if (!token) {
    return res.status(404).json({ message: "Token not found" });
  }

  res.json({ token });
};
/**
 * signin post method  controller for autheraziation delling
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.signinPostController = async (req, res) => {
  const errors = validationResult(req).formatWith(errorFormate);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      { userId: user._id, userName: user.name },
      process.env.JWT_LOGIN_TOKEN,
      {
        expiresIn: "1d",
      }
    );
    console.log(token, "this from sigin in get token");
    const respons = {
      code: 200,
      message: "singin successfully",
      data: { token },
      links: {
        self: req.url,
        signin: "/auth/signin",
      },
    };
    res.cookie("token", token, {
      domain: "ar-blog-api.onrender.com",
      path: "/api/v1",
      secure: true, // Use true in a production environment when you have HTTPS
      httpOnly: true,
      sameSite: "none", // Ensure it's "none" for cross-origin requests
    });

    res.status(200).json(respons);

    // res.json({ token });
    // Call getTokenController to retrieve and send the token
  } catch (e) {
    console.log(e.message);
  }
};

/**
 * logout from the app
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

exports.logoutController = (req, res) => {
  try {
    if (req.cookies.token) {
      // Clear the token cookie if it exists
      res.clearCookie("token", {
        domain: "ar-blog-api.onrender.com",
        path: "/api/v1",
        secure: true, // Use true in a production environment when you have HTTPS
        httpOnly: true,
        sameSite: "none",
      });
    } else {
      return res.redirect("/login");
    }

    // Send the response for a successful logout
    return res.json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in logoutController:", error);

    // Provide an informative error message in the response
    return res.status(500).json({ error: "An error occurred during logout" });
  }
};
