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
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false, // Set to true for HTTPS
    //   domain: ".localhost",
    //   // domain:
    //   //   "aj-blog-web-rlzg47x1q-ariful-islams-projects-1e7ef33d.vercel.app",
    // });
    res.cookie("token", token, {
      domain: "localhost, ar-blog-api.onrender.com",
      path: "/api/v1",
      secure: false, // For development; set to true in production
      httpOnly: true,
      sameSite: "Lax", // Or 'Strict', as appropriate
    });
    res.status(201).json(respons);
  } catch (e) {
    console.log(e.message);
  }

  // respons
};

// exports.signupPostController = async (req, res) => {
//   const errors = validationResult(req).formatWith(errorFormate);

//   if (!errors.isEmpty()) {
//     const data = errors.mapped();

//     return res.status(409).json({
//       code: 400,
//       message: "bad request",
//       data,
//     });
//   }

//   const { name, email, password } = req.body;

//   try {
//     let hashPassword = await bcrypt.hash(password, 11);

//     let user = new User({
//       name,
//       email,
//       password: hashPassword,
//     });

//     let createUser = await user.save();

//     // Generate a JWT token in "Bearer" format
//     const token = jwt.sign(
//       { userId: createUser._id, userName: createUser.name },
//       process.env.JWT_LOGIN_TOKEN,
//       { expiresIn: "1d" }
//     );

//     // Create the response object
//     const response = {
//       code: 201,
//       message: "signup successfully",
//       data: { token }, // Format the token as "Bearer {token}"
//       links: {
//         self: req.url,
//         signin: "/auth/signin",
//       },
//     };

//     // Set the HTTP-only cookie for the token
//     res.cookie("token", token, {
//       httpOnly: true,
//     });

//     // Send the response with the "Bearer" token
//     res.status(201).json(response);
//   } catch (e) {
//     console.error(e.message);
//     // Handle any errors that occur during token generation or user creation
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

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
      httpOnly: true,
      secure: false, // Set to true for HTTPS
      // domain: "aj-blog-web-app.vercel.app",
    });

    res.status(200).json(respons);

    // res.json({ token });
    // Call getTokenController to retrieve and send the token
  } catch (e) {
    console.log(e.message);
  }
};
// exports.signinPostController = async (req, res) => {
//   const errors = validationResult(req).formatWith(errorFormate);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({ message: "Authentication failed" });
//     }

//     // Verify the password
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).json({ message: "Authentication failed" });
//     }

//     // Generate a JWT token for the user
//     const token = jwt.sign(
//       { userId: user._id, userName: user.name },
//       process.env.JWT_LOGIN_TOKEN,
//       {
//         expiresIn: "1d",
//       }
//     );

//     // Include the "Bearer" prefix in the token
//     const tokenWithBearer = `Bearer ${token}`;

//     const respons = {
//       code: 200,
//       message: "singin successfully",
//       data: { token: tokenWithBearer }, // Include the token with the "Bearer" prefix
//       links: {
//         self: req.url,
//         signin: "/auth/signin",
//       },
//     };

//     res.cookie("token", tokenWithBearer, {
//       httpOnly: true,
//     });

//     res.status(200).json(respons);
//   } catch (e) {
//     console.log(e.message);
//   }
// };

/**
 * logout from the app
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
// exports.logoutController = (req, res) => {
//   try {
//     // Set the cookie before sending the response
//     res.cookie("token", "", {
//       httpOnly: true,
//       maxAge: 1,
//     });

//     // Send the response
//     return res.json({
//       message: "logout successfully",
//       success: true,
//     });
//   } catch (error) {
//     return res.status(500).json({ errors: error.message }); // Use res.status(500) to set the status code
//   }
//   // res.cookie("token", "", { maxAge: 1 });
//   // res.clearCookie("token");

//   // res.status(200).json({ message: "Logout successful" });
// };
exports.logoutController = (req, res) => {
  try {
    if (req.cookies.token) {
      // Clear the token cookie if it exists
      res.clearCookie("token", { httpOnly: true });
    } else {
      return;
    }

    // Send the response
    return res.json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error.message }); // Use res.status(500) to set the status code
  }
};
