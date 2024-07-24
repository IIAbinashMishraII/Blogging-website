const Blog = require("../models/blog");
const Tags = require("../models/tag");
const Category = require("../models/category");
const formidable = require("formidable");
const slugify = require("slugify");
const fs = require("fs");
const { errorHandler } = require("../middlewares/dbErrorHandler");
const sanitizeHtml = require("sanitize-html");
const { smartTrim } = require("../middlewares/blogHandler");

// Configuration constants
const MAX_FILE_SIZE = 1000000;
const MIN_BODY_LENGTH = 200;
const META_DESCRIPTION_LENGTH = 160;

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

function validateInputs(fields) {
  const title = fields.title && fields.title[0] ? fields.title[0] : "";
  const body = fields.body && fields.body[0] ? fields.body[0] : "";
  let categories, tags;

  try {
    categories =
      fields.categories && fields.categories[0] ? parseStringToArray(fields.categories[0]) : [];
    tags = fields.tags && fields.tags[0] ? parseStringToArray(fields.tags[0]) : [];
  } catch (error) {
    return { isValid: false, error: "Invalid format for categories or tags" };
  }

  if (!title || title.length === 0) {
    return { isValid: false, error: "Title is required" };
  }
  if (!body || body.length < MIN_BODY_LENGTH) {
    return {
      isValid: false,
      error: `Content must be at least ${MIN_BODY_LENGTH} characters long`,
    };
  }
  if (!Array.isArray(categories) || categories.length === 0) {
    return { isValid: false, error: "At least one category is required" };
  }
  if (!Array.isArray(tags) || tags.length === 0) {
    return { isValid: false, error: "At least one tag is required" };
  }

  return {
    isValid: true,
    title: sanitizeHtml(title),
    body: sanitizeHtml(body),
    categories,
    tags,
  };
}

function parseStringToArray(str) {
  return str
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function generateUniqueSlug(title) {
  const baseSlug = slugify(title).toLowerCase();
  let slug = baseSlug;
  let suffix = 1;

  while (await Blog.findOne({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  return slug;
}

function createBlogData(validatedData, slug, userId, stripHtml) {
  return {
    title: validatedData.title,
    body: validatedData.body,
    slug,
    mtitle: `${validatedData.title} | ${process.env.APP_NAME}`,
    mdesc: stripHtml(validatedData.body.substring(0, META_DESCRIPTION_LENGTH)).result,
    postedBy: userId,
    categories: validatedData.categories,
    tags: validatedData.tags,
    excerpt: smartTrim(validatedData.body, 320, " ", "..."),
  };
}

function validatePhoto(photo) {
  if (Array.isArray(photo)) {
    photo = photo[0]; // Will see afterwards
  }
  if (!photo || !photo.size) {
    return { isValid: false, error: "Invalid photo file" };
  }
  if (photo.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Image should be less than ${MAX_FILE_SIZE / 1000000} MB in size`,
    };
  }
  return { isValid: true };
}

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
exports.read = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  blogData = await Blog.findOne({ slug })
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name slug")
    .select("_id title body slug categories tags postedBy createdAt updatedAt");
  if (blogData.error) {
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
  blogData = await Blog.findOneAndDelete({ slug });
  if (blogData.error) {
    return res.json({ error: errorHandler(err) });
  }
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
