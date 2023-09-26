const User = require("../../../../model/User");
/**
 * this rotue can retrive  only admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.findUsers = async (req, res, next) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to access this resource.",
      });
    }

    // If the user is an admin, retrieve all users
    const retrieveAllUsers = await User.find({});

    res.status(200).json(retrieveAllUsers);
  } catch (e) {
    console.log(e);
    next(e);
  }
};
