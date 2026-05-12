import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import API from "../axios";



// CREATE PAYMENT
export const createPayment = createAsyncThunk(
    "payment/createPayment",
    async (paymentData, thunkAPI) => {
        try {
            const { data } = await API.post(
                "/payment/create-payment",
                paymentData
            );

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);



// VERIFY PAYMENT
export const verifyPayment = createAsyncThunk(
    "payment/verifyPayment",
    async (paymentData, thunkAPI) => {
        try {
            const { data } = await API.post(
                "/payment/verify-payment",
                paymentData
            );

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);



// PAYMENT FAILED
export const paymentFailed = createAsyncThunk(
    "payment/paymentFailed",
    async (paymentData, thunkAPI) => {
        try {
            const { data } = await API.post(
                "/payment/payment-failed",
                paymentData
            );

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);




const paymentSlice = createSlice({
    name: "payment",

    initialState: {
        loading: false,

        order: null,

        payment: null,

        success: false,

        verified: false,

        failed: false,

        error: null,
    },

    reducers: {
        clearPaymentState: (state) => {
            state.loading = false;

            state.order = null;

            state.payment = null;

            state.success = false;

            state.verified = false;

            state.failed = false;

            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder


            // CREATE PAYMENT
            .addCase(createPayment.pending, (state) => {
                state.loading = true;

                state.error = null;
            })

            .addCase(createPayment.fulfilled, (state, action) => {
                state.loading = false;

                state.success = true;

                state.order = action.payload.order;

                state.payment = action.payload.payment;
            })

            .addCase(createPayment.rejected, (state, action) => {
                state.loading = false;

                state.error = action.payload;
            })



            // VERIFY PAYMENT
            .addCase(verifyPayment.pending, (state) => {
                state.loading = true;

                state.error = null;
            })

            .addCase(verifyPayment.fulfilled, (state) => {
                state.loading = false;

                state.verified = true;
            })

            .addCase(verifyPayment.rejected, (state, action) => {
                state.loading = false;

                state.error = action.payload;
            })



            // PAYMENT FAILED
            .addCase(paymentFailed.pending, (state) => {
                state.loading = true;

                state.error = null;
            })

            .addCase(paymentFailed.fulfilled, (state) => {
                state.loading = false;

                state.failed = true;
            })

            .addCase(paymentFailed.rejected, (state, action) => {
                state.loading = false;

                state.error = action.payload;
            });
    },
});



export const { clearPaymentState } = paymentSlice.actions;

export default paymentSlice.reducer;