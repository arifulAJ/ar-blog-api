const router = require("express").Router();
const { findUsers } = require("../../api/v1/user/controllers/find");
const { createuserController } = require("../../api/v1/user/controllers/crate");
const signupvalidator = require("../../../validator/auth/signupvalidator");

/**
 * user all route are handes here
 */
router.get("/user", findUsers);
router.post("/user", signupvalidator, createuserController);
module.exports = router;
