const router = require("express").Router();
const User = require("../model/User");
router.get("/signup", (req, res) => {
  console.log("this is sign up route");
  res.send({ message: "this is signup" });
});
router.get("/login", (req, res) => {
  console.log("this is sign in route");
  res.send({ message: "this is login" });
});
router.get("/logout", (req, res) => {
  console.log("this is sign up route");
  res.send({ message: "this is logout" });
});

module.exports = router;
