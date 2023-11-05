// const Comment = require("../../../../model/Comment");

// exports.findComments = async (req, res, next) => {
//   if (!req.user) {
//     return res.status(404).json({ message: "You should be signed in." });
//   }
//   console.log(req.params.id);
//   try {
//     const {
//       page = 1,
//       limit = 5,
//       sort_by = "updetedAt",
//       sort_type = "dec",
//     } = req.query;

//     // Calculate the skip value based on the page and limit
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     // Sort options
//     const sortOptions = {};
//     sortOptions[sort_by] = sort_type === "dec" ? -1 : 1;

//     const allComment = await Comment.findById("65439bd19b0b6e1f71a0b19d")
//       .skip(skip)
//       .limit(parseInt(limit))
//       .sort(sortOptions);
//     const respons = {
//       code: 200,
//       allComment,
//       pagination: {
//         page,
//         limit,
//         nextPage: page + 1,
//         prevPage: 1 < page ? page - 1 : undefined,

//         totalpage: Math.ceil((await Comment.find({})).length / limit),
//         toatalItems: (await Comment.find({})).length,
//       },
//     };
//     res.status(200).json(respons);
//   } catch (e) {
//     console.log(e);
//     next(e);
//   }
// };
const Comment = require("../../../../model/Comment");

exports.findComments = async (req, res, next) => {
  // if (!req.user) {
  //   return res.status(404).json({ message: "You should be signed in." });
  // }
  // Extract the article ID from the path parameters
  const articleId = req.params.id;

  if (!articleId) {
    return res.status(400).json({ message: "Article ID is required." });
  }

  try {
    const {
      page = 1,
      limit,
      sort_by = "updatedAt", // Correct the typo in the sorting field name
      sort_type = "desc", // Correct the typo in the sorting type
    } = req.query;

    // Calculate the skip value based on the page and limit
    const skip = (parseInt(page) - 1) * parseInt(limit);
    // Sort options
    const sortOptions = {};
    sortOptions[sort_by] = sort_type === "desc" ? -1 : 1;

    // Use the articleId to filter comments for the specific article
    const allComment = await Comment.find({ articleId: articleId })
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

        totalpage: Math.ceil(
          (await Comment.countDocuments({ articleId: articleId })) / limit
        ),
        totalItems: await Comment.countDocuments({ articleId: articleId }),
      },
    };
    res.status(200).json(respons);
  } catch (e) {
    console.log(e);
    next(e);
  }
};
