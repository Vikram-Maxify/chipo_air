import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import flightsReducer from "./slice/flightsSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    flights: flightsReducer
  },
});

export default store;