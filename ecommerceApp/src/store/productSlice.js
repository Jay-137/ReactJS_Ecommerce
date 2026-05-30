import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";import axios from "axios";
import axiosInstance from "../api/axiosInstance";
export const fetchProducts=createAsyncThunk(
  "products/fetch",
  async (queryParams={},{rejectWithValue})=>{
    try{
      const response=await axiosInstance.get('/api/products',{
      params:queryParams
    });
    return response.data;
    }catch(err){
      return rejectWithValue(err.response?.data?.message|| "Failed to fetch products");
    }
    
  }
); 

const productSlice=createSlice({
  name:"products",
  initialState:{
    data:[],
    pagination:{
      pageNo: 0,
      pageSize: 8,
      totalElements: 0,
      totalPages: 0,
      isLast: true
    },
    status:"Idle",
    error:null
  },
  reducers:{ 

  },
  extraReducers:(builder)=>{
    builder.addCase(fetchProducts.pending,(state)=>{
      state.status="Loading";
      state.error=null;
    })
    .addCase(fetchProducts.fulfilled,(state,action)=>{
      state.status="Success";
      state.data=action.payload.content;
      state.pagination={
        pageNo: action.payload.pageNo,
          pageSize: action.payload.pageSize,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          isLast: action.payload.isLast
      }
    })
    .addCase(fetchProducts.rejected,(state,action)=>{
      state.status="Failed";
      state.error=action.payload || action.error.message;
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