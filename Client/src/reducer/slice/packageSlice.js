import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../axios"; 


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
            const res = await API.get(`/packages/${slug}`);
            return res.data;
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

            
    },
});

export default packageSlice.reducer;