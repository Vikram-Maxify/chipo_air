import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../axios";

// =========================
// CREATE / UPDATE PAGE
// =========================
export const upsertPage = createAsyncThunk(
    "page/upsertPage",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await API.post("/pages/admin", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// =========================
// GET PAGE
// =========================
export const getPage = createAsyncThunk(
    "page/getPage",
    async (type, { rejectWithValue }) => {
        try {
            const res = await API.get(`/pages/${type}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// =========================
// SLICE
// =========================
const pageSlice = createSlice({
    name: "page",
    initialState: {
        page: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetPageState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // =========================
            // UPSERT
            // =========================
            .addCase(upsertPage.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(upsertPage.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.page = action.payload.page;
            })
            .addCase(upsertPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================
            // GET PAGE
            // =========================
            .addCase(getPage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPage.fulfilled, (state, action) => {
                state.loading = false;
                state.page = action.payload;
            })
            .addCase(getPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetPageState } = pageSlice.actions;
export default pageSlice.reducer;