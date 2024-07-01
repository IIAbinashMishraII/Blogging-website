const express = require("express");
const { signup, signin } = require("../controllers/auth");
const router = express.Router();

//validators

const { runValidation } = require("../validations");
const { userSignupValidator,userSigninValidator } = require("../validations/auth.js");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);

module.exports = router;
