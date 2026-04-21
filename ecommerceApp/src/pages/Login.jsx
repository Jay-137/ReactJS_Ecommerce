import { useState } from "react";
import { navigateTo } from "../utils/navigateFunction";
import {useDispatch} from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { setCredentials } from "../store/authSlice";
import { Link } from "react-router-dom";


const Login=()=>{
  const [formData,setFormData]=useState({email:"",password:""});
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(false);
  const [fieldError,setFieldError]=useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch=useDispatch();

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  }
  const validate=()=>{
    const newErrors={};
    if(!formData.email)
      newErrors.email="Email is required";
    if(!formData.password)
      newErrors.password="Password is required";
    setFieldError(newErrors);
    return Object.keys(newErrors).length===0;
  }
  const handleSubmit=async (e)=>{
    e.preventDefault();
    if(!validate())return;
    setError(null);
    setLoading(true);
    try{
      const response=await axiosInstance.post("/api/users/login",formData);
      const {user,token}=response.data;
      dispatch(setCredentials({user,token}));
      navigateTo("/");
    }catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
  }
}
return (
  <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition">
    
    <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
      
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Welcome Back 👋
      </h2>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition
              ${fieldError.email ? "border-red-500 ring-red-300" : "border-gray-300 dark:border-gray-600"}
              bg-white dark:bg-gray-700 text-gray-800 dark:text-white`}
          />
          {fieldError.email && (
            <p className="text-red-500 text-xs mt-1">{fieldError.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 transition
                ${fieldError.password ? "border-red-500 ring-red-300" : "border-gray-300 dark:border-gray-600"}
                bg-white dark:bg-gray-700 text-gray-800 dark:text-white`}
            />

            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:cursor-pointer"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {fieldError.password && (
            <p className="text-red-500 text-xs mt-1">{fieldError.password}</p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg font-semibold text-white 
            bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Footer */}
      <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
        Don’t have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Sign up
        </Link>
      </p>
    </div>
  </div>
);
};

export default Login;