const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_LOGIN_TOKEN; // Replace with your actual secret key
console.log(secretKey, "this is my secrete kehy");
const User = require("../model/User");

// Middleware to bind the user with the request if a valid JWT is provided
exports.bindUserWithRequest = () => {
  return async (req, res) => {
    const token = req.header("Authorization");
    console.log(token, "middelware of bindwithe user");

    if (!token) {
      return;
    }

    try {
      const decoded = jwt.verify(token, secretKey);

      let user = await User.findById(decoded.userId);
      req.user = user;

      n;
    } catch (e) {
      console.log(e);
    }
  };
};

// Middleware to check if the user is unauthenticated (not logged in)

// exports.isAuthenticatedUser = (req, res, next) => {
//   const token = req.header("Authorization"); // Assuming the token is in the Authorization header
//   // const token = req.header("Authorization").replace("Bearer ", "");
//   console.log(token, "this is my token for use auth");

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) {
//       if (err.name === "TokenExpiredError") {
//         return res.status(401).json({ message: "Token has expired" });
//       }
//       console.error("JWT verification failed:", err);
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     // The token is valid, add user information to the request
//     req.user = decoded;
//     next();
//   });
// };
exports.isAuthenticatedUser = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log(authHeader, "this header ");

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = tokenParts[1];

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      console.error("JWT verification failed:", err);
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};
