import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../axios"; 

// =======================
// CREATE PACKAGE
// =======================
export const createPackage = createAsyncThunk(
    "package/create",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await API.post("/packages/create-package", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data.package;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// =======================
// UPDATE PACKAGE
// =======================
export const updatePackage = createAsyncThunk(
    "package/update",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const res = await API.put(`/packages/update-package/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data.package;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// =======================
// GET ALL PACKAGES
// =======================
export const getPackages = createAsyncThunk(
    "package/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.get("/packages");
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// =======================
// GET SINGLE PACKAGE
// =======================
export const getSinglePackage = createAsyncThunk(
    "package/getOne",
    async (slug, { rejectWithValue }) => {
        try {
            const res = await API.get(`/package/${slug}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// =======================
// DELETE PACKAGE
// =======================
export const deletePackage = createAsyncThunk(
    "package/delete",
    async (id, { rejectWithValue }) => {
        try {
            await API.delete(`/packages/package/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// =======================
// SLICE
// =======================
const packageSlice = createSlice({
    name: "package",
    initialState: {
        packages: [],
        singlePackage: null,
        loading: false,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder

            // CREATE
            .addCase(createPackage.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPackage.fulfilled, (state, action) => {
                state.loading = false;
                state.packages.unshift(action.payload);
            })
            .addCase(createPackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE
            .addCase(updatePackage.fulfilled, (state, action) => {
                state.packages = state.packages.map((pkg) =>
                    pkg._id === action.payload._id ? action.payload : pkg
                );
            })

            // GET ALL
            .addCase(getPackages.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = action.payload;
            })
            .addCase(getPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET ONE
            .addCase(getSinglePackage.fulfilled, (state, action) => {
                state.singlePackage = action.payload;
            })

            // DELETE
            .addCase(deletePackage.fulfilled, (state, action) => {
                state.packages = state.packages.filter(
                    (pkg) => pkg._id !== action.payload
                );
            });
    },
});

export default packageSlice.reducer;