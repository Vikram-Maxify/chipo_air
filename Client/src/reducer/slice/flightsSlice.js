import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 Async thunk
export const getFlightsThunk = createAsyncThunk(
    "flights/getFlights",
    async (
        {
            from,
            to,
            departure_date,
            return_date,
            passengers,
        },
        { rejectWithValue }
    ) => {
        try {
            // ✅ Build query params
            const params = new URLSearchParams({
                from,
                to,
                date: departure_date,
            });

            // ✅ optional params
            if (return_date) {
                params.append("return_date", return_date);
            }

            if (passengers) {
                params.append("passengers", passengers);
            }

            const res = await axios.get(
                `http://localhost:5004/api/flights/search?${params.toString()}`
            );

            const flights = res.data?.flights || [];

            // ✅ SAVE TO SESSION STORAGE
            sessionStorage.setItem(
                "flights",
                JSON.stringify(flights)
            );

            return flights;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message ||
                "Something went wrong"
            );
        }
    }
);

// ✅ LOAD FROM SESSION STORAGE
const savedFlights =
    JSON.parse(sessionStorage.getItem("flights")) || [];

const initialState = {
    flights: savedFlights,
    loading: false,
    error: null,
};

const flightSlice = createSlice({
    name: "flights",
    initialState,

    reducers: {
        clearFlights: (state) => {
            state.flights = [];
            state.error = null;

            // ❌ clear from storage
            sessionStorage.removeItem("flights");
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getFlightsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                getFlightsThunk.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.flights = action.payload;

                    // ✅ update storage
                    sessionStorage.setItem(
                        "flights",
                        JSON.stringify(action.payload)
                    );
                }
            )

            .addCase(
                getFlightsThunk.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    },
});

export const { clearFlights } = flightSlice.actions;

export default flightSlice.reducer;