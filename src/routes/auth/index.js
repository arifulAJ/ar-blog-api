const router = require("express").Router();
const signinValidator = require("../../../validator/auth/signinValidator");
const signupValidator = require("../../../validator/auth/signupvalidator");
const { authUser } = require("../../api/v1/authentation/auth");

const {
  signupGetController,
  signupPostController,
  signinGetController,
  signinPostController,
  getTokenController,
  logoutController,
} = require("../../api/v1/authentation/controllers");
const { isAuthenticatedUser } = require("../../middleware/authMieeleware");

// const { isUnAuthenteacetUser } = require("../../middleware/authMieeleware");

router.get("/signup", signupGetController);
router.post(
  "/signup",

  signupValidator,
  signupPostController
);
router.get("/signin", signinGetController);
router.get("/token", getTokenController);
router.post(
  "/signin",

  signinValidator,
  signinPostController
);
// router.post("/authUser", authUser);
router.get("/logout", logoutController);

module.exports = router;
