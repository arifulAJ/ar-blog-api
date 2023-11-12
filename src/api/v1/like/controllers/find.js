const mongoose = require("mongoose");
const Like = require("../../../../model/LIke");

exports.findLikes = async (req, res, next) => {
  const { id } = req.params; // Retrieve id from URL parameter

  try {
    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Your article id is not valid or you did not provide it.",
      });
    }

    // Find all likes associated with the specified article
    const likes = await Like.find({ articleId: id });

    // Return the list of likes
    res.status(200).json(likes);
  } catch (e) {
    next(e);
    console.log(e);
  }
};
