// reducer/slice/userOfferslice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../axios";

// ================= GET ALL OFFERS =================

export const getAllTravelOffers =
    createAsyncThunk(
        "travelOffer/getAll",
        async (_, thunkAPI) => {
            try {
                const { data } =
                    await API.get(
                        "/travel-offers/all"
                    );

                return data.data;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data ||
                        error.message
                );
            }
        }
    );

// ================= GET SINGLE OFFER =================

export const getTravelOfferById =
    createAsyncThunk(
        "travelOffer/getById",
        async (id, thunkAPI) => {
            try {
                const { data } =
                    await API.get(
                        `/travel-offers/${id}`
                    );

                return data.data;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data ||
                        error.message
                );
            }
        }
    );

// ================= SLICE =================

const userOfferslice =
    createSlice({
        name: "travelOffer",
        initialState: {
            offers: [],
            singleOffer: null,
            loading: false,
            error: null,
            success: false,
        },

        reducers: {
            clearTravelOfferState: (
                state
            ) => {
                state.loading = false;
                state.error = null;
                state.success = false;
            },
        },

        extraReducers: (builder) => {
            builder

                // ===== GET ALL =====

                .addCase(
                    getAllTravelOffers.pending,
                    (state) => {
                        state.loading = true;
                    }
                )

                .addCase(
                    getAllTravelOffers.fulfilled,
                    (state, action) => {
                        state.loading = false;
                        state.offers =
                            action.payload;
                    }
                )

                .addCase(
                    getAllTravelOffers.rejected,
                    (state, action) => {
                        state.loading = false;
                        state.error =
                            action.payload;
                    }
                )

                // ===== GET SINGLE =====

                .addCase(
                    getTravelOfferById.pending,
                    (state) => {
                        state.loading = true;
                    }
                )

                .addCase(
                    getTravelOfferById.fulfilled,
                    (state, action) => {
                        state.loading = false;
                        state.singleOffer =
                            action.payload;
                    }
                )

                .addCase(
                    getTravelOfferById.rejected,
                    (state, action) => {
                        state.loading = false;
                        state.error =
                            action.payload;
                    }
                )
        },
    });

export const {
    clearTravelOfferState,
} = userOfferslice.actions;

export default
    userOfferslice.reducer;