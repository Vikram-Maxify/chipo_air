// ======================================================
// controllers/flightController.js
// ======================================================

const axios = require("axios");
const FlightBooking = require("../models/FlightBooking");

// ======================================================
// 1️⃣ SEARCH FLIGHTS
// ======================================================

exports.searchFlights =
  async (req, res) => {
    try {

      const {
        from,
        to,
        date,
        passengers = 1,
        cabinClass =
          "economy",
      } = req.query;

      // ==========================================
      // VALIDATION
      // ==========================================

      if (!from || !to) {
        return res.status(400).json({
          success: false,
          message:
            "From and To airport codes are required",
        });
      }

      const passengerCount =
        Number(
          passengers
        );

      // ==========================================
      // PASSENGERS
      // ==========================================

      const passengersData =
        [];

      for (
        let i = 0;
        i <
        passengerCount;
        i++
      ) {
        passengersData.push({
          type: "adult",
        });
      }

      // ==========================================
      // SEARCH FLIGHTS
      // ==========================================

      const response =
        await axios.post(
          "https://api.duffel.com/air/offer_requests",
          {
            data: {
              slices: [
                {
                  origin:
                    from,

                  destination:
                    to,

                  departure_date:
                    date,
                },
              ],

              passengers:
                passengersData,

              cabin_class:
                cabinClass,

              return_offers: true,

              return_available_services: true,
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

      const offers =
        response?.data
          ?.data?.offers ||
        [];

      // ==========================================
      // FORMAT
      // ==========================================

      const flights =
        offers.map(
          (offer) => {

            const segments =
              offer?.slices?.[0]
                ?.segments ||
              [];

            const firstSegment =
              segments?.[0];

            const lastSegment =
              segments[
                segments.length -
                  1
              ];

            return {
              offerId:
                offer?.id,

              passengers:
                offer?.passengers?.map(
                  (
                    p
                  ) => ({
                    passengerId:
                      p?.id,

                    type:
                      p?.type,
                  })
                ),

              airline:
                firstSegment
                  ?.operating_carrier
                  ?.name,

              flightNumber:
                firstSegment?.operating_carrier_flight_number,

              cabinClass,

              route: {
                from: {
                  city:
                    firstSegment
                      ?.origin
                      ?.city_name,

                  code:
                    firstSegment
                      ?.origin
                      ?.iata_code,
                },

                to: {
                  city:
                    lastSegment
                      ?.destination
                      ?.city_name,

                  code:
                    lastSegment
                      ?.destination
                      ?.iata_code,
                },
              },

              departure:
                firstSegment?.departing_at,

              arrival:
                lastSegment?.arriving_at,

              totalAmount:
                offer?.total_amount,

              currency:
                offer?.total_currency,

              services:
                offer?.available_services ||
                [],
            };
          }
        );

      return res.status(200).json({
        success: true,

        totalFlights:
          flights.length,

        flights,
      });

    } catch (err) {

      console.log(
        err?.response
          ?.data ||
          err.message
      );

      return res.status(500).json({
        success: false,

        message:
          err?.response
            ?.data
            ?.errors?.[0]
            ?.message ||
          "Flight search failed",
      });
    }
  };

// ======================================================
// 2️⃣ GET SEAT MAP
// ======================================================

exports.getSeatMap =
  async (req, res) => {
    try {

      const {
        offerId,
        passengers,
      } = req.body;

      // ==========================================
      // VALIDATION
      // ==========================================

      if (!offerId) {
        return res.status(400).json({
          success: false,
          message:
            "Offer ID is required",
        });
      }

      // ==========================================
      // PASSENGERS
      // ==========================================

      const formattedPassengers =
        passengers.map(
          (p) => ({
            id: p.id,

            title:
              p.title ||
              "mr",

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

      // ==========================================
      // TEMP ORDER
      // ==========================================

      const orderResponse =
        await axios.post(
          "https://api.duffel.com/air/orders",
          {
            data: {
              type:
                "instant",

              selected_offers:
                [offerId],

              passengers:
                formattedPassengers,

              payments: [
                {
                  type:
                    "balance",

                  amount:
                    "1.00",

                  currency:
                    "USD",
                },
              ],
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
        orderResponse
          ?.data?.data;

      // ==========================================
      // GET SEAT MAP
      // ==========================================

      const seatResponse =
        await axios.get(
          `https://api.duffel.com/air/orders/${order.id}/seat_maps`,
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

      // ==========================================
      // FORMAT SEATS
      // ==========================================

      const seats =
        [];

      seatMaps.forEach(
        (seatMap) => {

          seatMap?.cabins?.forEach(
            (
              cabin
            ) => {

              cabin?.rows?.forEach(
                (
                  row
                ) => {

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

                          let seatPrice = 0;

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

                            seatPrice =
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
                            seatId:
                              element?.id,

                            seatNumber:
                              element?.designator,

                            available:
                              element?.available,

                            cabin:
                              cabin?.cabin_class,

                            price:
                              seatPrice,

                            currency,

                            seatServiceId:
                              serviceId,

                            characteristics:
                              element?.characteristics ||
                              [],
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

      return res.status(200).json({
        success: true,

        tempOrderId:
          order?.id,

        totalSeats:
          seats.length,

        seats,
      });

    } catch (err) {

      console.log(
        err?.response
          ?.data ||
          err.message
      );

      return res.status(500).json({
        success: false,

        message:
          err?.response
            ?.data
            ?.errors?.[0]
            ?.message ||
          "Seat map failed",
      });
    }
  };

// ======================================================
// 3️⃣ BOOK FLIGHT
// ======================================================

exports.bookFlight =
  async (req, res) => {
    try {

      const {
        offerId,
        passengers,
        selectedSeats,
        payment,
        flight,
      } = req.body;

      // ==========================================
      // PASSENGERS
      // ==========================================

      const duffelPassengers =
        passengers.map(
          (p) => ({
            id: p.id,

            title:
              p.title ||
              "mr",

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

      // ==========================================
      // SERVICES
      // ==========================================

      const services =
        [];

      if (
        selectedSeats &&
        selectedSeats.length >
          0
      ) {

        selectedSeats.forEach(
          (
            seat
          ) => {

            if (
              seat?.seatServiceId
            ) {

              services.push({
                id:
                  seat.seatServiceId,

                quantity:
                  1,
              });
            }
          }
        );
      }

      // ==========================================
      // FINAL ORDER
      // ==========================================

      const orderPayload =
        {
          data: {
            type:
              "instant",

            selected_offers:
              [offerId],

            passengers:
              duffelPassengers,

            payments: [
              {
                type:
                  "balance",

                amount:
                  payment?.amount,

                currency:
                  payment?.currency ||
                  "USD",
              },
            ],
          },
        };

      if (
        services.length >
        0
      ) {
        orderPayload.data.services =
          services;
      }

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
        response?.data
          ?.data;

      // ==========================================
      // SAVE BOOKING
      // ==========================================

      const booking =
        await FlightBooking.create(
          {
            offerId,

            passengers,

            selectedSeats,

            payment,

            flight,

            duffelOrderId:
              order?.id,

            bookingStatus:
              order?.status,
          }
        );

      return res.status(201).json({
        success: true,

        booking,

        duffel:
          order,
      });

    } catch (err) {

      console.log(
        err?.response
          ?.data ||
          err.message
      );

      return res.status(500).json({
        success: false,

        message:
          err?.response
            ?.data
            ?.errors?.[0]
            ?.message ||
          "Booking failed",
      });
    }
  };

// ======================================================
// BOOKINGS
// ======================================================

exports.getBookings =
  async (req, res) => {

    const bookings =
      await FlightBooking.find().sort(
        {
          createdAt:
            -1,
        }
      );

    return res.json({
      success: true,
      bookings,
    });
  };

exports.getSingleBooking =
  async (req, res) => {

    const booking =
      await FlightBooking.findById(
        req.params.id
      );

    return res.json({
      success: true,
      booking,
    });
  };