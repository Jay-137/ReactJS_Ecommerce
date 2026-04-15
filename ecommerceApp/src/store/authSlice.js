import { createSlice } from "@reduxjs/toolkit";

const savedAuth=JSON.parse(localStorage.getItem("authState"));
const initState=savedAuth || {isAuthenticated:false,user:null};
const authSlice=createSlice({
  name:"auth",
  initialState:initState,
  reducers:{
    login(state,action){
      state.user={ name: action.payload };
      state.isAuthenticated=true;
    },
    logout(state){
      state.user=null;
      state.isAuthenticated=false;
    }
  }
});

export const {login,logout}=authSlice.actions;
export default authSlice.reducer;