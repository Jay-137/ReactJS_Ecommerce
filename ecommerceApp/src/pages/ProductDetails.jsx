import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { addToCart } from "../store/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch=useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Hits GET /api/products/{id}
        setLoading(true);
        const response = await axiosInstance.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        );
  if (error) return <div className="p-8 text-center text-xl text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 cursor-pointer"
      >
        &larr; Back to Products
      </button>

      <div className="flex flex-col md:flex-row gap-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        
        {/* Left: Image */}
        <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-100 rounded-xl p-6">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="max-h-96 object-contain" />
          ) : (
            <span className="text-gray-400">No image available</span>
          )}
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <span className="text-sm font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-2">
            {product.brand} | {product.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {product.name}
          </h1>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
            ${product.price.toFixed(2)}
          </p>
          
          <div className="prose dark:prose-invert mb-8 text-gray-700 dark:text-gray-300">
            <p>{product.description}</p>
          </div>

          <button 
            onClick={() => {
              if (!isAuthenticated) toast.error("You must be logged in to add items to cart!");
              else 
                {
                  dispatch(addToCart({productId:product.id,quantity:1}));
                  toast.success("Added to cart!");
                }
            }}
            className="w-full md:w-auto py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;