const slugify = require("slugify");
const Category = require("../models/category");
const { errorHandler } = require("../middlewares/dbErrorHandler");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();
    let category = new Category({ name, slug });
    let savedCategory = await category.save();
    res.json(savedCategory);
  } catch (err) {
    res.status(400).json({ error: errorHandler(err) });
  }
};
exports.list = async (req, res) => {
  try {
    data = await Category.find({});
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: errorHandler(err) });
  }
};
exports.read = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    data = await Category.findOne({ slug });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: errorHandler(err) });
  }
};
exports.remove = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    data = await Category.findOneAndDelete({ slug });
    res.json({ message: "Category deleted successfully", data });
  } catch (err) {
    res.status(400).json({ error: errorHandler(err) });
  }
};
