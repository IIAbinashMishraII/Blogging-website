const Blog = require("../models/blog");
const Tags = require("../models/tag");
const Category = require("../models/category");
const formidable = require("formidable");
const slugify = require("slugify");
const fs = require("fs");
const { errorHandler } = require("../middlewares/dbErrorHandler");
const {
  validateInputs,
  validatePhoto,
  generateUniqueSlug,
  createBlogData,
  updateBlogData,
  validateUpdatedInputs,
  determineContentType,
} = require("../middlewares/blogHandler");

exports.create = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  try {
    const { stripHtml } = await import("string-strip-html"); //stupid dynamic import

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const validatedData = validateInputs(fields);

    if (!validatedData.isValid) {
      return res.status(400).json({ error: validatedData.error });
    }

    const slug = await generateUniqueSlug(validatedData.title);
    const blogData = createBlogData(validatedData, slug, req.auth._id, stripHtml);

    if (files.photo) {
      const photoValidation = validatePhoto(files.photo);
      if (!photoValidation.isValid) {
        return res.status(400).json({ error: photoValidation.error });
      }
      try {
        if (files.photo.filepath) {
          blogData.photo = {
            data: fs.readFileSync(files.photo.filepath),
            contentType: files.photo.type,
          };
        } else if (files.photo[0] && files.photo[0].filepath) {
          blogData.photo = {
            data: fs.readFileSync(files.photo[0].filepath),
            contentType: files.photo[0].type,
          };
        } else {
          console.error("Photo file structure is unexpected:", files.photo);
        }
      } catch (photoError) {
        console.error("Error processing photo:", photoError);
        return res.status(400).json({ error: "Error processing photo" });
      }
    }

    const blog = new Blog(blogData);
    const savedBlog = await blog.save();

    res.status(201).json({
      message: "Blog posted successfully",
      blog: savedBlog,
    });
  } catch (err) {
    console.error("Blog creation error:", err);
    res.status(400).json({ error: errorHandler(err) });
  }
};

exports.list = async (req, res) => {
  const data = await Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name slug")
    .select("_id title slug excerpt categories tags postedBy createdAt updatedAt");

  if (data.error) {
    return res.json({ error: errorHandler(data.error) });
  } else {
    return res.json(data);
  }
};

exports.listEverything = async (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.limit ? parseInt(req.body.skip) : 0;
  let blogs, categories, tags;
  const blogData = await Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name slug profile")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("_id title slug excerpt categories tags postedBy createdAt updatedAt");
  // console.log(blogData);
  if (blogData.error) {
    return res.json({ error: errorHandler(blogData.err) });
  } else {
    blogs = blogData;
    const categoryData = await Category.find({});
    // console.log(categoryData);
    if (categoryData.error) {
      return res.json({ error: errorHandler(categoryData.error) });
    } else {
      categories = categoryData;
      const tagData = await Tags.find({});
      // console.log(tagData);
      if (tagData.error) {
        return res.json({ error: errorHandler(tagData.error) });
      } else {
        tags = tagData;
        res.json({ blogs, categories, tags, size: blogs.length });
      }
    }
  }
};

exports.listRelated = async (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  const { _id, categories } = req.body.blog;
  const data = await Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .populate("postedBy", "_id name profile")
    .select("title slug excerpt postedBy createdAt updatedAt");
  if (!data || data.error) {
    return res.status(400).json({
      error: "Blogs not found",
    });
  }
  return res.json(data);
};

exports.read = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  blogData = await Blog.findOne({ slug })
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name slug")
    .select("_id title body slug mdesc categories tags postedBy createdAt updatedAt");
  // console.log(blogData, slug);
  if (blogData.error || !blogData) {
    return res.json({ error: errorHandler(blogData) });
  } else {
    return res.json(blogData);
  }
};

exports.remove = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  blogData = await Blog.findOneAndDelete({ slug });
  if (blogData.error) {
    return res.json({ error: errorHandler(err) });
  } else {
    return res.json({ message: "Blog delted successfully" });
  }
};

exports.update = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  try {
    const { stripHtml } = await import("string-strip-html");

    const existingBlog = await Blog.findOne({ slug });
    if (!existingBlog) {
      return res.status(400).json({ error: "Blog not found" });
    }

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const validatedData = validateUpdatedInputs(fields, existingBlog);
    if (!validatedData.isValid) {
      return res.status(400).json({ error: validatedData.error });
    }
    let updatedBlogData = updateBlogData(validatedData, slug, req.auth._id, stripHtml);

    //merging and ensuring the title and slug doesn't change
    updatedBlogData = {
      ...existingBlog.toObject(),
      ...updatedBlogData,
      slug: existingBlog.slug,
      title: existingBlog.title,
    };

    if (files.photo) {
      const photoValidation = validatePhoto(files.photo);
      if (!photoValidation.isValid) {
        return res.status(400).json({ error: photoValidation.error });
      }
      try {
        if (files.photo.filepath) {
          blogData.photo = {
            data: fs.readFileSync(files.photo.filepath),
            contentType: files.photo.type,
          };
        } else if (files.photo[0] && files.photo[0].filepath) {
          blogData.photo = {
            data: fs.readFileSync(files.photo[0].filepath),
            contentType: files.photo[0].type,
          };
        } else {
          console.error("Photo file structure is unexpected:", files.photo);
        }
      } catch (photoError) {
        console.error("Error processing photo:", photoError);
        return res.status(400).json({ error: "Error processing photo" });
      }
    }

    const updatedBlog = await Blog.findOneAndUpdate({ slug }, updatedBlogData, {
      new: true,
      runValidators: true,
    });
    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (err) {
    console.error("Blog update error:", err);
    res.status(400).json({ error: errorHandler(err) });
  }
};

exports.photo = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const blogPhoto = await Blog.findOne({ slug }).select("photo");
  if (!blogPhoto || !blogPhoto.photo) {
    return res.status(404).json({ error: "Photo not found" });
  }
  res.set("Content-Type", determineContentType(blogPhoto.photo.data));
  return res.send(blogPhoto.photo.data);
};
