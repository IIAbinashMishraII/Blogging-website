const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const JWT = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");

exports.signup = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    const { name, email, password } = req.body;
    let username = uuidv4();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;

    let newUser = new User({ name, email, password, profile, username });
    await newUser.save();
    return res.json({
      message: "Signup success! Please Signin",
      user: newUser,
    });
  } catch (err) {
    if (!res.headersSent) {
      return res.status(400).json({
        error: err.message,
      });
    }
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      error: "User do not exist. Please Sign Up!",
    });
  }

  if (!user.authenticate(password)) {
    return res.status(400).json({
      error: "Email and password do not match.",
    });
  }

  const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, { expiresIn: "1d" });
  const { _id, username, email: userEmail, name, role } = user;
  return res.json({
    token,
    user: { _id, name, username, email: userEmail, role },
  });
};

exports.signout = async (req, res) => {
  res.clearCookie("token");
  res.json({
    message: " Signout success",
  });
};

exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.authMiddleware = async(req, res, next) => {
  const authUserId = req.auth._id;
  console.log(authUserId)
  const user = await User.findById({ _id: authUserId });
  if (!user) {
    return res.status(400).json({
      error: "User not found",
    });
  }
  req.profile = user;
  next();
};

exports.adminMiddleware = async (req, res, next) => {
  const adminUserId = req.auth._id;
  const user = await User.findById({ _id: adminUserId });
  if (!user) {
    return res.status(400).json({
      error: "User not found",
    });
  }
  if (user.role !== 1) {
    return res.status(400).json({
      error: "Access denied",
    });
  }
  req.profile = user;
  next();
};
