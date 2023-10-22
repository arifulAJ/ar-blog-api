
const Article = require("../../../../model/Article");

/**
 * Retrieve the articles with query params
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
      tags = "",
    } = req.query;

    // Construct the query based on the query parameters
    const query = {};

    // Search query
    if (search) {
      query.title = { $regex: new RegExp(search, "i") };
      // query.tags = { $regex: new RegExp(search, "i") };
    }

    // Tags query
    if (tags) {
      query.tags = { $regex: new RegExp(tags, "i") };
    }

    // Sort options
    const sortOptions = { [sort_by]: sort_type === "dec" ? -1 : 1 };

    // Calculate the skip value based on the page and limit
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Find articles based on the query and options
    const articles = await Article.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Count total articles (for pagination)
    const totalItems = await Article.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    // Prepare pagination data
    const pagination = {
      page,
      limit,
      nextPage: page < totalPages ? page + 1 : undefined,
      prevPage: page > 1 ? page - 1 : undefined,
      totalPages,
      totalItems,
    };

    // Prepare links
    const links = {
      self: req.originalUrl,
    };
    if (pagination.nextPage !== undefined) {
      links.next = `${req.baseUrl}?page=${pagination.nextPage}&limit=${limit}&sort_type=${sort_type}&sort_by=${sort_by}&search=${search}&tags=${tags}`;
    }
    if (pagination.prevPage !== undefined) {
      links.prev = `${req.baseUrl}?page=${pagination.prevPage}&limit=${limit}&sort_type=${sort_type}&sort_by=${sort_by}&search=${search}&tags=${tags}`;
    }

    // Respond with the articles
    const response = {
      code: 200,
      articles,
      pagination,
      links,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
