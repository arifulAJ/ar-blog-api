const Comment = require("../../../../model/Comment");

exports.findComments = async (req, res, next) => {
  if (!req.user) {
    return res.status(404).json({ message: "You should be signed in." });
  }

  try {
    const {
      page = 1,
      limit = 5,
      sort_by = "updetedAt",
      sort_type = "dec",
    } = req.query;
    // Calculate the skip value based on the page and limit
    const skip = (parseInt(page) - 1) * parseInt(limit);
    // Sort options
    const sortOptions = {};
    sortOptions[sort_by] = sort_type === "dec" ? -1 : 1;

    const allComment = await Comment.find({})
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortOptions);
    const respons = {
      code: 200,
      allComment,
      pagination: {
        page,
        limit,
        nextPage: page + 1,
        prevPage: 1 < page ? page - 1 : undefined,

        totalpage: Math.ceil((await Comment.find({})).length / limit),
        toatalItems: (await Comment.find({})).length,
      },
    };
    res.status(200).json(respons);
  } catch (e) {
    console.log(e);
    next(e);
  }
};
