const axios = require("axios");

exports.getFlights = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    // ✅ VALIDATION
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message:
          "From and To airport codes are required",
      });
    }

    // ✅ TOMORROW DATE
    const getTomorrowDate = () => {
      const tomorrow = new Date();

      tomorrow.setDate(
        tomorrow.getDate() + 1
      );

      return tomorrow
        .toISOString()
        .split("T")[0];
    };

    // ✅ DATE
    const departureDate =
      date || getTomorrowDate();

    // ✅ PREVENT PAST DATE
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(
      departureDate
    );

    if (selectedDate <= today) {
      return res.status(400).json({
        success: false,
        message:
          "Departure date must be in the future",
      });
    }

    // ✅ CREATE OFFER REQUEST
    const response = await axios.post(
      "https://api.duffel.com/air/offer_requests",
      {
        data: {
          slices: [
            {
              origin: from,
              destination: to,
              departure_date:
                departureDate,
            },
          ],

          // ✅ IMPORTANT
          passengers: [
            {
              type: "adult",
              id: "pas_1",
            },
          ],

          cabin_class: "economy",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,

          "Duffel-Version": "v2",

          "Content-Type":
            "application/json",
        },
      }
    );

    // ✅ OFFERS
    const offers =
      response.data?.data?.offers || [];

    // ✅ CLEAN DATA
    const flights = offers.map(
      (offer) => {
        const segment =
          offer?.slices?.[0]
            ?.segments?.[0];

        return {
          // ✅ VERY IMPORTANT
          offerId: offer?.id || null,

          // ✅ PASSENGER ID
          passengerId: "pas_1",

          route: {
            from: {
              city:
                segment?.origin
                  ?.city_name ||
                "N/A",

              code:
                segment?.origin
                  ?.iata_code ||
                "N/A",

              terminal:
                segment?.departing_terminal ||
                "N/A",

              gate: "N/A",
            },

            to: {
              city:
                segment?.destination
                  ?.city_name ||
                "N/A",

              code:
                segment?.destination
                  ?.iata_code ||
                "N/A",

              terminal:
                segment?.arriving_terminal ||
                "N/A",

              gate: "N/A",
            },
          },

          airline:
            segment
              ?.operating_carrier
              ?.name ||
            "Unknown Airline",

          flightNumber:
            segment?.operating_carrier_flight_number ||
            "N/A",

          timing: {
            departure: {
              scheduled:
                segment?.departing_at ||
                null,

              actual:
                segment?.departing_at ||
                null,

              delay: "On Time",
            },

            arrival: {
              scheduled:
                segment?.arriving_at ||
                null,

              actual:
                segment?.arriving_at ||
                null,

              delay: "On Time",
            },
          },

          price: `${offer?.total_amount} ${offer?.total_currency}`,

          rawPrice:
            offer?.total_amount || 0,

          currency:
            offer?.total_currency ||
            "INR",

          status: "scheduled",
        };
      }
    );

    // ✅ RESPONSE
    return res.status(200).json({
      success: true,

      count: flights.length,

      flights,

      raw: offers,
    });
  } catch (err) {
    console.log(
      "DUFFEL ERROR:",
      err.response?.data ||
        err.message
    );

    return res.status(500).json({
      success: false,

      message:
        err.response?.data?.errors?.[0]
          ?.message ||
        "Error fetching flights from Duffel",
    });
  }
};