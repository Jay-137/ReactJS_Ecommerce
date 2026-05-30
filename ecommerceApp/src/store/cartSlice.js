import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice";
import axiosInstance from "../api/axiosInstance";

//GET
export const fetchCart=createAsyncThunk(
"cart/fetch",
  async (_,{rejectWithValue})=>{
    try{
      const respone=await axiosInstance.get("/api/cart");
      return respone.data;
    }catch(err){
      return rejectWithValue(err.respone?.data?.message || "Failed to fetch Cart");
    }
}
);
//POST
export const addToCart=createAsyncThunk(
"cart/add",
  async ({productId,quantity=1},{rejectWithValue})=>{
    try{
      const respone=await axiosInstance.post("/api/cart",{
        productId,quantity
      });
      return respone.data;
    }catch(err){
      return rejectWithValue(err.respone?.data?.message || "Failed to add to Cart");
    }
}
);

//PUT
export const updateCart=createAsyncThunk(
"cart/update",
async({productId,quantity},{rejectWithValue})=>{
  try{
    const response=await axiosInstance.put("/api/cart/update",null,{
      params:{
        productId,
        quantity
      }
    });
    return response.data;
  }catch(err){
    return rejectWithValue(err.response?.data?.message || "Failed to update cart")
  }
}
);

//Delete
export const deleteCart=createAsyncThunk(
  "cart/delete",
  async({productId},{rejectWithValue})=>{
    try{
      const response=await axiosInstance.delete("/api/cart/remove",{
        params:{
          productId
        }
      });
      return response.data;
    }catch(err){
      return rejectWithValue(err.response?.data?.message || "Failed to delete item in cart")
    }
  }
)

const syncWithCart=(state,action)=>{
  state.cartId=action.payload.cartId;
  state.items=action.payload.items || [];
  state.status="Success";
  state.totalQuantity=action.payload.items.reduce((sum,cur)=>sum+cur.quantity,0);
}

const cartSlice=createSlice({
  name:'cart',
  initialState:{
    cartId:null,
    items:[],
    totalQuantity:0,
    status:"Idle",
    error:null
  },
  reducers:{
    setCart(state,action){
      state.cartId=action.payload.cartId;
      state.items=action.payload.items;
      state.totalQuantity=action.payload.items.reduce((sum,cur)=>sum+cur.quantity,0);
    },
    clearCart(state){
      state.items=[];
      state.totalQuantity=0;
    }
  },
  extraReducers:(builder)=>{
    builder.addCase(logout,(state)=>{
      state.items=[];
      state.totalQuantity=0;
      state.cartId=null;
      state.status="Idle";
    })
    .addCase(fetchCart.pending,(state,action)=>{
      state.status="Loading";
      state.error=null;
    })
    .addCase(fetchCart.fulfilled,syncWithCart)
    .addCase(addToCart.fulfilled,syncWithCart)
    .addCase(updateCart.fulfilled,syncWithCart)
    .addCase(deleteCart.fulfilled,syncWithCart);
  }

});

export const {setCart,clearCart}=cartSlice.actions;
export default cartSlice.reducer;