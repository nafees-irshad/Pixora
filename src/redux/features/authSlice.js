import { createSlice } from "@reduxjs/toolkit";

const getInitialUser = () => {
  try {
    const stored = localStorage.getItem("pixora_user");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getInitialUser(),
    token: localStorage.getItem("pixora_token") || null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token || null;
      try {
        if (action.payload.user) {
          localStorage.setItem("pixora_user", JSON.stringify(action.payload.user));
        }
        if (action.payload.token) {
          localStorage.setItem("pixora_token", action.payload.token);
        }
      } catch (e) {
        console.error("Failed to save user in localStorage", e);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      try {
        localStorage.removeItem("pixora_user");
        localStorage.removeItem("pixora_token");
      } catch (e) {
        console.error("Failed to clear user from localStorage", e);
      }
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
