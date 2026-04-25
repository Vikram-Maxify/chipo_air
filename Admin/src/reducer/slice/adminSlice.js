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

// ================= USERS =================

// GET ALL USERS
export const getAllUsers = createAsyncThunk(
    "admin/getUsers",
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.get("/admin/users");
            return res.data.users;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// UPDATE USER
export const updateUser = createAsyncThunk(
    "admin/updateUser",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await API.put(`/admin/user/${id}`, data);
            return res.data.user;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// DELETE USER
export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            await API.delete(`/admin/user/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// ================= SLICE =================
const adminSlice = createSlice({
    name: "admin",
    initialState: {
        admin: null,
        users: [], // 🔥 added
        loading: false,
        error: null,
        isAuthChecked: false,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder

            // ================= LOGIN =================
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

            // ================= PROFILE =================
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

            // ================= LOGOUT =================
            .addCase(adminLogout.fulfilled, (state) => {
                state.admin = null;
                state.users = []; // 🔥 clear users too
                state.isAuthChecked = true;
            })

            // ================= USERS =================

            // GET USERS
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE USER
            .addCase(updateUser.fulfilled, (state, action) => {
                state.users = state.users.map((user) =>
                    user._id === action.payload._id ? action.payload : user
                );
            })

            // DELETE USER
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(
                    (user) => user._id !== action.payload
                );
            });
    },
});

export default adminSlice.reducer;