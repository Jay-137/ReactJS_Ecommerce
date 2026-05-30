import { useDispatch, useSelector } from "react-redux";
import { updateCart, deleteCart, clearCart } from "../store/cartSlice";
import CartItem from "../components/CartItem";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { navigateTo } from "../utils/navigateFunction";

const Cart = () => {
  const { items, totalQuantity } = useSelector(state => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();

  // Smart remove: Decrease quantity by 1, or delete if it drops to 0
  const handleDecrease = useCallback((productId, currentQuantity) => {
    if (currentQuantity > 1) {
      dispatch(updateCart({ productId, quantity: currentQuantity - 1 }));
    } else {
      dispatch(deleteCart({productId}));
    }
  }, [dispatch]);

  const handleCheckout = useCallback(() => {
    // We will wire this to Stripe in Phase 4. For now, simulate checkout.
    setIsProcessing(true);
      navigateTo('/checkout');
  }, [navigateTo]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, cur) => sum + (cur.price * cur.quantity), 0)
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Your Shopping Cart</h2>
      
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <CartItem key={item.productId} onDecrease={handleDecrease} item={item} />
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Total Items: {totalQuantity}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">Total: ${totalPrice.toFixed(2)}</p>
        </div>
        
        <button 
          onClick={handleCheckout} 
          disabled={isProcessing} 
          className={`w-full sm:w-auto px-8 py-3 rounded-lg font-bold text-white transition-colors flex items-center justify-center cursor-pointer
            ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
          `}
        >
          {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
}
export default Cart;