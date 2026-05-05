import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../axios";

// ================= SEND OTP =================
export const sendOtp = createAsyncThunk(
    "auth/sendOtp",
    async (data, { rejectWithValue }) => {
        try {
            const res = await API.post("/auth/send-otp", data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// ================= VERIFY OTP =================
export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async (data, { rejectWithValue }) => {
        try {
            const res = await API.post("/auth/verify-otp", data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// ================= SET PASSWORD =================
export const setPassword = createAsyncThunk(
    "auth/setPassword",
    async (data, { rejectWithValue }) => {
        try {
            const res = await API.post("/auth/set-password", data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// ================= LOGIN =================
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (data, { rejectWithValue }) => {
        try {
            const res = await API.post("/auth/login", data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// ================= GET PROFILE =================
export const getProfile = createAsyncThunk(
    "auth/getProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.get("/auth/profile");
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// ================= LOGOUT =================
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.post("/auth/logout");
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        error: null,
        success: false,
        otpSent: false,
        verified: false,
        user: null,
        isAuthenticated: false,
    },

    reducers: {
        resetAuthState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.otpSent = false;
            state.verified = false;
        },
    },

    extraReducers: (builder) => {
        builder

            // SEND OTP
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // VERIFY OTP
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.loading = false;
                state.verified = true;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // SET PASSWORD
            .addCase(setPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setPassword.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(setPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // PROFILE
            .addCase(getProfile.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })

            // LOGOUT
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;