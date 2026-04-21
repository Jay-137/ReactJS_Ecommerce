import { createSlice } from "@reduxjs/toolkit";

const savedToken=localStorage.getItem("jwt_token");
const savedUser=JSON.parse(localStorage.getItem("user"));

const initState={
  isAuthenticated:!!savedToken,
  token:savedToken||null,
  user:savedUser||null
}
const authSlice=createSlice({
  name:"auth",
  initialState:initState,
  reducers:{
    setCredentials(state,action){
      const {token,user}=action.payload;
      state.user=user;
      state.isAuthenticated=true;
      state.token=token;
      localStorage.setItem("jwt_token",token);
      localStorage.setItem("user",JSON.stringify(user));
    },
    logout(state){
      state.user=null;
      state.token=null;
      state.isAuthenticated=false;
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user");
    }
  }
});

export const {setCredentials,logout}=authSlice.actions;
export default authSlice.reducer;