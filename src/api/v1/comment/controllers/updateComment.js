const mongoose = require("mongoose");
const Comment = require("../../../../model/Comment");

/**
 * update your comments and validet all the topic
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.updateComments = async (req, res, next) => {
  if (!req.user) {
    return res.status(404).json({ message: "You should be signed in." });
  }
  const commentId = req.params.id;
  const updateComment = req.body;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ message: " your comment id is not valid" });
  }
  try {
    const commentUpdate = await Comment.findByIdAndUpdate(
      commentId,
      updateComment
    );
    const respons = {
      code: 200,
      message: "updated successfully",
      commentUpdate,
    };
    res
      .status(204)
      .json({ message: `comment deleted successfully ${respons}` });
    next();
  } catch (e) {
    console.log(e);
    next(e);
  }
};
