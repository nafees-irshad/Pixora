import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./features/searchSlice";
import authReducer from "./features/authSlice";
import collectionReducer from "./features/collectionSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    auth: authReducer,
    collection: collectionReducer,
  },
});
