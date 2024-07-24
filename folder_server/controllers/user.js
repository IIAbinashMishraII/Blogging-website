const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const JWT = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");

exports.read = (req, res) => {
console.log(req.profile)
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
};

