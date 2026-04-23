import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    sendOtpAPI,
    verifyOtpAPI,
    setPasswordAPI,
} from "../axios";

// ================= SEND OTP =================
export const sendOtp = createAsyncThunk(
    "auth/sendOtp",
    async (data, { rejectWithValue }) => {
        try {
            const res = await sendOtpAPI(data);
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
            const res = await verifyOtpAPI(data);
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
            const res = await setPasswordAPI(data);
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
        user: JSON.parse(localStorage.getItem("user")) || null,
        token: localStorage.getItem("token") || null,
        isAuthenticated: !!localStorage.getItem("token"),
    },

    reducers: {
        resetAuthState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.otpSent = false;
            state.verified = false;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.success = false;
            state.otpSent = false;
            state.verified = false;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    },

    extraReducers: (builder) => {
        builder

            // ================= SEND OTP =================
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

            // ================= VERIFY OTP =================
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

            // ================= SET PASSWORD =================
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
            });
    },
});

export const { resetAuthState, setUser, logout } = authSlice.actions;

export default authSlice.reducer;