import { useElements, useStripe } from "@stripe/react-stripe-js"
import { useState } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";


const CheckoutForm=()=>{
  const stripe=useStripe();
  const elements=useElements();
  const [message,setMessage]=useState("");
  const [processing,setProcessing]=useState(false);
  const handleSubmit=async (e)=>{
    e.preventDefault();
    if(!stripe || !elements)return;
    setProcessing(true);

    const {error}=await stripe.confirmPayment({
      elements,
      confirmParams:{
        return_url:`${window.location.origin}/order-success`,
      },
    } 
    );
    if (error) {
      setMessage(error.message);
    }
    setProcessing(false);
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement />
      
      {message && <div className="text-red-500 text-sm">{message}</div>}
      
      <button 
        disabled={processing || !stripe || !elements} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-4"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}

export default CheckoutForm;