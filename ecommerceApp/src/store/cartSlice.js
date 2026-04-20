import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice";
import { act } from "react";
const cartSlice=createSlice({
  name:'cart',
  initialState:{
    cartId:null,
    items:[],
    totalQuantity:0
  },
  reducers:{
    setCart(state,action){
      state.cartId=action.payload.id;
      state.items=action.payload.items;
      state.totalQuantity=action.payload.items.reduce((sum,cur)=>sum+cur.quantity,0);
    },
    clearCart(state){
      state.items=[];
      state.totalQuantity=0;
      state.cartId=null;
    }
  },
  extraReducers:(builder)=>{
    builder.addCase(logout,(state)=>{
      state.items=[];
      state.totalQuantity=0;
      state.cartId=null;
    });
  }

});

export const {setCart,clearCart}=cartSlice.actions;
export default cartSlice.reducer;