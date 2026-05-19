import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
};

// Auth slice thay thế (lưu token + user)
const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
