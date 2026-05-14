import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { createStorage } from "@/lib/redux/storage";
import authReducer from "./reducers/authReducer";

const rootReducer = combineReducers({
	auth: authReducer,
});

const persistConfig = {
	key: "root",
	storage: createStorage(),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	reducer: persistedReducer,
});

export const persistor = persistStore(store);
