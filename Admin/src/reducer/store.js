import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slice/adminSlice";
import packageReducer from "./slice/packageSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    package: packageReducer,
  },
});