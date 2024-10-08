const express = require("express");
const { requireSignin, authMiddleware } = require("../controllers/auth");

const { read } = require("../controllers/user");
const router = express.Router();

//validators
router.get("/profile", requireSignin, authMiddleware, read);

module.exports = router;
