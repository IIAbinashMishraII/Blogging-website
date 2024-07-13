const express = require("express");
const router = express.Router();
const { requireSignin, adminMiddleware } = require("../controllers/auth");
//validators
const {create} = require('../controllers/category')
const { runValidation } = require("../validations");
const { categoryCreateValidator } = require("../validations/category");

router.post(
  "/category",
  categoryCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);

module.exports = router;
