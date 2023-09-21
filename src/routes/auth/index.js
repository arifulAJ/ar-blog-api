const router = require("express").Router();
const signinValidator = require("../../../validator/auth/signinValidator");
const signupValidator = require("../../../validator/auth/signupvalidator");

const {
  signupGetController,
  signupPostController,
  signinGetController,
  signinPostController,
  logoutPostController,
} = require("../../api/v1/authentation/controllers");

// const { isUnAuthenteacetUser } = require("../../middleware/authMieeleware");

router.get("/signup", signupGetController);
router.post(
  "/signup",

  signupValidator,
  signupPostController
);
router.get("/signin", signinGetController);
router.post(
  "/signin",

  signinValidator,
  signinPostController
);
router.post("/logout", logoutPostController);

module.exports = router;
