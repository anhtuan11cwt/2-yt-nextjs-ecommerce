import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { REHYDRATE } from "redux-persist";

const initialState = {
	cart: [],
	count: 0,
};

export const fetchCartFromServer = createAsyncThunk(
	"cart/fetchFromServer",
	async (_, { rejectWithValue }) => {
		try {
			const res = await axios.get("/api/cart");
			if (res.data.success) return res.data.cart;
			return rejectWithValue(res.data.message);
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

export const syncCartToServer = createAsyncThunk(
	"cart/syncToServer",
	async (_, { getState, rejectWithValue }) => {
		try {
			const { cart } = getState().cart;
			await axios.post("/api/cart/sync", { items: cart });
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

const cartSlice = createSlice({
	extraReducers: (builder) => {
		builder
			.addCase(REHYDRATE, (state) => {
				if (state.cart?.length) {
					state.count = state.cart.reduce(
						(total, item) => total + (Number(item.quantity) || 0),
						0,
					);
				}
			})
			.addCase(fetchCartFromServer.fulfilled, (state, action) => {
				const serverCart = action.payload;
				if (serverCart.length > 0) {
					const localCart = [...state.cart];

					serverCart.forEach((serverItem) => {
						const existingIndex = localCart.findIndex(
							(localItem) =>
								localItem.productId === serverItem.productId &&
								localItem.variantId === serverItem.variantId,
						);

						if (existingIndex === -1) {
							localCart.push(serverItem);
						} else {
							localCart[existingIndex].quantity = Math.max(
								localCart[existingIndex].quantity,
								serverItem.quantity,
							);
						}
					});

					state.cart = localCart;
					state.count = localCart.reduce(
						(total, item) => total + (Number(item.quantity) || 0),
						0,
					);
				} else if (state.cart.length > 0) {
					state.cart = [];
					state.count = 0;
				}
			});
	},
	initialState,
	name: "cart",
	reducers: {
		addToCart: (state, action) => {
			const item = action.payload;
			const qty = Math.max(Number(item.quantity) || 1, 1);

			const existingItem = state.cart.find(
				(product) =>
					product.productId === item.productId &&
					product.variantId === item.variantId,
			);

			if (existingItem) {
				existingItem.quantity += qty;
			} else {
				state.cart.push({ ...item, quantity: qty });
			}

			state.count = state.cart.reduce(
				(total, item) => total + Number(item.quantity),
				0,
			);
			toast.success("Sản phẩm đã được thêm vào giỏ hàng");
		},

		clearCart: (state) => {
			if (state.cart.length === 0) return;
			state.cart = [];
			state.count = 0;
			toast.success("Giỏ hàng đã được xóa");
		},

		decreaseQuantity: (state, action) => {
			const variantId = action.payload;

			const item = state.cart.find(
				(product) => product.variantId === variantId,
			);

			if (item && Number(item.quantity) > 1) {
				item.quantity = Number(item.quantity) - 1;
				state.count = state.cart.reduce(
					(total, item) => total + Number(item.quantity),
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
				item.quantity = Number(item.quantity) + 1;
				state.count = state.cart.reduce(
					(total, item) => total + Number(item.quantity),
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
				(total, item) => total + Number(item.quantity),
				0,
			);
			toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
		},
		updateVerifiedCart: (state, action) => {
			state.cart = action.payload.products;
			state.count = action.payload.products.reduce(
				(total, item) => total + Number(item.quantity),
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

export const CART_MUTATION_TYPES = [
	"cart/addToCart",
	"cart/decreaseQuantity",
	"cart/increaseQuantity",
	"cart/removeFromCart",
	"cart/clearCart",
	"cart/updateVerifiedCart",
];

export default cartSlice.reducer;
