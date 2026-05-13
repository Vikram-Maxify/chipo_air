import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slice/adminSlice";
import packageReducer from "./slice/packageSlice";
import pageReducer from "./slice/pageSlice";
import travelOfferReducer from "./slice/travelOfferSlice";
import bannerReducer from "./slice/bannerSlice";


export const store = configureStore({
  reducer: {
    admin: adminReducer,
    package: packageReducer,
    page: pageReducer,
    travelOffer: travelOfferReducer,
    banner: bannerReducer,
  
  },
});