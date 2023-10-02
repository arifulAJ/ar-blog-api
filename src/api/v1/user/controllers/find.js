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
    if (req?.user?.role !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to access this resource.",
      });
    }
    const {
      page = 1,
      limit = 5,
      sort_by = "updetedAt",
      sort_type = "dec",
      search,
    } = req.query;
    // Calculate the skip value based on the page and limit
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};

    // Search query
    if (search) {
      // Case-insensitive search in the title field
      query.name = { $regex: new RegExp(search, "i") };
      query.email = { $regex: new RegExp(search, "i") };
    }
    // Sort options
    const sortOptions = {};
    sortOptions[sort_by] = sort_type === "dec" ? -1 : 1;

    // If the user is an admin, retrieve all users
    const retrieveAllUsers = await User.find(query)
      .skip(skip)
      .sort(sortOptions)
      .limit(parseInt(limit));
    const respons = {
      code: 200,
      retrieveAllUsers,
      pagination: {
        page,
        limit,
        nextPage: page + 1,
        prevPage: 1 < page ? page - 1 : undefined,

        totalpage: Math.ceil((await User.find({})).length / limit),
        toatalItems: (await User.find({})).length,
      },
    };
    res.status(200).json(respons);
  } catch (e) {
    console.log(e);
    next(e);
  }
};
