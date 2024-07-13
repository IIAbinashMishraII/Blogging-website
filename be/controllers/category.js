const slugify = require("slugify");
const Category = require("../models/category");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();
    let categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ error: "Category already exists" });
    }
    let category = new Category({ name, slug });
    let savedCategory = await category.save();
    res.json(savedCategory);
  } catch (err) {
    res.status(500).json({ error: "Server error. Please report the error" });
  }
};
