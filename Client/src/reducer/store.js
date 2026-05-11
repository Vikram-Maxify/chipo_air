import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import flightsReducer from "./slice/flightsSlice";
import pageReducer from "./slice/pageSlice";
import packageReducer from "./slice/packageSlice";
import bookingReducer from "./slice/flightBookingSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    flights: flightsReducer,
    page: pageReducer,
    package: packageReducer,
    flightBooking: bookingReducer,
  },
});

export default store;