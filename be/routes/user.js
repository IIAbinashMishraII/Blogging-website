const express = require("express");
const {
  signup,
  signin,
  signout,
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth");

const{read} = require("../controllers/user")
const router = express.Router();

//validators




router.get("/profile",requireSignin,authMiddleware, read);


module.exports = router;
