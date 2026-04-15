import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";import axios from "axios";
export const fetchProducts=createAsyncThunk(
  "products/fetch",
  async ()=>{
    const response=await axios.get('https://fakestoreapi.com/products');
    return response.data;
  }
);

const productSlice=createSlice({
  name:"products",
  initialState:{
    data:[],
    status:"Idle",
    error:null
  },
  reducers:{

  },
  extraReducers:(builder)=>{
    builder.addCase(fetchProducts.pending,(state)=>{
      state.status="Loading";
    })
    .addCase(fetchProducts.fulfilled,(state,action)=>{
      state.status="Success";
      state.data=action.payload;
    })
    .addCase(fetchProducts.rejected,(state,action)=>{
      state.status="Failed";
      state.error=action.error.message;
    });
  }

});

export default productSlice.reducer;







/*
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 1. Create the async thunk
// The first argument is the action type prefix, the second is the payload creator
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data; 
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {}, // No synchronous reducers needed right now
  
  // 2. Handle the async actions in extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add fetched products to the items array
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
*/ 