import { useEffect, useState } from "react";
import { fetchProducts } from "../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { addToCart } from "../store/cartSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { data, status, error, pagination } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);

  // Added state to handle mobile filter toggling
  const [showFilters, setShowFilters] = useState(false);

  const [query, setQuery] = useState({
    pageNo: 0,
    pageSize: 5,
    sortBy: "id",
    sortDir: "desc",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: ""
  });

  useEffect(() => {
    const debounceFn = setTimeout(() => {
      const activeQuery = { ...query };
      dispatch(fetchProducts(activeQuery));
    }, 500);
    return () => clearTimeout(debounceFn);
  }, [query, dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setQuery(prev => ({ ...prev, [name]: value, pageNo: 0 })); 
  };

  const handlePageChange = (newPage) => {
    setQuery(prev => ({ ...prev, pageNo: newPage }));
  };

  return (
    <div className="p-4 sm:p-8 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Filters - Removed 'sticky top-20' to make it stable at the top */}
      <aside className="w-full md:w-1/4 flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-fit">
        
        {/* Header with Mobile Toggle Button */}
        <div className="flex justify-between items-center border-b pb-2 md:border-none md:pb-0">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Filters</h3>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded text-sm font-semibold"
          >
            {showFilters ? "Hide" : "Show"}
          </button>
        </div>
        
        {/* Filter Inputs - Hidden on mobile unless toggled, always flex on md+ screens */}
        <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col gap-6 mt-2 md:mt-0`}>
          
          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Category</label>
            <input 
              type="text" 
              name="category" 
              placeholder="e.g. Electronics" 
              value={query.category} 
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Brand */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Brand</label>
            <input 
              type="text" 
              name="brand" 
              placeholder="e.g. Samsung" 
              value={query.brand} 
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Price Range */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 w-1/2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Min Price ($)</label>
              <input 
                type="number" 
                name="minPrice" 
                placeholder="0" 
                min="0"
                value={query.minPrice} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Max Price ($)</label>
              <input 
                type="number" 
                name="maxPrice" 
                placeholder="Max" 
                min="0"
                value={query.maxPrice} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Sort By</label>
            <select 
              name="sortBy" 
              value={query.sortBy} 
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer"
            >
              <option value="id">Newest Arrivals</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Sort Direction */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Direction</label>
            <select 
              name="sortDir" 
              value={query.sortDir} 
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          
          {/* Reset Filters Button */}
          <button
            onClick={() => setQuery({ pageNo: 0, pageSize: 5, sortBy: "id", sortDir: "desc", category: "", brand: "", minPrice: "", maxPrice: "" })}
            className="mt-2 w-full py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="w-full md:w-3/4 flex flex-col">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Our Products</h2>
        
        {status === "Loading" && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {status === "Failed" && (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl font-semibold text-red-500">Error: {error}</div>
          </div>
        )}

        {status === "Success" && data.length === 0 && (
          <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
            No products found matching your criteria.
          </div>
        )}

        {status === "Success" && data.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-[#eae9e9] dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col transition-transform hover:scale-105 hover:bg-[#c1c1c1] p-2 dark:hover:bg-[#1a222e]"
                >
                  <Link to={`/product/${product.id}`} className="flex flex-col grow">
                    <div className="h-48 p-4 bg-white rounded-t-lg flex justify-center items-center overflow-hidden">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="max-h-full object-contain transition-transform duration-300 hover:scale-110"
                        />
                      ) : (
                        <div className="text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col grow">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                        {product.brand} | {product.category}
                      </p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-auto">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                  
                  <button 
                    onClick={() => {
                      if (!isAuthenticated) toast.error("You must be logged in to add items to cart!");
                      else {
                        dispatch(addToCart({productId:product.id,quantity:1}));
                        toast.success("Added item to cart!");
                      }
                    }}
                    className="cursor-pointer mx-2 mb-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-auto">
              <button 
                onClick={() => handlePageChange(pagination.pageNo - 1)}
                disabled={pagination.pageNo === 0}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 disabled:opacity-50 rounded text-gray-800 dark:text-white cursor-pointer transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Previous
              </button>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Page {pagination.pageNo + 1} of {pagination.totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(pagination.pageNo + 1)}
                disabled={pagination.isLast}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 disabled:opacity-50 rounded text-gray-800 dark:text-white cursor-pointer transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Home;