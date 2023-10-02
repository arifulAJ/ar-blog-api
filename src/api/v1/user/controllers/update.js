const mongoose = require("mongoose");
const User = require("../../../../model/User");
const { validationResult } = require("express-validator");
const errorFormate = require("../../../../utils/validatorerrorFormator");
const bcrypt = require("bcryptjs");

exports.updateController = async (req, res, next) => {
  if (!req.user) {
    return res.status(404).json({ message: "you need to sign in" });
  }

  let errors = validationResult(req).formatWith(errorFormate);
  console.log(errors);

  if (!errors.isEmpty()) {
    let data = errors.mapped();

    return res.status(409).json({
      code: 400,
      message: "bad request",
      data,
    });
  }
  const { name, email, password, avatar } = req.body;
  const updateId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(updateId)) {
      return res.status(404).json({ message: "invalid id" });
    }

    // Hash the new password
    let hashPassword = await bcrypt.hash(password, 11);

    // Update user information
    const updatedUser = await User.findByIdAndUpdate(
      updateId,
      {
        name,

        password: hashPassword, // Update the password if needed
        avatar,
      },
      { new: true, runValidators: true } // Return the updated user object
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User is not found" });
    }

    res
      .status(200)
      .json({ message: "Updated successfully", data: updatedUser });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
    next(e);
  }
};
