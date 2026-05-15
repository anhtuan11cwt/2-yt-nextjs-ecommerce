import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { createStorage } from "@/lib/redux/storage";
import authReducer from "./reducers/authReducer";

// Kết hợp tất cả reducer
const rootReducer = combineReducers({
	auth: authReducer,
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
