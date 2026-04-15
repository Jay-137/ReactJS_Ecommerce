import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";  
const OrderSuccess=()=>{
  const [countdown,setCountdown]=useState(5);
  const navigate=useNavigate();
  useEffect(()=>{
    if(countdown===0)
      navigate("/",{replace:true});
    const timer=setTimeout(()=>{
      setCountdown(prev=>prev-1);
    },1000);
    return ()=>clearTimeout(timer);
  },[countdown,navigate])
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-6 text-center px-4">
      <div className="text-6xl">🎉</div>
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Order Placed Successfully!</h2>
      <p className="text-xl text-gray-600 dark:text-gray-300">
        Thank you for your purchase. Your items will be shipped shortly.
      </p>
      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-8">
        Redirecting to home in {countdown} seconds...
      </p>
    </div>
  );
}
export default OrderSuccess;