import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slice/adminSlice";
import packageReducer from "./slice/packageSlice";
import pageReducer from "./slice/pageSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    package: packageReducer,
    page: pageReducer,
  },
});