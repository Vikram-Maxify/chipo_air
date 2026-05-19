const axios = require("axios");

// ======================================================
// GET LATITUDE & LONGITUDE
// ======================================================

const getCoordinates = async (city) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: city,
          format: "json",
          limit: 1,
        },

        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          Accept: "application/json",
        },
      }
    );

    if (
      !response.data ||
      response.data.length === 0
    ) {
      return null;
    }

    return {
      latitude: parseFloat(response.data[0].lat),
      longitude: parseFloat(response.data[0].lon),
    };
  } catch (error) {
    console.log(
      "LOCATION ERROR:",
      error.response?.data || error.message
    );

    return null;
  }
};

module.exports = getCoordinates;