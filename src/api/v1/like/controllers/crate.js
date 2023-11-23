const mongoose = require("mongoose");
const Like = require("../../../../model/LIke");

exports.createLikes = async (req, res, next) => {
  const { body } = req.body;

  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "You should be signed in." });
  }

  const { id } = req.params; // Retrieve articleId from URL parameter
  const authorId = req.user.userId;

  try {
    // Check if articleId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Your article id is not valid or you did not provide it.",
      });
    }

    // Check if the user has already liked the article
    const existingLike = await Like.findOne({
      articleId: id,
      authorId: authorId,
    });

    if (existingLike) {
      // User has already liked the article, so remove the like (unlike)
      await Like.deleteOne({ _id: existingLike._id });

      const response = {
        code: 200,
        message: "Successfully unliked",
      };

      res.status(200).json(response);
    } else {
      // User has not liked the article, so create a new like
      const createLike = await Like.create({
        imogi: body, // You may use req.body.imogi or another property to represent the like
        articleId: id,
        authorId: authorId,
      });

      const response = {
        code: 201,
        message: "Successfully liked",
        createLike,
      };

      res.status(201).json(response);
    }
  } catch (e) {
    next(e);
    console.log(e);
  }
};
