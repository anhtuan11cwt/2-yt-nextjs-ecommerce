import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

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
			toast.success("Sản phẩm đã được thêm vào giỏ hàng");
		},

		clearCart: (state) => {
			state.cart = [];
			state.count = 0;
			toast.success("Giỏ hàng đã được xóa");
		},

		decreaseQuantity: (state, action) => {
			const variantId = action.payload;

			const item = state.cart.find(
				(product) => product.variantId === variantId,
			);

			if (item && item.quantity > 1) {
				item.quantity -= 1;
				state.count = state.cart.reduce(
					(total, item) => total + item.quantity,
					0,
				);
			}
		},

		increaseQuantity: (state, action) => {
			const variantId = action.payload;

			const item = state.cart.find(
				(product) => product.variantId === variantId,
			);

			if (item) {
				item.quantity += 1;
				state.count = state.cart.reduce(
					(total, item) => total + item.quantity,
					0,
				);
			}
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
			toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
		},
		updateVerifiedCart: (state, action) => {
			state.cart = action.payload.products;
			state.count = action.payload.products.reduce(
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
	updateVerifiedCart,
} = cartSlice.actions;

export default cartSlice.reducer;
