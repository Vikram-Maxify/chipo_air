// reducer/slice/userBannerSlice.js

import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import API from "../axios";

// ================= GET ACTIVE BANNERS =================

export const getActiveBanners =
    createAsyncThunk(
        "userBanner/getAll",
        async (
            _,
            thunkAPI
        ) => {
            try {
                const {
                    data,
                } =
                    await API.get(
                        "/banners"
                    );

                return data;
            } catch (
                error
            ) {
                return thunkAPI.rejectWithValue(
                    error
                        .response
                        ?.data ||
                        error.message
                );
            }
        }
    );

// ================= SLICE =================

const userBannerSlice =
    createSlice({
        name: "userBanner",

        initialState: {
            banners: [],
            loading: false,
            error: null,
        },

        reducers: {
            clearBannerState:
                (
                    state
                ) => {
                    state.loading = false;
                    state.error = null;
                },
        },

        extraReducers:
            (
                builder
            ) => {
                builder

                    // ===== GET ACTIVE BANNERS =====

                    .addCase(
                        getActiveBanners.pending,
                        (
                            state
                        ) => {
                            state.loading = true;
                            state.error = null;
                        }
                    )

                    .addCase(
                        getActiveBanners.fulfilled,
                        (
                            state,
                            action
                        ) => {
                            state.loading = false;

                            state.banners =
                                action.payload;
                        }
                    )

                    .addCase(
                        getActiveBanners.rejected,
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
    clearBannerState,
} = userBannerSlice.actions;

export default
    userBannerSlice.reducer;