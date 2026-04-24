const Page = require("../models/Page");
const uploadToImgBB = require("../utils/uploadToImgBB");
const slugify = require("slugify");

// =========================
// CREATE / UPDATE PAGE (ADMIN)
// =========================
const upsertPage = async (req, res) => {
  try {
    const {
      type,
      title,
      content,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req.body;

    if (!["about", "privacy"].includes(type)) {
      return res.status(400).json({ message: "Invalid page type" });
    }

    let imageUrl = "";

    // Upload image
    if (req.file) {
      imageUrl = await uploadToImgBB(req.file.buffer);
    }

    // keywords convert
    let keywordsArray = metaKeywords;
    if (typeof metaKeywords === "string") {
      keywordsArray = metaKeywords.split(",").map((k) => k.trim());
    }

    let page = await Page.findOne({ type });

    // =========================
    // CREATE SLUG FUNCTION
    // =========================
    const generateUniqueSlug = async (text, currentId = null) => {
      let baseSlug = slugify(text || type, {
        lower: true,
        strict: true,
        trim: true,
      });

      let slug = baseSlug;
      let count = 1;

      while (
        await Page.findOne({
          seoSlug: slug,
          ...(currentId && { _id: { $ne: currentId } }),
        })
      ) {
        slug = `${baseSlug}-${count++}`;
      }

      return slug;
    };

    if (page) {
      // =========================
      // UPDATE
      // =========================

      // ✅ slug update only if title changes
      if (title && title !== page.title) {
        page.seoSlug = await generateUniqueSlug(title, page._id);
      }

      page.title = title ?? page.title;
      page.content = content ?? page.content;
      page.metaTitle = metaTitle ?? page.metaTitle;
      page.metaDescription = metaDescription ?? page.metaDescription;
      page.metaKeywords = keywordsArray ?? page.metaKeywords;

      if (imageUrl) page.image = imageUrl;

      await page.save();
    } else {
      // =========================
      // CREATE
      // =========================

      const slug = await generateUniqueSlug(title || type);

      page = await Page.create({
        type,
        title,
        content,
        image: imageUrl,
        metaTitle,
        metaDescription,
        metaKeywords: keywordsArray,
        seoSlug: slug,
      });
    }

    res.json({
      message: `${type} page saved successfully`,
      page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// GET PAGE (USER)
// =========================
const getPage = async (req, res) => {
  try {
    const { type } = req.params;

    const page = await Page.findOne({ type });

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  upsertPage,
  getPage,
};