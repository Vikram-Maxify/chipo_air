import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../axios";

// ================= LOGIN =================
export const adminLogin = createAsyncThunk(
  "admin/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/admin/login", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ================= PROFILE =================
export const fetchAdminProfile = createAsyncThunk(
  "admin/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/admin/profile");
      return res.data;
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

// ================= LOGOUT =================
export const adminLogout = createAsyncThunk(
  "admin/logout",
  async (_, { rejectWithValue }) => {
    try {
      await API.post("/admin/logout");
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admin: null,
    loading: false,
    error: null,
    isAuthChecked: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.isAuthChecked = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthChecked = true;
      })

      // PROFILE (AUTO LOGIN)
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.isAuthChecked = false;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchAdminProfile.rejected, (state) => {
        state.loading = false;
        state.admin = null;
        state.isAuthChecked = true;
      })

      // LOGOUT
      .addCase(adminLogout.fulfilled, (state) => {
        state.admin = null;
        state.isAuthChecked = true;
      });
  },
});

export default adminSlice.reducer;