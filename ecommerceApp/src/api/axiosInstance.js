import axios from "axios";
import { logout } from "../store/authSlice";
import { navigateTo } from "../utils/navigateFunction";

//prevent circular dependency due to driect import
let store;
export const injectStore=(_store)=>{
  store=_store;
}


const axiosInstance=axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

axiosInstance.interceptors.request.use(
  (config)=>{
    const token=localStorage.getItem("jwt_token");
    if(token)
      config.headers.Authorization=`Bearer ${token}`;
    return config;
  },
  (error)=>{
    return Promise.reject(error);
  }
)

axiosInstance.interceptors.response.use(
  (response)=>response,
  (error)=>{
    if ( error.response?.status === 401 &&  window.location.pathname !== "/login"){
          console.warn("Unauthorized! Clearing session...");
          if(store)
          store.dispatch(logout());
          navigateTo("/login");
    }
    return Promise.reject(error);
  }
)

export default axiosInstance;