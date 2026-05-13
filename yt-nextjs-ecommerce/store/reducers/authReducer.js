import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	auth: null,
};

const authSlice = createSlice({
	initialState,
	name: "auth",
	reducers: {
		login: (state, action) => {
			state.auth = action.payload;
		},
		logout: (state) => {
			state.auth = null;
		},
	},
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
