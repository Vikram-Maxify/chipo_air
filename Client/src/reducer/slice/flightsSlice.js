import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async thunk (API call)
export const getFlightsThunk = createAsyncThunk(
  "flights/getFlights",
  async ({ from, to }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5004/api/flights/search?from=${from}&to=${to}`
      );

      return res.data.flights;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// ✅ Initial state
const initialState = {
  flights: [],
  loading: false,
  error: null,
};

// ✅ Slice
const flightSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    clearFlights: (state) => {
      state.flights = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFlightsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlightsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload;
      })
      .addCase(getFlightsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export
export const { clearFlights } = flightSlice.actions;
export default flightSlice.reducer;