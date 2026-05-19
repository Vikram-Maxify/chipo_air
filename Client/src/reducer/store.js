import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import flightsReducer from "./slice/flightsSlice";
import pageReducer from "./slice/pageSlice";
import packageReducer from "./slice/packageSlice";
import bookingReducer from "./slice/flightBookingSlice";
import paymentReducer from "./slice/paymentSlice";
import userOfferReducer from "./slice/userOfferSlice";
import bannerSliceReducer from "./slice/userBannerSlice";
import destinationReducer from "./slice/destinationSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    flights: flightsReducer,
    page: pageReducer,
    package: packageReducer,
    flightBooking: bookingReducer,
    payment: paymentReducer,
    userOffer: userOfferReducer,
    userBanner: bannerSliceReducer,
    destination: destinationReducer,
  },
});

export default store;