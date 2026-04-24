const axios = require("axios");
const FormData = require("form-data");

const uploadToImgBB = async (fileBuffer) => {
  try {
    const form = new FormData();
    form.append("image", fileBuffer.toString("base64"));

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      form,
      {
        headers: form.getHeaders(),
      }
    );

    return response.data.data.url;
  } catch (error) {
    console.log("ImgBB upload error:", error.response?.data || error.message);
    throw new Error("Image upload failed");
  }
};

module.exports = uploadToImgBB;