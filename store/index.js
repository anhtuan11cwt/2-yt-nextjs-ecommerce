import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { createStorage } from "@/lib/redux/storage";
import authReducer from "@/redux/features/authSlice";
import cartReducer from "@/redux/features/cartSlice";

// Kết hợp tất cả reducer
const rootReducer = combineReducers({
	auth: authReducer,
	cart: cartReducer,
});

const persistConfig = {
	key: "root",
	storage: createStorage(),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux store với persist
export const store = configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	reducer: persistedReducer,
});

// Persistor cho redux-persist
export const persistor = persistStore(store);
