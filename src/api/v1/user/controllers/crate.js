const User = require("../../../../model/User");

exports.createuserController = async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "You need to sign in" });
  }

  try {
    const { name, email, password, avatar } = req.body;

    // Create a new user using the User model (assuming it's properly defined)
    const newUser = new User({
      name,
      email,
      password,
      avatar,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (e) {
    console.log(e);
  }
};
