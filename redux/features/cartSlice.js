import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	cart: [],
	count: 0,
};

const cartSlice = createSlice({
	initialState,
	name: "cart",
	reducers: {
		addToCart: (state, action) => {
			const item = action.payload;

			const existingItem = state.cart.find(
				(product) =>
					product.productId === item.productId &&
					product.variantId === item.variantId,
			);

			if (existingItem) {
				existingItem.quantity += item.quantity || 1;
			} else {
				state.cart.push({
					...item,
					quantity: item.quantity || 1,
				});
			}

			state.count = state.cart.reduce(
				(total, item) => total + item.quantity,
				0,
			);
		},

		clearCart: (state) => {
			state.cart = [];
			state.count = 0;
		},

		decreaseQuantity: (state, action) => {
			const variantId = action.payload;

			const item = state.cart.find(
				(product) => product.variantId === variantId,
			);

			if (item && item.quantity > 1) {
				item.quantity -= 1;
			}

			state.count = state.cart.reduce(
				(total, item) => total + item.quantity,
				0,
			);
		},

		increaseQuantity: (state, action) => {
			const variantId = action.payload;

			const item = state.cart.find(
				(product) => product.variantId === variantId,
			);

			if (item) {
				item.quantity += 1;
			}

			state.count = state.cart.reduce(
				(total, item) => total + item.quantity,
				0,
			);
		},

		removeFromCart: (state, action) => {
			const variantId = action.payload;

			state.cart = state.cart.filter(
				(product) => product.variantId !== variantId,
			);

			state.count = state.cart.reduce(
				(total, item) => total + item.quantity,
				0,
			);
		},
	},
});

export const {
	addToCart,
	increaseQuantity,
	decreaseQuantity,
	removeFromCart,
	clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
