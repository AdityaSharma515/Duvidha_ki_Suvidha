import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import complaintReducer from "../features/complaints/complaintSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    complaints: complaintReducer,
  },
});

export default store;
