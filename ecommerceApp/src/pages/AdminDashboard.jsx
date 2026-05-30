import { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-hot-toast';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  // --- UI State ---
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'orders', 'products'

  // --- Product State ---
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', brand: '', featured: false
  });

  // --- Analytics State ---
  const [analyticsOrders, setAnalyticsOrders] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // --- NEW: Order Management State ---
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderPagination, setOrderPagination] = useState({ pageNo: 0, totalPages: 0, isLast: true });
  
  // Matches your OrderQueryDto
  const [orderQuery, setOrderQuery] = useState({
    pageNo: 0,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDir: 'desc',
    status: '',
    userId: '',
    start: '',
    end: ''
  });

  // ==========================================
  // FETCH FUNCTIONS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setProductLoading(true);
      const response = await axiosInstance.get('/api/products?pageNo=0&pageSize=100');
      setProducts(response.data.content);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setProductLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      // Fetch a large chunk without strict filters just for charting overall health
      const response = await axiosInstance.get('/api/orders/all?pageNo=0&pageSize=500&sortBy=createdAt&sortDir=desc');
      setAnalyticsOrders(response.data.content);
    } catch (error) {
      toast.error("Failed to load platform analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchPaginatedOrders = async () => {
    try {
      setOrderLoading(true);
    
      const response = await axiosInstance.get('/api/orders/all', { params:orderQuery });
      
      setOrders(response.data.content);
      setOrderPagination({
        pageNo: response.data.pageNo,
        totalPages: response.data.totalPages,
        isLast: response.data.isLast
      });
    } catch (error) {
      toast.error("Failed to load orders table");
    } finally {
      setOrderLoading(false);
    }
  };

  // ==========================================
  // EFFECTS
  // ==========================================

  // Load baseline data on mount
  useEffect(() => {
    fetchProducts();
    fetchAnalytics();
  }, []);

  // Re-fetch orders table whenever the query parameters change
  useEffect(() => {
    fetchPaginatedOrders();
  }, [orderQuery]);

  // ==========================================
  // HANDLERS & COMPUTED DATA
  // ==========================================

  const handleOrderFilterChange = (e) => {
    const { name, value } = e.target;
    setOrderQuery(prev => ({ ...prev, [name]: value, pageNo: 0 }));
  };

  const clearOrderFilters = () => {
    setOrderQuery({
      pageNo: 0, pageSize: 10, sortBy: 'createdAt', sortDir: 'desc',
      status: '', userId: '', start: '', end: ''
    });
  };

  // --- Product Handlers ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const openModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name, description: product.description, price: product.price,
        category: product.category, brand: product.brand, featured: product.featured || false
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', category: '', brand: '', featured: false });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axiosInstance.delete(`/api/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const isProcessing = toast.loading("Saving product...");
    try {
      let productId = editingId;
      if (editingId) {
        await axiosInstance.put(`/api/products/${editingId}`, formData);
      } else {
        const res = await axiosInstance.post('/api/products', formData);
        productId = res.data.id; 
      }

      if (imageFile && productId) {
        toast.loading("Uploading image...", { id: isProcessing });
        const imgData = new FormData();
        imgData.append("image", imageFile);
        await axiosInstance.post(`/api/products/${productId}/image`, imgData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      toast.success(editingId ? "Product updated!" : "Product created!", { id: isProcessing });
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product", { id: isProcessing });
    }
  };

  // --- Analytics Processing ---
  const revenueData = useMemo(() => {
    return [...analyticsOrders].reverse().map(order => ({
      date: new Date(order.createdAt || Date.now()).toLocaleDateString(),
      revenue: order.totalAmount || 0 
    }));
  }, [analyticsOrders]);

  const statusData = useMemo(() => {
    const counts = analyticsOrders.reduce((acc, order) => {
      const status = order.status || 'UNKNOWN';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [analyticsOrders]);


  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      
      {/* Header & Tabs */}
      <div className="mb-8 border-b dark:border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Admin Control Panel</h1>
        
        <div className="flex gap-4 overflow-x-auto">
          {['overview', 'orders', 'products'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-t-lg font-semibold uppercase tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* TAB 1: OVERVIEW (ANALYTICS)                */}
      {/* ========================================== */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Platform Revenue</h3>
            <div className="h-64">
              {analyticsLoading ? <div className="h-full flex justify-center items-center">Loading...</div> :
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="date" stroke="#8884d8" />
                    <YAxis stroke="#8884d8" />
                    <Tooltip wrapperClassName="dark:bg-gray-700 dark:text-white" />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              }
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Global Order Statuses</h3>
            <div className="h-64">
               {analyticsLoading ? <div className="h-full flex justify-center items-center">Loading...</div> :
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
               }
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: ORDER MANAGEMENT                    */}
      {/* ========================================== */}
      {activeTab === 'orders' && (
        <div className="animate-fade-in">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Filter Orders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold dark:text-gray-300">Status</label>
                <select name="status" value={orderQuery.status} onChange={handleOrderFilterChange} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETE">Completed</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold dark:text-gray-300">User ID</label>
                <input type="number" name="userId" placeholder="Exact ID" value={orderQuery.userId} onChange={handleOrderFilterChange} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold dark:text-gray-300">Start Date</label>
                <input type="date" name="start" value={orderQuery.start} onChange={handleOrderFilterChange} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold dark:text-gray-300">End Date</label>
                <input type="date" name="end" value={orderQuery.end} onChange={handleOrderFilterChange} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>

              <button onClick={clearOrderFilters} className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded font-semibold transition cursor-pointer">
                Clear Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden overflow-x-auto">
            {orderLoading ? (
              <div className="p-8 text-center dark:text-white">Loading orders...</div>
            ) : (
              <>
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      <th className="py-3 px-4 font-semibold">Order ID</th>
                      <th className="py-3 px-4 font-semibold">Date</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan="5" className="py-6 text-center text-gray-500">No orders found matching criteria.</td></tr>
                    ) : (
                      orders.map(order => (
                        <tr key={order.orderId} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                          <td className="py-3 px-4 text-gray-800 dark:text-gray-200">#{order.orderId}</td>
                          
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{new Date(order.createdAt || Date.now()).toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {order.status || 'UNKNOWN'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-gray-800 dark:text-white">${(order.totalAmount || 0).toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                
                {/* Order Pagination */}
                <div className="p-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => setOrderQuery(prev => ({ ...prev, pageNo: prev.pageNo - 1 }))}
                    disabled={orderPagination.pageNo === 0}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 disabled:opacity-50 rounded text-gray-800 dark:text-white cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-gray-600 dark:text-gray-300">
                    Page {orderPagination.pageNo + 1} of {orderPagination.totalPages || 1}
                  </span>
                  <button 
                    onClick={() => setOrderQuery(prev => ({ ...prev, pageNo: prev.pageNo + 1 }))}
                    disabled={orderPagination.isLast}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 disabled:opacity-50 rounded text-gray-800 dark:text-white cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: INVENTORY (PRODUCTS)                */}
      {/* ========================================== */}
      {activeTab === 'products' && (
        <div className="animate-fade-in">
          <div className="flex justify-end mb-4">
            <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition cursor-pointer">
              + Add New Product
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden overflow-x-auto">
            {productLoading ? (
              <div className="p-8 text-center dark:text-white">Loading inventory...</div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    <th className="py-3 px-4 font-semibold">Image</th>
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Price</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4">
                        <img src={product.imageUrl || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 object-cover rounded" />
                      </td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-medium">{product.name}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">${product.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{product.category}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button onClick={() => openModal(product)} className="text-blue-500 hover:text-blue-700 font-semibold cursor-pointer">Edit</button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700 font-semibold cursor-pointer">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* PRODUCT FORM MODAL                         */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              {editingId ? "Edit Product" : "Create New Product"}
            </h2>
            
            <form onSubmit={handleProductSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Price ($)</label>
                  <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Category</label>
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-gray-300">
                  Product Image (Leaves current image if blank)
                </label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={handleInputChange} className="w-4 h-4 cursor-pointer" />
                <label htmlFor="featured" className="font-semibold dark:text-gray-300 cursor-pointer">Feature this product on homepage?</label>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 transition cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition cursor-pointer">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;