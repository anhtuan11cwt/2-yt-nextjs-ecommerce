import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	cart: [],
};

const cartSlice = createSlice({
	initialState,
	name: "cart",
	reducers: {
		addToCart: (state, action) => {
			const existingProduct = state.cart.find(
				(item) => item.variantId === action.payload.variantId,
			);

			if (existingProduct) {
				existingProduct.quantity += action.payload.quantity;
			} else {
				state.cart.push(action.payload);
			}
		},
	},
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
