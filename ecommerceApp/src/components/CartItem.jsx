import React from "react";

const CartItem = ({ item, onDecrease }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow gap-4">
      
      <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
        {/* Assumes you made the backend fix to return imageUrl */}
        <img 
          src={item.imageUrl || "https://via.placeholder.com/64"} 
          alt={item.productName} 
          className="w-16 h-16 object-contain bg-white rounded shrink-0" 
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 sm:line-clamp-1">
            {item.productName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            ${item.price.toFixed(2)} x {item.quantity}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-0 pt-4 sm:pt-0 border-gray-200 dark:border-gray-700">
        <p className="font-bold text-lg text-gray-800 dark:text-white">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button 
          onClick={() => onDecrease(item.productId, item.quantity)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors whitespace-nowrap cursor-pointer"
        >
          Remove 1
        </button>
      </div>
    </div>
  );
}
export default React.memo(CartItem);