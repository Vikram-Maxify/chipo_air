const axios = require("axios");

// 🛰️ LIVE STATUS
exports.getFlightStatus = async (req, res) => {
  try {
    const { flight } = req.query; // e.g. AI101

    const response = await axios.get(
      `http://api.aviationstack.com/v1/flights`,
      {
        params: {
          access_key: process.env.AVIATION_KEY,
          flight_iata: flight,
        },
      }
    );

    const data = response.data.data.map((f) => ({
      airline: f.airline.name,
      flight: f.flight.iata,
      status: f.flight_status,
      departure_airport: f.departure.airport,
      arrival_airport: f.arrival.airport,
      departure_time: f.departure.scheduled,
      arrival_time: f.arrival.scheduled,
    }));

    res.json({
      success: true,
      data,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Status fetch error" });
  }
};