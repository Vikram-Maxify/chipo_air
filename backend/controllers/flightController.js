const axios = require("axios");

exports.getFlights = async (req, res) => {
    try {
        const {
            from,
            to,
            date,
            passengers = 1,
        } = req.query;



        // ==================================================
        // ✅ VALIDATION
        // ==================================================

        if (!from || !to) {
            return res.status(400).json({
                success: false,

                message:
                    "From and To airport codes are required",
            });
        }

        const passengerCount =
            Number(passengers);

        if (
            isNaN(passengerCount) ||
            passengerCount < 1
        ) {
            return res.status(400).json({
                success: false,

                message:
                    "Passengers must be greater than 0",
            });
        }

        // ==================================================
        // ✅ TOMORROW DATE
        // ==================================================

        const getTomorrowDate = () => {

            const tomorrow =
                new Date();

            tomorrow.setDate(
                tomorrow.getDate() +
                1
            );

            return tomorrow
                .toISOString()
                .split("T")[0];
        };

        // ==================================================
        // ✅ DATE
        // ==================================================

        const departureDate =
            date ||
            getTomorrowDate();

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        const selectedDate =
            new Date(
                departureDate
            );

        if (
            selectedDate <=
            today
        ) {
            return res.status(400).json({
                success: false,

                message:
                    "Departure date must be in the future",
            });
        }

        // ==================================================
        // ✅ CREATE PASSENGERS
        // ==================================================

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



        // ==================================================
        // ✅ CREATE OFFER REQUEST
        // ==================================================

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
                                    departureDate,
                            },
                        ],

                        passengers:
                            passengersData,

                        cabin_class:
                            "economy",

                        return_offers:
                            true,
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


        // ==================================================
        // ✅ OFFERS
        // ==================================================

        const offers =
            response.data
                ?.data
                ?.offers || [];

        // ==================================================
        // ✅ FORMAT FLIGHTS
        // ==================================================

        const flights =
            await Promise.all(
                offers.map(
                    async (
                        offer
                    ) => {

                        // ==========================================
                        // ✅ ALL SEGMENTS
                        // ==========================================

                        const segments =
                            offer?.slices?.[0]
                                ?.segments || [];

                        // ==========================================
                        // ✅ FIRST SEGMENT
                        // ==========================================

                        const firstSegment =
                            segments?.[0];

                        // ==========================================
                        // ✅ LAST SEGMENT
                        // ==========================================

                        const lastSegment =
                            segments?.[
                                segments.length -
                                1
                            ];

                        // ==========================================
                        // ✅ ALL AIRLINES
                        // ==========================================

                        const airlines =
                            [
                                ...new Set(
                                    segments.map(
                                        (
                                            s
                                        ) =>
                                            s
                                                ?.operating_carrier
                                                ?.name
                                    )
                                ),
                            ];

                        // ==========================================
                        // ✅ ALL FLIGHT NUMBERS
                        // ==========================================

                        const flightNumbers =
                            segments.map(
                                (
                                    s
                                ) =>
                                    s?.operating_carrier_flight_number
                            );

                        // ==========================================
                        // ✅ STOPS
                        // ==========================================

                        const stops =
                            segments.length -
                            1;

                        // ==========================================
                        // ✅ PASSENGERS
                        // ==========================================

                        const realPassengers =
                            offer?.passengers?.map(
                                (
                                    passenger,
                                    index
                                ) => ({
                                    passengerNo:
                                        index +
                                        1,

                                    passengerId:
                                        passenger?.id,

                                    type:
                                        passenger?.type,
                                })
                            ) ||
                            [];

                        // ==========================================
                        // ✅ SEAT SERVICES
                        // ==========================================

                        const seatServices =
                            offer?.available_services
                                ?.filter(
                                    (
                                        service
                                    ) =>
                                        service?.type ===
                                        "seat"
                                )
                                ?.map(
                                    (
                                        seat,
                                        index
                                    ) => ({
                                        seatNo:
                                            index +
                                            1,

                                        seatServiceId:
                                            seat?.id ||
                                            null,

                                        amount:
                                            Number(
                                                seat?.total_amount ||
                                                0
                                            ),

                                        currency:
                                            seat?.total_currency ||
                                            "USD",
                                    })
                                ) ||
                            [];

                        // ==========================================
                        // ✅ SEAT MAP
                        // ==========================================

                        let seatMapData =
                            [];

                        try {

                            const seatMapResponse =
                                await axios.post(
                                    "https://api.duffel.com/air/seat_maps",
                                    {
                                        data: {
                                            offer_id:
                                                offer.id,
                                        },
                                    },
                                    {
                                        headers:
                                            {
                                                Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,

                                                "Duffel-Version":
                                                    "v2",

                                                "Content-Type":
                                                    "application/json",
                                            },
                                    }
                                );


                            const seatMaps =
                                seatMapResponse
                                    ?.data
                                    ?.data ||
                                [];

                            // ======================================
                            // ✅ LOOP CABINS
                            // ======================================

                            seatMaps.forEach(
                                (
                                    seatMap
                                ) => {

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
                                                                        element?.type ===
                                                                        "seat"
                                                                    ) {

                                                                        const service =
                                                                            offer?.available_services?.find(
                                                                                (
                                                                                    s
                                                                                ) =>
                                                                                    s?.id ===
                                                                                    element?.available_services?.[0]
                                                                            );

                                                                        seatMapData.push(
                                                                            {
                                                                                seatId:
                                                                                    element?.id,

                                                                                seatNumber:
                                                                                    element?.designator,

                                                                                available:
                                                                                    element?.available,

                                                                                seatServiceId:
                                                                                    service?.id ||
                                                                                    null,

                                                                                price:
                                                                                    Number(
                                                                                        service?.total_amount ||
                                                                                        0
                                                                                    ),

                                                                                currency:
                                                                                    service?.total_currency ||
                                                                                    "USD",

                                                                                cabin:
                                                                                    cabin?.cabin_class ||
                                                                                    "economy",
                                                                            }
                                                                        );
                                                                    }
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


                        } catch (
                            seatErr
                        ) {

                            console.log(
                                "SEAT MAP ERROR:",
                                seatErr
                                    ?.response
                                    ?.data ||
                                seatErr.message
                            );
                        }

                        // ==========================================
                        // ✅ RETURN FLIGHT
                        // ==========================================

                        return {

                            // OFFER
                            offerId:
                                offer?.id ||
                                null,

                            // PASSENGERS
                            passengers:
                                realPassengers,

                            totalPassengers:
                                realPassengers.length,

                            // ROUTE
                            route: {
                                from: {
                                    city:
                                        firstSegment
                                            ?.origin
                                            ?.city_name ||
                                        "N/A",

                                    code:
                                        firstSegment
                                            ?.origin
                                            ?.iata_code ||
                                        "N/A",

                                    terminal:
                                        firstSegment?.departing_terminal ||
                                        "N/A",
                                },

                                to: {
                                    city:
                                        lastSegment
                                            ?.destination
                                            ?.city_name ||
                                        "N/A",

                                    code:
                                        lastSegment
                                            ?.destination
                                            ?.iata_code ||
                                        "N/A",

                                    terminal:
                                        lastSegment?.arriving_terminal ||
                                        "N/A",
                                },
                            },

                            // AIRLINES
                            airline:
                                airlines.join(
                                    " + "
                                ) ||
                                "Unknown Airline",

                            airlines,

                            // FLIGHT NUMBERS
                            flightNumber:
                                flightNumbers.join(
                                    ", "
                                ) ||
                                "N/A",

                            flightNumbers,

                            // STOPS
                            stops,

                            // SEGMENTS
                            segments,

                            // TIMING
                            timing: {
                                departure:
                                {
                                    scheduled:
                                        firstSegment?.departing_at ||
                                        null,
                                },

                                arrival:
                                {
                                    scheduled:
                                        lastSegment?.arriving_at ||
                                        null,
                                },
                            },

                            // PRICE
                            totalAmount:
                                offer?.total_amount ||
                                0,

                            currency:
                                offer?.total_currency ||
                                "USD",

                            price:
                                `${offer?.total_amount} ${offer?.total_currency}`,

                            // SEATS
                            seatServices,

                            totalSeats:
                                seatMapData.length,

                            seats:
                                seatMapData,

                            // STATUS
                            status:
                                "scheduled",
                        };
                    }
                )
            );

        // ==================================================
        // ✅ FINAL LOG
        // ==================================================


        // ==================================================
        // ✅ SUCCESS
        // ==================================================

        return res.status(200).json({
            success: true,

            requestedPassengers:
                passengerCount,

            totalFlights:
                flights.length,

            flights,

            raw: offers,
        });

    } catch (err) {

        console.log(
            "DUFFEL ERROR:",
            err.response
                ?.data ||
            err.message
        );

        return res.status(500).json({
            success: false,

            message:
                err.response
                    ?.data
                    ?.errors?.[0]
                    ?.message ||
                "Error fetching flights from Duffel",

            error:
                err.response
                    ?.data ||
                err.message,
        });
    }
};