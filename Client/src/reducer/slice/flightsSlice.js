import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 Async thunk - Direct API call without session storage
export const getFlightsThunk = createAsyncThunk(
    "flights/getFlights",
    async (
        {
            from,
            to,
            departure_date,
            return_date,
            passengers,
            travelClass,
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

            if (travelClass) {
                params.append("class", travelClass);
            }

            const res = await axios.get(
                `http://localhost:5004/api/flights/search?${params.toString()}`
            );

            const flights = res.data?.flights || [];

            // ❌ REMOVED session storage save
            // sessionStorage.setItem("flights", JSON.stringify(flights));

            return flights;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message ||
                "Something went wrong"
            );
        }
    }
);

// ✅ Initial state - No saved flights from session storage
const initialState = {
    flights: [], // Start with empty array
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
            // ❌ Removed session storage removal
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
                    // ❌ REMOVED session storage save
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