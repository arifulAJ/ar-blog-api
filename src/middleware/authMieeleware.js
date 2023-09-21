const User = require("../model/User");

exports.bindUserWithrequest = () => {
  return async (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return next();
    }
    try {
      let user = await User.findById(req?.session?.user?._id);
      req.user = user;

      next();
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
};
exports.isUnAuthenteacetUser = () => {
  return (req, res, next) => {
    console.log(req.body);
    if (req.session.isLoggedIn) {
      // res.send("sdfjsdjflksdjfklsdjflk");
    }
    next();
  };
};
