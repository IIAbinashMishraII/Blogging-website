const slugify = require("slugify");
const sanitizeHtml = require("sanitize-html");
const Blog = require("../models/blog");

// Configuration constants
const MAX_FILE_SIZE = 1000000;
const MIN_BODY_LENGTH = 200;
const META_DESCRIPTION_LENGTH = 160;

function smartTrim(str, length, delim, appendix) {
  if (str.length <= length) return str;
  var trimmedStr = str.substr(0, length + delim.length);
  var lastDelimIndex = trimmedStr.lastIndexOf(delim);
  if (lastDelimIndex >= 0) {
    trimmedStr = trimmedStr.substr(0, lastDelimIndex);
  }
  if (trimmedStr) {
    trimmedStr += appendix;
  }
  return trimmedStr;
}
function parseStringToArray(str) {
  return str
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

exports.validateInputs = (fields) => {
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
};

exports.validateUpdatedInputs = (fields, existingBlog) => {
  const body = fields.body && fields.body[0] ? fields.body[0] : undefined;
  let categories, tags;

  try {
    categories =
      fields.categories && fields.categories[0]
        ? parseStringToArray(fields.categories[0])
        : undefined;
    tags = fields.tags && fields.tags[0] ? parseStringToArray(fields.tags[0]) : undefined;
  } catch (error) {
    return { isValid: false, error: "Invalid format for categories or tags" };
  }

  if (body !== undefined && body.length < MIN_BODY_LENGTH) {
    return {
      isValid: false,
      error: `Content must be at least ${MIN_BODY_LENGTH} characters long`,
    };
  }
  if (categories !== undefined && (!Array.isArray(categories) || categories.length === 0)) {
    return { isValid: false, error: "At least one category is required" };
  }
  if (tags !== undefined && (!Array.isArray(tags) || tags.length === 0)) {
    return { isValid: false, error: "At least one tag is required" };
  }
  return {
    isValid: true,
    body: body !== undefined ? sanitizeHtml(body) : existingBlog.body,
    categories: categories !== undefined ? categories : existingBlog.categories,
    tags: tags !== undefined ? tags : existingBlog.tags,
  };
};

exports.generateUniqueSlug = async (title) => {
  const baseSlug = slugify(title).toLowerCase();
  let slug = baseSlug;
  let suffix = 1;

  while (await Blog.findOne({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  return slug;
};

exports.createBlogData = (validatedData, slug, userId, stripHtml) => {
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
};

exports.updateBlogData = (validatedData, slug, userId, stripHtml) => {
  return {
    body: validatedData.body,
    slug,
    mdesc: stripHtml(validatedData.body.substring(0, META_DESCRIPTION_LENGTH)).result,
    postedBy: userId,
    categories: validatedData.categories,
    tags: validatedData.tags,
    excerpt: smartTrim(validatedData.body, 320, " ", "..."),
  };
};

exports.validatePhoto = (photo) => {
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
};

exports.determineContentType = (buffer) => {
  try {
    const byte1 = buffer[0];
    const byte2 = buffer[1];

    if (byte1 === 0xff && byte2 === 0xd8) {
      return "image/jpeg";
    } else if (byte1 === 0x89 && byte2 === 0x50) {
      return "image/png";
    } else if (byte1 === 0x47 && byte2 === 0x49) {
      return "image/gif";
    } else {
      return "application/octet-stream"; // Default to binary data
    }
  } catch (error) {
    console.log(error);
  }
};
