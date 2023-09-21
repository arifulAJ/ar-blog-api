const Article = require("../../../../model/Article");
/**
 * Retrive the articels with quary params
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

exports.findAllArticles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 5,
      sort_type = "dec", // Default sort type
      sort_by = "updatedAt",
      search = "",
    } = req.query;

    // Construct the query based on the query parameters
    const query = {};

    // Search query
    if (search) {
      // Case-insensitive search in the title field
      query.title = { $regex: new RegExp(search, "i") };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sort_by] = sort_type === "dec" ? -1 : 1;

    // Calculate the skip value based on the page and limit
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Find articles based on the query and options
    const articles = await Article.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Respond with the articles

    const respons = {
      code: 200,
      articles,
      pagination: {
        page,
        limit,
        nextPage: page + 1,
        prevPage: 1 < page ? page - 1 : undefined,

        totalpage: Math.ceil((await Article.find({})).length / limit),
        toatalItems: (await Article.find({})).length,
      },
      links: {
        self: `${req.url}`,
        next: `${"/api/v1/articles"}?page=${
          page + 1
        }&limit=${limit}&sort_type=${sort_type}&sort_by=${sort_by}&search=${search}`,
        prev:
          1 < page
            ? `${"/api/v1/articles"}?page=${
                page - 1
              }&limit=${limit}&sort_type=${sort_type}&sort_by=${sort_by}&search=${search}`
            : undefined,
      },
    };

    res.status(200).json(respons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
