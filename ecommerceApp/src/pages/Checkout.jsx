import { useEffect,useRef,useState } from "react";
import {loadStripe} from "@stripe/stripe-js";
import axiosInstance from "../api/axiosInstance";
import { useTheme } from "../context/ThemeContext";
import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

// Initialize Stripe outside component render to avoid recreating the object
const stripePromise=loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout=()=>{
  const [clientSecret,setClientSecret]=useState("");
  const [err,setErr]=useState(null);
  const hasFetched=useRef(false);
  const {theme}=useTheme();
  useEffect(()=>{
     const getClientSecret=async ()=>{
      try{
        const response=await axiosInstance.post("/api/orders/checkout");
        setClientSecret(response.data.clientSecret);
      }
      catch(error){
        setErr("Failed to initialize checkout. Please try again.");
      }
    }
    if(hasFetched.current)return;
    hasFetched.current=true;
    getClientSecret();
  }
  ,[]);

  if (err) {
    return <div className="p-8 text-center text-red-500 font-bold">{err}</div>;
  }
  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  const options={
    clientSecret,
    appearance:{
      theme:theme==="dark"?"night":"stripe",
    },
  }
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
        Secure Checkout
      </h2>
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm/>
          </Elements>
        </div>
    </div>
  )

}

export default Checkout;