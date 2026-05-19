"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store";
import CartInit from "./CartInit";

const GlobalStoreProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CartInit />
        {children}
      </PersistGate>
    </Provider>
  );
};

export default GlobalStoreProvider;
