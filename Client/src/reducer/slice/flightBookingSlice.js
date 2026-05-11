import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ CREATE BOOKING
export const createFlightBookingThunk =
    createAsyncThunk(
        "flightBooking/create",

        async (bookingData, { rejectWithValue }) => {
            try {
                const res = await axios.post(
                    "http://localhost:5004/api/flight-bookings/book",
                    bookingData
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

// ✅ GET ALL BOOKINGS
export const getFlightBookingsThunk =
    createAsyncThunk(
        "flightBooking/getAll",

        async (_, { rejectWithValue }) => {
            try {
                const res = await axios.get(
                    "http://localhost:5004/api/flight-bookings"
                );

                return res.data.bookings;
            } catch (err) {
                return rejectWithValue(
                    err.response?.data?.message ||
                    "Failed to fetch bookings"
                );
            }
        }
    );

// ✅ GET SINGLE BOOKING
export const getSingleFlightBookingThunk =
    createAsyncThunk(
        "flightBooking/getSingle",

        async (id, { rejectWithValue }) => {
            try {
                const res = await axios.get(
                    `http://localhost:5004/api/flight-bookings/${id}`
                );

                return res.data.booking;
            } catch (err) {
                return rejectWithValue(
                    err.response?.data?.message ||
                    "Failed to fetch booking"
                );
            }
        }
    );

const initialState = {
    bookings: [],
    bookingDetails: null,

    loading: false,
    success: false,
    error: null,
};

const flightBookingSlice = createSlice({
    name: "flightBooking",

    initialState,

    reducers: {
        clearBookingState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },

        clearBookingDetails: (state) => {
            state.bookingDetails = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ✅ CREATE BOOKING
            .addCase(
                createFlightBookingThunk.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                createFlightBookingThunk.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.success = true;

                    state.bookings.unshift(
                        action.payload.booking
                    );

                    state.bookingDetails =
                        action.payload.booking;
                }
            )

            .addCase(
                createFlightBookingThunk.rejected,
                (state, action) => {
                    state.loading = false;
                    state.success = false;

                    state.error = action.payload;
                }
            )

            // ✅ GET ALL BOOKINGS
            .addCase(
                getFlightBookingsThunk.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getFlightBookingsThunk.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.bookings = action.payload;
                }
            )

            .addCase(
                getFlightBookingsThunk.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error = action.payload;
                }
            )

            // ✅ GET SINGLE BOOKING
            .addCase(
                getSingleFlightBookingThunk.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getSingleFlightBookingThunk.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.bookingDetails =
                        action.payload;
                }
            )

            .addCase(
                getSingleFlightBookingThunk.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error = action.payload;
                }
            );
    },
});

export const {
    clearBookingState,
    clearBookingDetails,
} = flightBookingSlice.actions;

export default flightBookingSlice.reducer;