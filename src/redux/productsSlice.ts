import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface Product {
  id: number;
  name: string;
  brand: string;
  productNumber: string;
  image: string;
  category: string;
  shopCanadian: boolean;
  colourFamily: string;
  fscCertified: boolean;
}

interface ProductsState {
  items: Product[];
  sortBy: string;
  view: 'grid' | 'list';
}

const initialState: ProductsState = {
  items: [],
  sortBy: 'relevance',
  view: 'grid'
};

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const data = require("../utils/appData.json");
  console.log("===== rrrr",data);
  
  return data.productDetails;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    toggleView: (state) => {
      state.view = state.view === 'grid' ? 'list' : 'grid';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  }
});

export const { setSortBy, toggleView } = productsSlice.actions;
export default productsSlice.reducer;

