import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import API from "../axios";

// ======================================================
// 1️⃣ SEARCH FLIGHTS
// ======================================================

export const getFlightsThunk =
    createAsyncThunk(
        "flights/getFlights",

        async (
            {
                from,
                to,
                departure_date,
                return_date,
                adults = 1,
                children = 0,
                infants = 0,
                travelClass,
            },
            { rejectWithValue }
        ) => {

            try {

                const params =
                    new URLSearchParams({
                        from,
                        to,
                        date:
                            departure_date,

                        adults:
                            adults.toString(),

                        children:
                            children.toString(),

                        infants:
                            infants.toString(),
                    });

                if (return_date) {

                    params.append(
                        "return_date",
                        return_date
                    );
                }

                if (travelClass) {

                    params.append(
                        "cabinClass",
                        travelClass
                    );
                }

                const res =
                    await API.get(
                        `/flights/search?${params.toString()}`
                    );

                return {
                    flights:
                        res.data?.flights || [],

                    requestedPassengers:
                        res.data
                            ?.requestedPassengers || {},

                    totalFlights:
                        res.data
                            ?.totalFlights || 0,
                };

            } catch (err) {

                return rejectWithValue(
                    err.response?.data?.message ||
                    "Flight search failed"
                );
            }
        }
    );

// ======================================================
// 2️⃣ GET SEAT MAP
// ======================================================

export const getSeatMapThunk =
    createAsyncThunk(
        "flights/getSeatMap",

        async (
            {
                offerId,
                passengers,
                totalAmount,
                currency = "USD",
            },
            { rejectWithValue }
        ) => {

            try {

                // ==========================================
                // API CALL
                // ==========================================

                const res =
                    await API.post(
                        "/flights/seat-map",
                        {
                            offerId,

                            passengers,

                            totalAmount:
                                String(
                                    Number(
                                        totalAmount || 0
                                    )
                                ),

                            currency,
                        }
                    );

                console.log(
                    "SEAT MAP RESPONSE",
                    res.data
                );

                // ==========================================
                // RETURN
                // ==========================================

                return {

                    tempOrderId:
                        res.data?.tempOrderId || null,

                    seats:
                        Array.isArray(
                            res.data?.seats
                        )
                            ? res.data.seats
                            : [],

                    totalSeats:
                        res.data?.totalSeats || 0,
                };

            } catch (err) {

                console.log(
                    "SEAT MAP ERROR",
                    err?.response?.data ||
                    err.message
                );

                return rejectWithValue(

                    err?.response?.data?.message ||

                    err?.response?.data?.errors?.[0]?.message ||

                    "Seat map failed"
                );
            }
        }
    );
// ======================================================
// 3️⃣ BOOK FLIGHT
// ======================================================

export const bookFlightThunk =
    createAsyncThunk(
        "flights/bookFlight",

        async (
            {
                offerId,
                passengers,
                selectedSeats,
                payment,
                flight,
            },
            { rejectWithValue }
        ) => {

            try {

                const res =
                    await API.post(
                        "/flights/book",
                        {
                            offerId,
                            passengers,
                            selectedSeats,
                            payment,
                            flight,
                        }
                    );

                return res.data;

            } catch (err) {

                return rejectWithValue(
                    err.response?.data?.message ||
                    "Booking failed"
                );
            }
        }
    );

// ======================================================
// 4️⃣ GET BOOKINGS
// ======================================================

export const getBookingsThunk =
    createAsyncThunk(
        "flights/getBookings",

        async (
            _,
            { rejectWithValue }
        ) => {

            try {

                const res =
                    await API.get(
                        "/flights/bookings"
                    );

                return (
                    res.data?.bookings || []
                );

            } catch (err) {

                return rejectWithValue(
                    err.response?.data?.message ||
                    "Failed to fetch bookings"
                );
            }
        }
    );

// ======================================================
// 5️⃣ GET SINGLE BOOKING
// ======================================================

export const getSingleBookingThunk =
    createAsyncThunk(
        "flights/getSingleBooking",

        async (
            id,
            { rejectWithValue }
        ) => {

            try {

                const res =
                    await API.get(
                        `/flights/bookings/${id}`
                    );

                return (
                    res.data?.booking || null
                );

            } catch (err) {

                return rejectWithValue(
                    err.response?.data?.message ||
                    "Failed to fetch booking"
                );
            }
        }
    );

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {

    // SEARCH
    flights: [],
    requestedPassengers: {},
    totalFlights: 0,

    // SEATS
    seats: [],
    totalSeats: 0,
    tempOrderId: null,

    // BOOKINGS
    bookings: [],
    singleBooking: null,

    // BOOK
    bookedFlight: null,

    // COMMON
    loading: false,
    error: null,
};

// ======================================================
// SLICE
// ======================================================

const flightSlice = createSlice({

    name: "flights",

    initialState,

    reducers: {

        clearFlights:
            (state) => {

                state.flights = [];

                state.totalFlights = 0;

                state.requestedPassengers = {};
            },

        clearSeats:
            (state) => {

                state.seats = [];

                state.totalSeats = 0;

                state.tempOrderId = null;
            },

        clearBooking:
            (state) => {

                state.bookedFlight = null;

                state.singleBooking = null;
            },

        clearFlightError:
            (state) => {

                state.error = null;
            },
    },

    extraReducers:
        (builder) => {

            builder

                // ==================================================
                // SEARCH FLIGHTS
                // ==================================================

                .addCase(
                    getFlightsThunk.pending,
                    (state) => {

                        state.loading = true;

                        state.error = null;
                    }
                )

                .addCase(
                    getFlightsThunk.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.flights =
                            action.payload?.flights || [];

                        state.requestedPassengers =
                            action.payload
                                ?.requestedPassengers || {};

                        state.totalFlights =
                            action.payload
                                ?.totalFlights || 0;
                    }
                )

                .addCase(
                    getFlightsThunk.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.error =
                            action.payload;
                    }
                )

                // ==================================================
                // GET SEAT MAP
                // ==================================================

                .addCase(
                    getSeatMapThunk.pending,
                    (state) => {

                        state.loading = true;

                        state.error = null;
                    }
                )

                .addCase(
                    getSeatMapThunk.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.seats =
                            action.payload?.seats || [];

                        state.totalSeats =
                            action.payload?.totalSeats || 0;

                        state.tempOrderId =
                            action.payload?.tempOrderId || null;
                    }
                )

                .addCase(
                    getSeatMapThunk.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.error =
                            action.payload;
                    }
                )

                // ==================================================
                // BOOK FLIGHT
                // ==================================================

                .addCase(
                    bookFlightThunk.pending,
                    (state) => {

                        state.loading = true;

                        state.error = null;
                    }
                )

                .addCase(
                    bookFlightThunk.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.bookedFlight =
                            action.payload;
                    }
                )

                .addCase(
                    bookFlightThunk.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.error =
                            action.payload;
                    }
                )

                // ==================================================
                // GET BOOKINGS
                // ==================================================

                .addCase(
                    getBookingsThunk.pending,
                    (state) => {

                        state.loading = true;

                        state.error = null;
                    }
                )

                .addCase(
                    getBookingsThunk.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.bookings =
                            action.payload || [];
                    }
                )

                .addCase(
                    getBookingsThunk.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.error =
                            action.payload;
                    }
                )

                // ==================================================
                // GET SINGLE BOOKING
                // ==================================================

                .addCase(
                    getSingleBookingThunk.pending,
                    (state) => {

                        state.loading = true;

                        state.error = null;
                    }
                )

                .addCase(
                    getSingleBookingThunk.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.singleBooking =
                            action.payload;
                    }
                )

                .addCase(
                    getSingleBookingThunk.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.error =
                            action.payload;
                    }
                );
        },
});

export const {

    clearFlights,

    clearSeats,

    clearBooking,

    clearFlightError,

} = flightSlice.actions;

export default flightSlice.reducer;