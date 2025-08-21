import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import appData from '../utils/appData.json';
import { JSX } from 'react';
import {ImageKey} from '@/assets';

interface ProductItem {
  id:number;
  name: string;
  image: ImageKey;
}

interface Product {
  id: number;
  name: string;
  subProduct?: {
    cellphonesaccessories?: { id: number; name: string }[];
    cellphones?: { id: number; name: string }[];
    wearableTechnology?:{ id: number; name: string }[];
    Computeraccessories?: { id: number; name: string }[];
  };
}

interface AppState {
  map(arg0: (cat: any) => JSX.Element): import("react").ReactNode;
  users: { id: number; name: string; role: string }[];
  products: Product[];
  serviceNdSoltuions:{ id: number; name: string}[];
  brands:{id: number; name: string}[];
  productItems:ProductItem[];
}

const initialState: AppState = appData as unknown as AppState;

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<{ id: number; name: string; role: string }>) {
      state.users.push(action.payload);
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    }
  }
});

export const { addUser, addProduct } = dataSlice.actions;
export default dataSlice.reducer;
