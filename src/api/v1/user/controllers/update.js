// const mongoose = require("mongoose");
// const User = require("../../../../model/User");
// const { validationResult } = require("express-validator");
// const errorFormate = require("../../../../utils/validatorerrorFormator");
// const bcrypt = require("bcryptjs");

// exports.updateController = async (req, res, next) => {
//   if (!req.user) {
//     return res.status(404).json({ message: "you need to sign in" });
//   }

//   let errors = validationResult(req).formatWith(errorFormate);
//   console.log(errors);

//   if (!errors.isEmpty()) {
//     let data = errors.mapped();

//     return res.status(409).json({
//       code: 400,
//       message: "bad request",
//       data,
//     });
//   }
//   const { name, password, avatar } = req.body;
//   const updateId = req.params.id;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(updateId)) {
//       return res.status(404).json({ message: "invalid id" });
//     }

//     // Hash the new password
//     let hashPassword = await bcrypt.hash(password, 11);

//     // Update user information
//     const updatedUser = await User.findByIdAndUpdate(
//       updateId,
//       {
//         name,

//         password: hashPassword, // Update the password if needed
//         avatar,
//       },
//       { new: true, runValidators: true } // Return the updated user object
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User is not found" });
//     }

//     res
//       .status(200)
//       .json({ message: "Updated successfully", data: updatedUser });
//   } catch (e) {
//     console.log(e);
//     res
//       .status(500)
//       .json({ message: "Internal Server Error", error: e.message });
//     next(e);
//   }
// };

const mongoose = require("mongoose");
const User = require("../../../../model/User");
const { validationResult } = require("express-validator");
const errorFormate = require("../../../../utils/validatorerrorFormator");
const bcrypt = require("bcryptjs");

exports.updateController = async (req, res, next) => {
  if (!req.user) {
    return res.status(404).json({ message: "You need to sign in" });
  }

  let errors = validationResult(req).formatWith(errorFormate);
  console.log(errors.isEmpty());
  if (!errors.isEmpty()) {
    let data = errors.mapped();
    console.log(data);
    return res.status(409).json({
      code: 400,
      message: "Bad request",
      data,
    });
  }
  if (
    req.body.name !== undefined &&
    req.body.name !== null &&
    req.body.name !== ""
  ) {
  }

  const updateId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(updateId)) {
      return res.status(404).json({ message: "Invalid id" });
    }

    // Prepare an object with optional properties
    const updateData = {};

    if (
      req.body.name !== undefined &&
      req.body.name !== null &&
      req.body.name !== ""
    ) {
      updateData.name = req.body.name;
    }

    if (
      req.body.avatar !== undefined &&
      req.body.avatar !== null &&
      req.body.avatar !== ""
    ) {
      updateData.avatar = req.body.avatar;
    }

    if (
      req.body.password !== undefined &&
      req.body.password !== null &&
      req.body.password !== ""
    ) {
      // Hash the new password if provided
      const hashPassword = await bcrypt.hash(req.body.password, 11);
      updateData.password = hashPassword;
    }

    // Update user information
    const updatedUser = await User.findByIdAndUpdate(
      updateId,
      updateData,
      { new: true, runValidators: true } // Return the updated user object
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User is not found" });
    }

    res
      .status(200)
      .json({ message: "Updated successfully", data: updatedUser });
    next();
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
    next(e);
  }
};
