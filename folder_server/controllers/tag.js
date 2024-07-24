const slugify = require("slugify");
// const Tags = require("../models/tag");
const { errorHandler } = require("../middlewares/dbErrorHandler");
const Tags = require("../models/tag");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();
    let tag = new Tags({ name, slug });
    let savedTag = await tag.save();
    res.json(savedTag);
  } catch (err) {
    res.status(400).json({ error: errorHandler(err) });
  }
};
exports.list = async (req, res) => {
  try {
    data = await Tags.find({});
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: errorHandler(err) });
  }
};
exports.read = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    data = await Tags.findOne({ slug });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: errorHandler(err) });
  }
};
exports.remove = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    data = await Tags.findOneAndDelete({ slug });
    res.json({ message: "Tag deleted successfully", data });
  } catch (err) {
    res.status(400).json({ error: errorHandler(err) });
  }
};
