import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import sideBarReducer from './sideBarSlice';
import cartReducer from './cartSlice';
import searchReducer from './searchSlice';
import paymentReducer from './paymentSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      sideBar: sideBarReducer,
      cart: cartReducer,
      search: searchReducer,
      payment: paymentReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
