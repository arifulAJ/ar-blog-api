const router = require("express").Router();
const { findUsers } = require("../../api/v1/user/controllers/find");
// const { createuserController } = require("../../api/v1/user/controllers/crate");

/**
 * user all route are handes here
 */
router.get("/user", findUsers);
// router.post("/user", createuserController);
module.exports = router;
