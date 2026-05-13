// reducer/slice/bannerSlice.js

import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import API from "../axios";

// ================= CREATE BANNER =================

export const createBanner =
    createAsyncThunk(
        "banner/create",
        async (
            formData,
            thunkAPI
        ) => {
            try {
                const {
                    data,
                } =
                    await API.post(
                        "/banners",
                        formData,
                        {
                            headers:
                                {
                                    "Content-Type":
                                        "multipart/form-data",
                                },
                        }
                    );

                return data.banner;
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

// ================= UPDATE BANNER =================

export const updateBanner =
    createAsyncThunk(
        "banner/update",
        async (
            {
                id,
                formData,
            },
            thunkAPI
        ) => {
            try {
                const {
                    data,
                } =
                    await API.put(
                        `/banners/${id}`,
                        formData,
                        {
                            headers:
                                {
                                    "Content-Type":
                                        "multipart/form-data",
                                },
                        }
                    );

                return data.banner;
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

// ================= DELETE BANNER =================

export const deleteBanner =
    createAsyncThunk(
        "banner/delete",
        async (
            id,
            thunkAPI
        ) => {
            try {
                await API.delete(
                    `/banners/${id}`
                );

                return id;
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

// ================= GET ALL BANNERS (ADMIN) =================

export const getAllBannersAdmin =
    createAsyncThunk(
        "banner/getAllAdmin",
        async (
            _,
            thunkAPI
        ) => {
            try {
                const {
                    data,
                } =
                    await API.get(
                        "/banners/admin/all"
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

const bannerSlice =
    createSlice({
        name: "banner",

        initialState: {
            banners: [],
            loading: false,
            error: null,
            success: false,
        },

        reducers: {
            clearBannerState:
                (
                    state
                ) => {
                    state.loading = false;
                    state.error = null;
                    state.success = false;
                },
        },

        extraReducers:
            (
                builder
            ) => {
                builder

                    // ===== CREATE =====

                    .addCase(
                        createBanner.pending,
                        (
                            state
                        ) => {
                            state.loading = true;
                            state.error = null;
                        }
                    )

                    .addCase(
                        createBanner.fulfilled,
                        (
                            state,
                            action
                        ) => {
                            state.loading = false;
                            state.success = true;

                            state.banners.unshift(
                                action.payload
                            );
                        }
                    )

                    .addCase(
                        createBanner.rejected,
                        (
                            state,
                            action
                        ) => {
                            state.loading = false;

                            state.error =
                                action.payload;
                        }
                    )

                    // ===== UPDATE =====

                    .addCase(
                        updateBanner.pending,
                        (
                            state
                        ) => {
                            state.loading = true;
                            state.error = null;
                        }
                    )

                    .addCase(
                        updateBanner.fulfilled,
                        (
                            state,
                            action
                        ) => {
                            state.loading = false;
                            state.success = true;

                            state.banners =
                                state.banners.map(
                                    (
                                        banner
                                    ) =>
                                        banner._id ===
                                        action
                                            .payload
                                            ._id
                                            ? action.payload
                                            : banner
                                );
                        }
                    )

                    .addCase(
                        updateBanner.rejected,
                        (
                            state,
                            action
                        ) => {
                            state.loading = false;

                            state.error =
                                action.payload;
                        }
                    )

                    // ===== DELETE =====

                    .addCase(
                        deleteBanner.pending,
                        (
                            state
                        ) => {
                            state.loading = true;
                            state.error = null;
                        }
                    )

                    .addCase(
                        deleteBanner.fulfilled,
                        (
                            state,
                            action
                        ) => {
                            state.loading = false;
                            state.success = true;

                            state.banners =
                                state.banners.filter(
                                    (
                                        banner
                                    ) =>
                                        banner._id !==
                                        action.payload
                                );
                        }
                    )

                    .addCase(
                        deleteBanner.rejected,
                        (
                            state,
                            action
                        ) => {
                            state.loading = false;

                            state.error =
                                action.payload;
                        }
                    )

                    // ===== GET ALL =====

                    .addCase(
                        getAllBannersAdmin.pending,
                        (
                            state
                        ) => {
                            state.loading = true;
                            state.error = null;
                        }
                    )

                    .addCase(
                        getAllBannersAdmin.fulfilled,
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
                        getAllBannersAdmin.rejected,
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
} = bannerSlice.actions;

export default
    bannerSlice.reducer;