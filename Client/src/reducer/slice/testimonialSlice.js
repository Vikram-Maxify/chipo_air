// redux/slices/testimonialSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../axios";

// ==========================================
// GET ALL TESTIMONIALS
// ==========================================

export const getAllTestimonials = createAsyncThunk(
  "testimonial/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await API.get(`/testimonial/all`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ==========================================
// GET SINGLE TESTIMONIAL
// ==========================================

export const getSingleTestimonial = createAsyncThunk(
  "testimonial/getSingle",
  async (id, thunkAPI) => {
    try {
      const response = await API.get(`/testimonial/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ==========================================
// SLICE
// ==========================================

const testimonialSlice = createSlice({
  name: "testimonial",

  initialState: {
    loading: false,
    testimonials: [],
    testimonial: null,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET ALL
      .addCase(getAllTestimonials.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload.data || [];
      })
      .addCase(getAllTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET SINGLE
      .addCase(getSingleTestimonial.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonial = action.payload.data || null;
      })
      .addCase(getSingleTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default testimonialSlice.reducer;