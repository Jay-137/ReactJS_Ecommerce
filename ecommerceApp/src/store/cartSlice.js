import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice";
const cartSlice=createSlice({
  name:'cart',
  //hydrating initial cart state from localstorage
  initialState:JSON.parse(localStorage.getItem("cartState"))|| {
    items:[],
    totalQuantity:0
  },
  reducers:{
    addToCart(state,action){
      const newItem=action.payload;
      const existingItem=state.items.find(item=>item.id===newItem.id);
      state.totalQuantity++;
      if(!existingItem){
        state.items.push({...newItem,quantity:1});
      }
      else{
        existingItem.quantity++;
      }
    },
    removeFromCart(state,action){
      const id=action.payload;
      const existing=state.items.find(item=>item.id===id);
      if(existing){
        state.totalQuantity--;
        if(existing.quantity===1)
          state.items=state.items.filter(item=>item.id!==id)
        else
          existing.quantity--;
      }
    },
    clearCart(state,action){
      state.items=[];
      state.totalQuantity=0;
    }
  },
  extraReducers:(builder)=>{
    builder.addCase(logout,(state)=>{
      state.items=[];
      state.totalQuantity=0;
    });
  }

});

export const {addToCart,removeFromCart,clearCart}=cartSlice.actions;
export default cartSlice.reducer;