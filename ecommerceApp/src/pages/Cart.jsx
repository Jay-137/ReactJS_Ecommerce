import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart } from "../store/cartSlice";
import CartItem from "../components/CartItem";
import { useCallback,useMemo, useState } from "react";
import { clearCart } from "../store/cartSlice";
import {toast} from "react-hot-toast";

const Cart=()=>{
  // console.log("loading cart");
  const {items,totalQuantity}=useSelector(state=>state.cart);
  const [isProcessing,setIsProcessing]=useState(false);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const onRemove=useCallback((id)=>{
    dispatch(removeFromCart(id));
  },[dispatch]);

  const handleCheckout = useCallback( () => {
    setIsProcessing(true);
    setTimeout(()=>{
    dispatch(clearCart());
    toast.success("Order processed!");
    navigate('/order-success');
    },3000);
    //dont ve to setprocessing to false cause componet already unmounts
  },[dispatch,navigate]);

  const totalPrice=useMemo(()=>{return items.reduce((sum,cur)=>sum+(cur.price*cur.quantity),0)},[items]);
  if(items.length===0){
    return(
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/')} // Programmatic navigation
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }
  return(
      <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Your Shopping Cart</h2>
      
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <CartItem key={item.id} onRemove={onRemove} item={item}/>
        ))}

      </div>
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
        
        <div>
          <p className="text-gray-600 dark:text-gray-400">Total Items: {totalQuantity}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">Total: ${totalPrice.toFixed(2)}</p>
        </div>
        
        {/* 2. Added w-full sm:w-auto to make the button full-width on phones for an easier tap target */}
        <button 
          onClick={handleCheckout} 
          disabled={isProcessing} 
          className={`w-full sm:w-auto px-8 py-3 rounded-lg font-bold text-white transition-colors flex items-center justify-center
            ${isProcessing 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
            }
          `}
        >
          {isProcessing ? (
             // A simple CSS spinner + text
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Proceed to Checkout'
          )}
        </button>
      </div>
    </div>
    );
}
export default Cart;