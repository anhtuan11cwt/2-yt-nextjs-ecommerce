import { combineReducers, configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import { persistReducer, persistStore } from "redux-persist";
import { createStorage } from "@/lib/redux/storage";
import authReducer from "@/redux/features/authSlice";
import cartReducer, { CART_MUTATION_TYPES } from "@/redux/features/cartSlice";

const rootReducer = combineReducers({
	auth: authReducer,
	cart: cartReducer,
});

const persistConfig = {
	key: "root",
	storage: createStorage(),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const cartSyncMiddleware = (store) => (next) => (action) => {
	const result = next(action);

	if (CART_MUTATION_TYPES.includes(action.type)) {
		const state = store.getState();
		if (state.auth?.token) {
			const { cart } = state.cart;
			axios.post("/api/cart/sync", { items: cart }).catch((_err) => {});
		}
	}

	return result;
};

export const store = configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false }).concat(
			cartSyncMiddleware,
		),
	reducer: persistedReducer,
});

export const persistor = persistStore(store);
