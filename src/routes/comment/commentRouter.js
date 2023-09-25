const router = require("express").Router();
const { createComments } = require("../../api/v1/comment/controllers/crate");
const { findComments } = require("../../api/v1/comment/controllers/find");

/**
 * comment all route will handel this route
 * get comment
 * post comment
 * put comment
 * patch comment
 * delete comment
 */
router.get("/comments", findComments);
router.post("/comments", createComments);

module.exports = router;
