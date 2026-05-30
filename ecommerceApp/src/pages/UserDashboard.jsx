import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';

// Colors for the Pie Chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const UserDashboard = () => {
  const { user } = useSelector(state => state.auth);
  
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ pageNo: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Hits your paginated backend endpoint
        const response = await axiosInstance.get(`/api/orders/my-history?pageNo=${pagination.pageNo}&pageSize=10`);
        setOrders(response.data.content);
        setPagination(prev => ({ ...prev, totalPages: response.data.totalPages }));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order history.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [pagination.pageNo]);

  // Process data for charts
  const spendingData = useMemo(() => {
    // Reverse so chronological order goes left to right on the chart
    return [...orders].reverse().map(order => ({
      date: new Date(order.createdAt || Date.now()).toLocaleDateString(), // Fallback if your backend names it differently
      total: order.totalAmount || 0 
    }));
  }, [orders]);

  const statusData = useMemo(() => {
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status || 'UNKNOWN';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.keys(statusCounts).map(key => ({
      name: key,
      value: statusCounts[key]
    }));
  }, [orders]);

  if (loading && orders.length === 0) {
    return <div className="p-8 text-center text-xl dark:text-white">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Here is your account overview and order history.</p>
      </div>

      {error && <div className="mb-4 text-red-500 font-semibold">{error}</div>}

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        {/* Spending Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Spending Over Time</h3>
          <div className="h-64">
            {spendingData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="date" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip wrapperClassName="dark:bg-gray-700 dark:text-white" />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
            )}
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Orders by Status</h3>
          <div className="h-64">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Order History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Orders</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <th className="py-3 px-6 font-semibold">Order ID</th>
                <th className="py-3 px-6 font-semibold">Date</th>
                <th className="py-3 px-6 font-semibold">Status</th>
                <th className="py-3 px-6 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    You haven't placed any orders yet.
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.orderId} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                    <td className="py-4 px-6 text-gray-800 dark:text-gray-200">#{order.orderId}</td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-gray-100 text-gray-700'}`}
                      >
                        {order.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-gray-800 dark:text-white">
                      ${(order.totalAmount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setPagination(prev => ({ ...prev, pageNo: prev.pageNo - 1 }))}
              disabled={pagination.pageNo === 0}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 disabled:opacity-50 rounded text-gray-800 dark:text-white"
            >
              Previous
            </button>
            <span className="text-gray-600 dark:text-gray-300">
              Page {pagination.pageNo + 1} of {pagination.totalPages}
            </span>
            <button 
              onClick={() => setPagination(prev => ({ ...prev, pageNo: prev.pageNo + 1 }))}
              disabled={pagination.pageNo >= pagination.totalPages - 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 disabled:opacity-50 rounded text-gray-800 dark:text-white"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;