const Page = require("../models/Page");
const uploadToImgBB = require("../utils/uploadToImgBB");

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
            seoSlug,
        } = req.body;

        if (!["about", "privacy"].includes(type)) {
            return res.status(400).json({ message: "Invalid page type" });
        }

        let imageUrl = "";

        // Upload image if exists
        if (req.file) {
            imageUrl = await uploadToImgBB(req.file.buffer);
        }

        // convert keywords string → array (if coming from frontend)
        let keywordsArray = metaKeywords;
        if (typeof metaKeywords === "string") {
            keywordsArray = metaKeywords.split(",").map((k) => k.trim());
        }

        let page = await Page.findOne({ type });

        if (page) {
            // UPDATE
            page.title = title ?? page.title;
            page.content = content ?? page.content;
            page.metaTitle = metaTitle ?? page.metaTitle;
            page.metaDescription = metaDescription ?? page.metaDescription;
            page.metaKeywords = keywordsArray ?? page.metaKeywords;
            page.seoSlug = seoSlug ?? page.seoSlug;

            if (imageUrl) page.image = imageUrl;

            await page.save();
        } else {
            // CREATE
            page = await Page.create({
                type,
                title,
                content,
                image: imageUrl,
                metaTitle,
                metaDescription,
                metaKeywords: keywordsArray,
                seoSlug,
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