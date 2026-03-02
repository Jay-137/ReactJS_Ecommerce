import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart } from "../store/cartSlice";
import CartItem from "../components/CartItem";
import { useCallback,useMemo } from "react";

const Cart=()=>{
  // console.log("loading cart");
  const {items,totalQuantity}=useSelector(state=>state.cart);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const onRemove=useCallback((id)=>{
    dispatch(removeFromCart(id));
  },[dispatch]);

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
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex justify-between items-center">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Total Items: {totalQuantity}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">Total: ${totalPrice.toFixed(2)}</p>
        </div>
        <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
    );
}
export default Cart;