import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice.js";

export default configureStore({
  reducer: {
    user: userReducer,      
  },
});
