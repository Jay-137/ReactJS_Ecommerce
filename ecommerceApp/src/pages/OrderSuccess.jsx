import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";  
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { clearCart } from "../store/cartSlice";
const OrderSuccess=()=>{
  const [countdown,setCountdown]=useState(5);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  useEffect(()=>{
    if(countdown===0)
      navigate("/",{replace:true});

    const timer=setTimeout(()=>{
      setCountdown(prev=>prev-1);
    },1000);

    return ()=>clearTimeout(timer);

  },[countdown,navigate])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">

        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Payment Successful!
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for your order. We are processing it now and will send you a confirmation email shortly.
        </p>

        {/* Countdown */}
        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-6">
          Redirecting to home in {countdown} seconds...
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
export default OrderSuccess;