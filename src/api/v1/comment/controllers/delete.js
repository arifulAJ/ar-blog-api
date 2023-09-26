const mongoose = require("mongoose");
const Comment = require("../../../../model/Comment");

exports.deleteComment = async (req, res, next) => {
  if (!req.user) {
    res.status(404).json({ message: "you need to signin first" });
  }
  try {
    const commentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "you hvae provided unvalid id " });
    }
    const findComment = await Comment.findById(commentId);
    if (!findComment) {
      return res.status(404).json({ message: "comment not found " });
    }
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "deleted successfuly " });
  } catch (e) {
    console.log(e);
    next(e);
  }
};
