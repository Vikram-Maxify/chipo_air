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

    const flights = response.data.data.slice(0, 10).map((f) => {
      // 🔥 SMART PRICE LOGIC
      let price = Math.floor(Math.random() * 4000) + 3000;

      // Airline based pricing
      if (f.airline.name?.includes("IndiGo")) price += 500;
      if (f.airline.name?.includes("Air India")) price += 1000;

      return {
        airline: f.airline.name,
        flight: f.flight.iata,
        from: f.departure.iata,
        to: f.arrival.iata,
        departure: f.departure.scheduled,
        arrival: f.arrival.scheduled,
        status: f.flight_status,
        price: price,
        currency: "INR",
      };
    });

    res.json({
      success: true,
      count: flights.length,
      flights,
    });

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching flights" });
  }
};