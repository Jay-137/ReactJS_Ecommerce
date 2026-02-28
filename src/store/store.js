import {configureStore} from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import ProductReducer from "./productSlice";
const store=configureStore({
  reducer:{
    cart:cartReducer,
    products:ProductReducer,
  }
});
export default store;




// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProducts } from '../store/productSlice';

// const Home = () => {
//   const dispatch = useDispatch();
//   // We will use this selector more extensively in the next step
//   const { status, error } = useSelector((state) => state.products);

//   useEffect(() => {
//     // Only fetch if we haven't already (prevents refetching if we navigate away and back)
//     if (status === 'idle') {
//       dispatch(fetchProducts());
//     }
//   }, [status, dispatch]);

//   return (
//     <div className="p-8">
//       <h2 className="text-2xl font-bold mb-4">Latest Products</h2>
      
//       {/* Temporary UI to check our state */}
//       {status === 'loading' && <p>Loading products...</p>}
//       {status === 'failed' && <p className="text-red-500">{error}</p>}
//       {status === 'succeeded' && <p className="text-green-500">Products loaded successfully! Check Redux DevTools.</p>}
//     </div>
//   );
// };

// export default Home;