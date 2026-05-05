const axios = require("axios");

exports.getFlights = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    // Step 1: Create Offer Request
    const response = await axios.post(
      "https://api.duffel.com/air/offer_requests",
      {
        data: {
          slices: [
            {
              origin: from,        // e.g. DEL
              destination: to,     // e.g. BOM
              departure_date: date || "2026-05-10",
            },
          ],
          passengers: [{ type: "adult" }],
          cabin_class: "economy",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,
          "Duffel-Version": "v2",
          "Content-Type": "application/json",
        },
      }
    );

    const offers = response.data.data.offers;

    // Step 2: Clean Data (similar to your structure)
    const flights = offers.map((offer) => {
      const segment = offer.slices[0].segments[0];

      return {
        route: {
          from: {
            city: segment.origin.city_name,
            code: segment.origin.iata_code,
            terminal: segment.departing_terminal || "N/A",
            gate: "N/A",
          },
          to: {
            city: segment.destination.city_name,
            code: segment.destination.iata_code,
            terminal: segment.arriving_terminal || "N/A",
            gate: "N/A",
          },
        },

        airline: segment.operating_carrier.name,
        flightNumber: segment.operating_carrier_flight_number,

        timing: {
          departure: {
            scheduled: segment.departing_at,
            actual: segment.departing_at,
            delay: "On Time",
          },
          arrival: {
            scheduled: segment.arriving_at,
            actual: segment.arriving_at,
            delay: "On Time",
          },
        },

        price: offer.total_amount + " " + offer.total_currency,

        status: "scheduled",
      };
    });

    console.log(flights);


    res.json({
      success: true,
      count: flights.length,
      flights,
      raw: offers,
    });

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching flights from Duffel" });
  }
};