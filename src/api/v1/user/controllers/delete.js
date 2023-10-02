const mongoose = require("mongoose");
const User = require("../../../../model/User");

exports.deleteuserControlar = async (req, res, next) => {
  if (!req.user) {
    return res.status(404).json({ message: "singin to go next" });
  }
  try {
    const deleteId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(deleteId)) {
      return res.status(404).json({ message: " provide valid id" });
    }
    const userfind = await User.findById(deleteId);
    if (!userfind) {
      return res.status(404).json({ message: "user not found " });
    }
    await User.findByIdAndDelete(deleteId);
    res.status(200).json({ message: "deleted successfully" });
  } catch (e) {
    console.log(e);
    next(e);
  }
};
