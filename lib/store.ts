import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "@/components/storage";
import productsReducer from "./features/products/productSlice";
import cartsReducer from "./features/carts/cartSlice";
import { cartListenerMiddleware } from "./features/carts/cartMIddleware";
import verificationReducer from "./features/verification/verificationSlice";

import medicationsReducer from "./features/medi-cart/medicartSlice" 

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["carts"],
};

const rootReducer = combineReducers({
  products: productsReducer,
  carts: cartsReducer,
  verification: verificationReducer,
  medicart : medicationsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(cartListenerMiddleware.middleware),
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

const store = makeStore().store;

// Infer the type of the store
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };