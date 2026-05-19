const axios = require("axios");
const FlightBooking = require("../models/FlightBooking");

// ✅ BOOK FLIGHT WITH LIVE SEAT SELECTION

exports.bookFlight = async (req, res) => {
  try {
    const {
      offerId,
      passenger,
      passengers,
      flight,
      payment,
      passengerId,
      selectedSeats,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!offerId) {
      return res.status(400).json({
        success: false,
        message:
          "Offer ID is required",
      });
    }

    // ==================================================
    // PASSENGERS
    // ==================================================

    let passengerList = [];

    // MULTIPLE PASSENGERS
    if (
      passengers &&
      Array.isArray(passengers) &&
      passengers.length > 0
    ) {
      passengerList = passengers;
    }

    // SINGLE PASSENGER
    else if (passenger) {
      passengerList = [
        {
          ...passenger,
          id: passengerId,
        },
      ];
    }

    else {
      return res.status(400).json({
        success: false,
        message:
          "Passenger details are required",
      });
    }

    // ==================================================
    // VALIDATE PASSENGERS
    // ==================================================

    for (const p of passengerList) {

      if (
        !p.id ||
        typeof p.id !== "string" ||
        !p.id.startsWith("pas_")
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid Duffel passenger ID is required",
        });
      }

      if (
        !p.firstName ||
        !p.lastName ||
        !p.email ||
        !p.phone ||
        !p.gender ||
        !p.born_on
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All passenger fields are required",
        });
      }
    }

    // ==================================================
    // FORMAT PASSENGERS
    // ==================================================

    const duffelPassengers =
      passengerList.map((p) => {

        const formattedPhone =
          p.phone.startsWith("+")
            ? p.phone
            : `+91${p.phone}`;

        return {
          id: p.id,

          title:
            p.title || "mr",

          given_name:
            p.firstName,

          family_name:
            p.lastName,

          born_on:
            p.born_on,

          gender:
            p.gender,

          email:
            p.email,

          phone_number:
            formattedPhone,
        };
      });

    // ==================================================
    // SERVICES
    // ==================================================

    const services = [];

    // ==================================================
    // LIVE SEAT SERVICES
    // ==================================================

    if (
      selectedSeats &&
      Array.isArray(selectedSeats) &&
      selectedSeats.length > 0
    ) {

      selectedSeats.forEach(
        (seat) => {

          if (
            seat?.seatServiceId
          ) {

            services.push({
              id:
                seat.seatServiceId,

              quantity: 1,
            });
          }
        }
      );
    }

    // ==================================================
    // ORDER PAYLOAD
    // ==================================================

    const orderPayload = {
      data: {
        type: "instant",

        selected_offers: [
          offerId,
        ],

        passengers:
          duffelPassengers,

        payments: [
          {
            type: "balance",

            amount:
              payment?.amount ||
              "0",

            currency:
              payment?.currency ||
              "INR",
          },
        ],
      },
    };

    // ==================================================
    // ADD SEAT SERVICES
    // ==================================================

    if (services.length > 0) {
      orderPayload.data.services =
        services;
    }

    // ==================================================
    // CREATE LIVE DUFFEL ORDER
    // ==================================================

    const response =
      await axios.post(
        "https://api.duffel.com/air/orders",
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,

            "Duffel-Version":
              "v2",

            "Content-Type":
              "application/json",
          },
        }
      );

    const order =
      response.data?.data;

    // ==================================================
    // SAVE PASSENGERS
    // ==================================================

    const savedPassengers =
      passengerList.map((p) => {

        const formattedPhone =
          p.phone.startsWith("+")
            ? p.phone
            : `+91${p.phone}`;

        return {
          passengerId: p.id,

          title:
            p.title || "mr",

          firstName:
            p.firstName,

          lastName:
            p.lastName,

          email:
            p.email,

          phone:
            formattedPhone,

          gender:
            p.gender,

          born_on:
            p.born_on,
        };
      });

    // ==================================================
    // SAVE BOOKING
    // ==================================================

    const savedBooking =
      await FlightBooking.create({
        // OFFER
        offerId,

        // PASSENGERS
        passengerId:
          passengerList?.[0]
            ?.id || null,

        passengers:
          savedPassengers,

        passenger:
          savedPassengers?.[0] ||
          null,

        // ==================================================
        // SEATS
        // ==================================================

        selectedSeats:
          selectedSeats?.map(
            (seat) => ({
              seatId:
                seat?.seatId,

              seatNumber:
                seat?.seatNumber,

              cabin:
                seat?.cabin,

              available:
                seat?.available,

              characteristics:
                seat?.characteristics ||
                [],

              price:
                seat?.price ||
                0,

              currency:
                seat?.currency ||
                "USD",

              seatServiceId:
                seat?.seatServiceId,

              // AMENITIES
              pitch:
                seat?.pitch ||

                seat?.amenities
                  ?.seat?.pitch ||

                null,

              legroom:
                seat?.legroom ||

                seat?.amenities
                  ?.seat
                  ?.legroom ||

                null,

              type:
                seat?.type ||

                seat?.amenities
                  ?.seat?.type ||

                null,
            })
          ) || [],

        // ==================================================
        // FLIGHT
        // ==================================================

        flight: {
          airline:
            flight?.airline ||
            "N/A",

          airlines:
            flight?.airlines ||
            [],

          flightNumber:
            flight?.flightNumber ||
            "N/A",

          flightNumbers:
            flight?.flightNumbers ||
            [],

          cabinClass:
            flight?.cabinClass ||
            "economy",

          // ROUTE
          from: {
            city:
              flight?.from
                ?.city ||

              flight?.route
                ?.from?.city ||

              "N/A",

            code:
              flight?.from
                ?.code ||

              flight?.route
                ?.from?.code ||

              "N/A",
          },

          to: {
            city:
              flight?.to?.city ||

              flight?.route
                ?.to?.city ||

              "N/A",

            code:
              flight?.to?.code ||

              flight?.route
                ?.to?.code ||

              "N/A",
          },

          // TIMING
          departureAt:
            flight?.departureAt ||

            flight?.timing
              ?.departure
              ?.scheduled ||

            null,

          arrivalAt:
            flight?.arrivalAt ||

            flight?.timing
              ?.arrival
              ?.scheduled ||

            null,

          // PRICE
          totalAmount:
            flight?.totalAmount ||
            0,

          currency:
            flight?.currency ||
            "USD",

          price:
            flight?.price ||
            "N/A",

          // BAGGAGE
          baggage:
            flight?.baggage ||
            {},

          totalBaggage:
            flight?.totalBaggage ||
            0,

          paidBaggage:
            flight?.paidBaggage ||
            0,
        },

        // ==================================================
        // PAYMENT
        // ==================================================

        payment: {
          amount:
            payment?.amount ||
            "0",

          currency:
            payment?.currency ||
            "INR",

          status: "paid",
        },

        // ==================================================
        // DUFFEL
        // ==================================================

        duffelOrderId:
          order?.id || null,

        bookingStatus:
          order?.status ||
          "confirmed",
      });

    // ==================================================
    // SUCCESS
    // ==================================================

    return res.status(201).json({
      success: true,

      message:
        "Flight booked successfully",

      booking:
        savedBooking,

      selectedSeats:
        selectedSeats || [],

      services,

      duffel:
        order,
    });

  } catch (err) {

    console.log(
      "BOOKING ERROR:",
      JSON.stringify(
        err?.response?.data,
        null,
        2
      ) || err.message
    );

    return res.status(500).json({
      success: false,

      message:
        err?.response?.data
          ?.errors?.[0]
          ?.message ||

        "Flight booking failed",

      error:
        err?.response?.data ||
        err.message,
    });
  }
};

// ======================================================
// GET ALL BOOKINGS
// ======================================================

exports.getBookings =
  async (req, res) => {

    try {

      const bookings =
        await FlightBooking.find().sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,

        count:
          bookings.length,

        bookings,
      });

    } catch (err) {

      return res.status(500).json({
        success: false,

        message:
          err.message,
      });
    }
  };

// ======================================================
// GET SINGLE BOOKING
// ======================================================

exports.getSingleBooking =
  async (req, res) => {

    try {

      const booking =
        await FlightBooking.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({
          success: false,

          message:
            "Booking not found",
        });
      }

      return res.status(200).json({
        success: true,

        booking,
      });

    } catch (err) {

      return res.status(500).json({
        success: false,

        message:
          err.message,
      });
    }
  };



  exports.getSeatMap =
  async (req, res) => {
    try {

      const {
        offerId,
        passengers,
      } = req.body;

      // ==============================
      // VALIDATION
      // ==============================

      if (!offerId) {
        return res.status(400).json({
          success: false,
          message:
            "Offer ID is required",
        });
      }

      if (
        !passengers ||
        !Array.isArray(
          passengers
        ) ||
        passengers.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Passengers are required",
        });
      }

      // ==============================
      // FORMAT PASSENGERS
      // ==============================

      const formattedPassengers =
        passengers.map(
          (p) => ({
            id: p.id,

            title:
              p.title || "mr",

            given_name:
              p.firstName,

            family_name:
              p.lastName,

            born_on:
              p.born_on,

            gender:
              p.gender,

            email:
              p.email,

            phone_number:
              p.phone.startsWith(
                "+"
              )
                ? p.phone
                : `+91${p.phone}`,
          })
        );

      // ==============================
      // CREATE HOLD ORDER
      // ==============================

      const orderResponse =
        await axios.post(
          "https://api.duffel.com/air/orders",
          {
            data: {
              type: "hold",

              selected_offers:
                [offerId],

              passengers:
                formattedPassengers,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,

              "Duffel-Version":
                "v2",

              "Content-Type":
                "application/json",
            },
          }
        );

      const order =
        orderResponse?.data
          ?.data;

      const orderId =
        order?.id;

      // ==============================
      // GET SEAT MAP
      // ==============================

      const seatResponse =
        await axios.get(
          `https://api.duffel.com/air/orders/${orderId}/seat_maps`,
          {
            headers: {
              Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,

              "Duffel-Version":
                "v2",
            },
          }
        );

      const seatMaps =
        seatResponse?.data
          ?.data || [];

      // ==============================
      // FORMAT SEATS
      // ==============================

      const seats = [];

      seatMaps.forEach(
        (seatMap) => {

          seatMap?.cabins?.forEach(
            (cabin) => {

              cabin?.rows?.forEach(
                (row) => {

                  row?.sections?.forEach(
                    (
                      section
                    ) => {

                      section?.elements?.forEach(
                        (
                          element
                        ) => {

                          if (
                            element?.type !==
                            "seat"
                          )
                            return;

                          const services =
                            element?.available_services ||
                            [];

                          let price = 0;

                          let currency =
                            "USD";

                          let serviceId =
                            null;

                          if (
                            services.length >
                            0
                          ) {

                            const service =
                              services[0];

                            price =
                              Number(
                                service?.total_amount ||
                                  0
                              );

                            currency =
                              service?.total_currency ||
                              "USD";

                            serviceId =
                              service?.id ||
                              null;
                          }

                          seats.push({
                            // BASIC
                            seatId:
                              element?.id,

                            seatNumber:
                              element?.designator,

                            available:
                              element?.available,

                            // CABIN
                            cabin:
                              cabin?.cabin_class,

                            // PRICE
                            price,

                            currency,

                            seatServiceId:
                              serviceId,

                            // FEATURES
                            characteristics:
                              element?.characteristics ||
                              [],

                            // POSITION
                            row:
                              row?.number,

                            column:
                              element?.designator?.replace(
                                /\d/g,
                                ""
                              ),

                            // AMENITIES
                            pitch:
                              cabin
                                ?.amenities
                                ?.seat
                                ?.pitch ||

                              null,

                            legroom:
                              cabin
                                ?.amenities
                                ?.seat
                                ?.legroom ||

                              null,

                            type:
                              cabin
                                ?.amenities
                                ?.seat
                                ?.type ||

                              null,
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );

      // ==============================
      // RESPONSE
      // ==============================

      return res.status(200).json({
        success: true,

        orderId,

        totalSeats:
          seats.length,

        seats,
      });

    } catch (err) {

      console.log(
        "SEAT MAP ERROR:",
        JSON.stringify(
          err?.response
            ?.data,
          null,
          2
        ) || err.message
      );

      return res.status(500).json({
        success: false,

        message:
          err?.response?.data
            ?.errors?.[0]
            ?.message ||

          "Seat map fetch failed",

        error:
          err?.response?.data ||
          err.message,
      });
    }
  };