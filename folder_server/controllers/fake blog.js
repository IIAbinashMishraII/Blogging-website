const Blog = require("../models/blog");
const formidable = require("formidable");
const slugify = require("slugify");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../middlewares/dbErrorHandler");

exports.create = async (req, res) => {
  try {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    const { stripHtml } = await import("string-strip-html");
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not be uploaded",
        });
      }

      const { categories, tags } = fields;
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const body = Array.isArray(fields.body) ? fields.body[0] : fields.body;
      console.log(categories);
      if (!title || !title.length) {
        return res.status(400).json({ error: "Title is required" });
      }
      if (!body || body.length < 200) {
        return res.status(400).json({ error: "Content is too short" });
      }
      if (!categories || categories.length === 0) {
        return res.status(400).json({ error: "At least one category is required" });
      }
      if (!tags || tags.length === 0) {
        return res.status(400).json({ error: "At least one category is required" });
      }

      //slugified title is unique, need to work on it later
      blogExists = await Blog.findOne({ slug: slugify(title).toLowerCase() });
      if (blogExists) {
        return res.status(400).json({ error: "Try a new title" });
      }
      //   console.log(data);
      let blog = new Blog();
      blog.title = title;
      blog.body = body;
      blog.slug = slugify(title).toLowerCase();
      blog.mtitle = `${title} | ${process.env.APP_NAME}`;
      blog.mdesc = stripHtml(body.substring(0, 160)).result;
      blog.postedBy = req.auth._id;

      let categoriesArr = JSON.parse(categories);
      let tagsArr = JSON.parse(tags);
      console.log(categoriesArr, tagsArr);
      //   console.log(files.photo);
      if (files.photo) {
        if (files.photo[0].size > 1000000) {
          return res.status(400).json({
            error: "Image should be less than 1 MB in size",
          });
        }
        blog.photo.data = fs.readFileSync(files.photo[0].filepath);
        blog.photo.contentType = files.photo[0].type;
      }

      let savedBlog = await blog.save();
      let updatedBlog = await Blog.findByIdAndUpdate(
        savedBlog._id,
        {
          $push: {
            categories: { $each: categoriesArr },
            tags: { $each: tagsArr },
          },
        },
        { new: true }
      );
      return res.status(200).json({ message: "Blog posted successfully", updatedBlog });
    });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};
