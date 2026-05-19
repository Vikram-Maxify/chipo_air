import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../axios";

const initialState = {
    loading: false,
    destinations: [],
    destination: null,
    error: null,
};


// ==========================================
// GET ALL DESTINATIONS
// ==========================================

export const getAllDestinations = createAsyncThunk(
    "destination/getAllDestinations",

    async (_, { rejectWithValue }) => {
        try {

            const { data } = await API.get("/destination/all");

            return data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);


// ==========================================
// GET SINGLE DESTINATION
// ==========================================

export const getSingleDestination = createAsyncThunk(
    "destination/getSingleDestination",

    async (id, { rejectWithValue }) => {
        try {

            const { data } = await API.get(`/destination/${id}`);

            return data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);


const destinationSlice = createSlice({
    name: "destination",

    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {

        builder

            // ==========================================
            // GET ALL DESTINATIONS
            // ==========================================

            .addCase(getAllDestinations.pending, (state) => {
                state.loading = true;
            })

            .addCase(getAllDestinations.fulfilled, (state, action) => {
                state.loading = false;
                state.destinations = action.payload.data;
            })

            .addCase(getAllDestinations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // ==========================================
            // GET SINGLE DESTINATION
            // ==========================================

            .addCase(getSingleDestination.pending, (state) => {
                state.loading = true;
            })

            .addCase(getSingleDestination.fulfilled, (state, action) => {
                state.loading = false;
                state.destination = action.payload.data;
            })

            .addCase(getSingleDestination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = destinationSlice.actions;

export default destinationSlice.reducer;