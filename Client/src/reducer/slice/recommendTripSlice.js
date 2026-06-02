// src/redux/slice/recommendTripSlice.js

import { createSlice } from "@reduxjs/toolkit";
import API from "../axios";

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  loading: false,

  trips: [],
  trip: null,

  error: null,
};

// ==========================================
// SLICE
// ==========================================

const recommendTripSlice = createSlice({
  name: "recommendTrip",

  initialState,

  reducers: {
    // ==========================================
    // COMMON
    // ==========================================

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // ==========================================
    // GET ALL TRIPS
    // ==========================================

    getAllTripsSuccess: (state, action) => {
      state.loading = false;
      state.trips = action.payload.data;
    },

    // ==========================================
    // GET SINGLE TRIP
    // ==========================================

    getSingleTripSuccess: (state, action) => {
      state.loading = false;
      state.trip = action.payload.data;
    },
  },
});

// ==========================================
// EXPORT ACTIONS
// ==========================================

export const {
  setLoading,
  setError,
  clearError,

  getAllTripsSuccess,
  getSingleTripSuccess,
} = recommendTripSlice.actions;

// ==========================================
// GET ALL TRIPS (USER)
// ==========================================

export const fetchAllTrips = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const { data } = await API.get("/recommend-trip/all");

    dispatch(getAllTripsSuccess(data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  }
};

// ==========================================
// GET SINGLE TRIP (USER)
// ==========================================

export const fetchSingleTrip = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const { data } = await API.get(`/recommend-trip/${id}`);

    dispatch(getSingleTripSuccess(data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  }
};

// ==========================================
// EXPORT REDUCER
// ==========================================

export default recommendTripSlice.reducer;
