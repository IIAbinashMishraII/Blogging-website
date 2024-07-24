const express = require("express");
const router = express.Router();
const { requireSignin, adminMiddleware } = require("../controllers/auth");
//validators
const { create, list, read, remove } = require("../controllers/tag");
const { runValidation } = require("../validations");
const { tagCreateValidator } = require("../validations/tag");

router.post(
  "/tag",
  tagCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);
router.get("/tag", list);
router.get("/tag/:slug", read);
router.delete("/tag/:slug", requireSignin, adminMiddleware, remove);

module.exports = router;
