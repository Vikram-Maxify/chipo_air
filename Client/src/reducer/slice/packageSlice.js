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
      return res.data.packages;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
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
      return res.data.package;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
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

  reducers: {
    clearPackageError: (state) => {
      state.error = null;
    },

    clearSinglePackage: (state) => {
      state.singlePackage = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =======================
      // GET ALL
      // =======================
      .addCase(getPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
      })

      .addCase(getPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =======================
      // GET SINGLE
      // =======================
      .addCase(getSinglePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSinglePackage.fulfilled, (state, action) => {
        state.loading = false;
        state.singlePackage = action.payload;
      })

      .addCase(getSinglePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearPackageError,
  clearSinglePackage,
} = packageSlice.actions;

export default packageSlice.reducer;