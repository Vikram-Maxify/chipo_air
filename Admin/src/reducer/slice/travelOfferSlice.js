// reducer/slice/travelOfferSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../axios";

// ================= CREATE OFFER =================

export const createTravelOffer =
    createAsyncThunk(
        "travelOffer/create",
        async (formData, thunkAPI) => {
            try {
                const { data } =
                    await API.post(
                        "/travel-offers/create",
                        formData,
                        {
                            headers: {
                                "Content-Type":
                                    "multipart/form-data",
                            },
                        }
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

// ================= UPDATE OFFER =================

export const updateTravelOffer =
    createAsyncThunk(
        "travelOffer/update",
        async (
            { id, updatedData },
            thunkAPI
        ) => {
            try {
                const { data } =
                    await API.put(
                        `/travel-offers/update/${id}`,
                        updatedData
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

// ================= DELETE OFFER =================

export const deleteTravelOffer =
    createAsyncThunk(
        "travelOffer/delete",
        async (id, thunkAPI) => {
            try {
                await API.delete(
                    `/travel-offers/${id}`
                );

                return id;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data ||
                        error.message
                );
            }
        }
    );

// ================= SLICE =================

const travelOfferSlice =
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

                // ===== CREATE =====

                .addCase(
                    createTravelOffer.pending,
                    (state) => {
                        state.loading = true;
                        state.error = null;
                    }
                )

                .addCase(
                    createTravelOffer.fulfilled,
                    (state, action) => {
                        state.loading = false;
                        state.success = true;

                        state.offers.unshift(
                            action.payload
                        );
                    }
                )

                .addCase(
                    createTravelOffer.rejected,
                    (state, action) => {
                        state.loading = false;
                        state.error =
                            action.payload;
                    }
                )

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

                // ===== UPDATE =====

                .addCase(
                    updateTravelOffer.pending,
                    (state) => {
                        state.loading = true;
                    }
                )

                .addCase(
                    updateTravelOffer.fulfilled,
                    (state, action) => {
                        state.loading = false;
                        state.success = true;

                        state.offers =
                            state.offers.map(
                                (offer) =>
                                    offer._id ===
                                    action.payload._id
                                        ? action.payload
                                        : offer
                            );
                    }
                )

                .addCase(
                    updateTravelOffer.rejected,
                    (state, action) => {
                        state.loading = false;
                        state.error =
                            action.payload;
                    }
                )

                // ===== DELETE =====

                .addCase(
                    deleteTravelOffer.pending,
                    (state) => {
                        state.loading = true;
                    }
                )

                .addCase(
                    deleteTravelOffer.fulfilled,
                    (state, action) => {
                        state.loading = false;
                        state.success = true;

                        state.offers =
                            state.offers.filter(
                                (offer) =>
                                    offer._id !==
                                    action.payload
                            );
                    }
                )

                .addCase(
                    deleteTravelOffer.rejected,
                    (state, action) => {
                        state.loading = false;
                        state.error =
                            action.payload;
                    }
                );
        },
    });

export const {
    clearTravelOfferState,
} = travelOfferSlice.actions;

export default
    travelOfferSlice.reducer;