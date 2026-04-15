import { useEffect } from "react";
import { fetchProducts } from "../store/productSlice";
import { useDispatch,useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import {toast} from "react-hot-toast";
const Home=()=>{
  const dispatch=useDispatch();
  const {data,status,error}=useSelector(state=>state.products);
  const {isAuthenticated}=useSelector(state=>state.auth);
  useEffect(()=>{
    if(status==="Idle")
      dispatch(fetchProducts());
  },[status,dispatch]);
  if(status==="Loading"){
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300">Loading products...</div>
      </div>
    );
  }
  if(status==="Failed"){
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
      </div>
    )
  }
  return(<div className="p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Featured Products</h2>
      
      {/* Responsive Grid System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((product) => (
          <div 
            key={product.id} 
            className="bg-[#eae9e9] dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col transition-transform hover:scale-105 
            hover:bg-[#c1c1c1] p-2 dark:hover:bg-[#1a222e]"
          >
            {/* Product Image */}
            <div className="h-48 p-4 bg-white flex justify-center items-center">
              <img 
                src={product.image} 
                alt={product.title} 
                className="max-h-full object-contain"
              />
            </div>
            
            {/* Product Details */}
            <div className="p-4 flex flex-col grow">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 mb-2">
                {product.title}
              </h3>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-auto">
                ${product.price.toFixed(2)}
              </p>
              
              {/* Add to Cart Button (We will wire this up next!) */}
              <button className="cursor-pointer mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              onClick={()=>{
                if(!isAuthenticated)
                  toast.error("You must be logged in to add items to cart!");
                else{
                  toast.success("Added item to cart!")
                dispatch(addToCart(product))
                }
              }}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>);
  
}
export default Home;