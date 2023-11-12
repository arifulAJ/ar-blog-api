const { createLikes } = require("../../api/v1/like/controllers/crate");
const { findLikes } = require("../../api/v1/like/controllers/find");
const { isAuthenticatedUser } = require("../../middleware/authMieeleware");

const router = require("express").Router();

router.get("/likes/:id", findLikes);
router.post("/likes/:id", isAuthenticatedUser, createLikes);

module.exports = router;
