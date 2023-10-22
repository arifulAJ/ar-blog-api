const router = require("express").Router();
const { findUsers } = require("../../api/v1/user/controllers/find");
const { createuserController } = require("../../api/v1/user/controllers/crate");
const signupvalidator = require("../../../validator/auth/signupvalidator");
const { updateController } = require("../../api/v1/user/controllers/update");
const updateUserValidator = require("../../../validator/user/updateUserValidator");
const { deleteuserControlar } = require("../../api/v1/user/controllers/delete");
const { findSingleUser } = require("../../api/v1/user/controllers/findSingle");

/**
 * user all route are handes here
 */

router.get("/user", findUsers);
router.post("/user", signupvalidator, createuserController);
router.get("/user/:id", findSingleUser);
router.patch("/user/:id", updateUserValidator, updateController);
router.delete("/user/:id", deleteuserControlar);
module.exports = router;
