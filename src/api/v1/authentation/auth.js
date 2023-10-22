const jwt = require("jsonwebtoken");
exports.authUser = (req, res, next) => {
  const { token } = req.body;
  console.log(token);
  console.log("token");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_LOGIN_TOKEN);
      res.json({
        auth: true,
        data: decoded,
      });
    } catch (e) {
      res.json({
        auth: false,
        data: e.message,
      });
    }
  } else {
    res.json({
      auth: false,
      data: "no token found in request",
    });
  }
  next();
};
