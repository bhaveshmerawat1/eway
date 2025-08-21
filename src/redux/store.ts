'use client';

import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import productsReducer from "./productsSlice";

export const store = configureStore({
  reducer: {
    data: dataReducer,
    productsDetails: productsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
