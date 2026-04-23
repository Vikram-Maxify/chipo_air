const axios = require("axios");

exports.getFlights = async (req, res) => {
  try {
    const { from, to } = req.query;

    const response = await axios.get(
      "http://api.aviationstack.com/v1/flights",
      {
        params: {
          access_key: process.env.AVIATION_KEY,
          dep_iata: from,
          arr_iata: to,
        },
      }
    );

    const rawData = response.data.data;
    console.log(rawData);


    const flights = response.data.data.map((f) => {
      return {
        route: {
          from: {
            city: f.departure.airport,
            code: f.departure.iata,
            terminal: f.departure.terminal || "N/A",
            gate: f.departure.gate || "N/A",
          },
          to: {
            city: f.arrival.airport,
            code: f.arrival.iata,
            terminal: f.arrival.terminal || "N/A",
            gate: f.arrival.gate || "N/A",
          },
        },

        airline: f.airline.name,
        flightNumber: f.flight.iata,

        timing: {
          departure: {
            scheduled: f.departure.scheduled,
            actual: f.departure.actual,
            delay: f.departure.delay || "On Time",
          },
          arrival: {
            scheduled: f.arrival.scheduled,
            actual: f.arrival.actual,
            delay: f.arrival.delay || "On Time",
          },
        },

        status: f.flight_status,
      };
    });

    res.json({
      success: true,
      count: flights.length,
      flights,        // 👈 clean data
      raw: rawData,   // 👈 full API data
    });

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching flights" });
  }
};