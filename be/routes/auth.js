const express = require("express");
const {
  signup,
  signin,
  signout,
  requireSignin,
} = require("../controllers/auth");
const router = express.Router();

//validators

const { runValidation } = require("../validations");
const {
  userSignupValidator,
  userSigninValidator,
} = require("../validations/auth.js");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.get("/signout", signout);

//test
router.get("/secret", requireSignin, (req, res) => {
  res.json({
    user: req.auth,
  });
});

module.exports = router;
