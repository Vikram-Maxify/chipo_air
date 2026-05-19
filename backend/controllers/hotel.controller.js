// ======================================================
// FILE: controllers/hotel.controller.js
// COMMON JS VERSION
// ======================================================

const axios = require("axios");

// ======================================================
// DUFFEL AXIOS INSTANCE
// ======================================================

const duffel = axios.create({
    baseURL: "https://api.duffel.com",
    headers: {
        Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,
        "Duffel-Version": "v2",
        "Content-Type": "application/json",
    },
});

// ======================================================
// STEP 1 - SEARCH HOTELS
// ======================================================


const searchHotels = async (req, res) => {
    try {
        const {
            city,
            checkInDate,
            checkOutDate,
            rooms = 1,
            adults = 1,
            radius = 5,
        } = req.body;

        // ======================================================
        // VALIDATION
        // ======================================================

        if (!city) {
            return res.status(400).json({
                success: false,
                message: "city is required",
            });
        }

        if (!checkInDate) {
            return res.status(400).json({
                success: false,
                message: "checkInDate is required",
            });
        }

        if (!checkOutDate) {
            return res.status(400).json({
                success: false,
                message: "checkOutDate is required",
            });
        }

        // ======================================================
        // GET LATITUDE & LONGITUDE
        // ======================================================

        let latitude;
        let longitude;

        try {
            const geoResponse = await axios.get(
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

                    timeout: 10000,
                }
            );

            // ======================================================
            // CHECK LOCATION
            // ======================================================

            if (
                !geoResponse.data ||
                geoResponse.data.length === 0
            ) {
                return res.status(404).json({
                    success: false,
                    message: "Location not found",
                });
            }

            latitude = parseFloat(
                geoResponse.data[0].lat
            );

            longitude = parseFloat(
                geoResponse.data[0].lon
            );
        } catch (geoError) {
            console.log(
                "GEO ERROR:",
                geoError.response?.data ||
                geoError.message
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch city coordinates",
            });
        }

        // ======================================================
        // CREATE GUESTS ARRAY
        // ======================================================

        const guests = [];

        for (let i = 0; i < adults; i++) {
            guests.push({
                type: "adult",
            });
        }

        // ======================================================
        // DUFFEL HOTEL SEARCH
        // ======================================================

        const response = await duffel.post(
            "/stays/search",
            {
                data: {
                    check_in_date: checkInDate,

                    check_out_date: checkOutDate,

                    rooms,

                    guests,

                    location: {
                        radius,

                        geographic_coordinates: {
                            latitude,
                            longitude,
                        },
                    },
                },
            }
        );

        // ======================================================
        // RESPONSE
        // ======================================================

        return res.status(200).json({
            success: true,
            city,
            latitude,
            longitude,
            total: response.data.data.length,
            data: response.data.data,
        });
    } catch (error) {
        console.log(
            "SEARCH HOTEL ERROR:",
            error.response?.data ||
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                error.response?.data?.errors?.[0]
                    ?.message ||
                error.message,
        });
    }
};


// ======================================================
// EXPORT
// ======================================================


// ======================================================
// STEP 2 - GET ROOM DETAILS / ROOM VIEW
// ======================================================

const getHotelRooms = async (req, res) => {
    try {
        const { searchResultId } = req.params;

        if (!searchResultId) {
            return res.status(400).json({
                success: false,
                message: "searchResultId is required",
            });
        }

        // =========================
        // DUFFEL API CALL
        // =========================

        const response = await duffel.post(
            `/stays/search_results/${searchResultId}/actions/fetch_all_rates`
        );

        return res.status(200).json({
            success: true,
            message: "Room details fetched successfully",
            data: response.data.data,
        });
    } catch (error) {
        console.log(
            "ROOM FETCH ERROR:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message:
                error.response?.data?.errors?.[0]?.message ||
                error.message,
        });
    }
};

// ======================================================
// STEP 3 - CREATE QUOTE
// ======================================================

const createHotelQuote = async (req, res) => {
    try {
        const { rateId } = req.body;

        if (!rateId) {
            return res.status(400).json({
                success: false,
                message: "rateId is required",
            });
        }

        // =========================
        // DUFFEL API CALL
        // =========================

        const response = await duffel.post("/stays/quotes", {
            data: {
                rate_id: rateId,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Quote created successfully",
            data: response.data.data,
        });
    } catch (error) {
        console.log(
            "QUOTE ERROR:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message:
                error.response?.data?.errors?.[0]?.message ||
                error.message,
        });
    }
};

// ======================================================
// STEP 4 - BOOK HOTEL
// ======================================================

const bookHotel = async (req, res) => {
    try {
        const {
            quoteId,
            guests,
            email,
            phoneNumber,
        } = req.body;

        // =========================
        // VALIDATION
        // =========================

        if (!quoteId) {
            return res.status(400).json({
                success: false,
                message: "quoteId is required",
            });
        }

        if (!guests || guests.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Guests are required",
            });
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "phoneNumber is required",
            });
        }

        // =========================
        // FORMAT GUESTS
        // =========================

        const formattedGuests = guests.map((guest) => ({
            given_name: guest.firstName,
            family_name: guest.lastName,
            born_on: guest.dob,
        }));

        // =========================
        // DUFFEL API CALL
        // =========================

        const response = await duffel.post("/stays/bookings", {
            data: {
                quote_id: quoteId,
                guests: formattedGuests,
                email,
                phone_number: phoneNumber,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Hotel booked successfully",
            data: response.data.data,
        });
    } catch (error) {
        console.log(
            "BOOK HOTEL ERROR:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message:
                error.response?.data?.errors?.[0]?.message ||
                error.message,
        });
    }
};

// ======================================================
// STEP 5 - GET BOOKING DETAILS
// ======================================================

const getBookingDetails = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "bookingId is required",
            });
        }

        // =========================
        // DUFFEL API CALL
        // =========================

        const response = await duffel.get(
            `/stays/bookings/${bookingId}`
        );

        return res.status(200).json({
            success: true,
            message: "Booking fetched successfully",
            data: response.data.data,
        });
    } catch (error) {
        console.log(
            "GET BOOKING ERROR:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message:
                error.response?.data?.errors?.[0]?.message ||
                error.message,
        });
    }
};

// ======================================================
// STEP 6 - CANCEL BOOKING
// ======================================================

const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "bookingId is required",
            });
        }

        // =========================
        // DUFFEL API CALL
        // =========================

        const response = await duffel.post(
            `/stays/bookings/${bookingId}/actions/cancel`
        );

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: response.data.data,
        });
    } catch (error) {
        console.log(
            "CANCEL BOOKING ERROR:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message:
                error.response?.data?.errors?.[0]?.message ||
                error.message,
        });
    }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    searchHotels,
    getHotelRooms,
    createHotelQuote,
    bookHotel,
    getBookingDetails,
    cancelBooking,
};