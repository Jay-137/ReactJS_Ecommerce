import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { navigateTo } from "../utils/navigateFunction";

const Register=()=>{
  const [formData,setFormData]=useState({name:"",email:"",password:""});
  const [fieldError,setFieldError]=useState({});
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  };
  const validate=()=>{
    const newErrors={};
    if(!formData.name)
      newErrors.name="Name is required";
    if(!formData.email)
      newErrors.email="Email is required";
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email="Invalid email format";
    if(!formData.password)
      newErrors.password="Password is required";
    if(formData.password.length<8)
      newErrors.password="Password must be atleast 8 characters long";
    setFieldError(newErrors);
    return Object.keys(newErrors).length===0;
  }
  const handleSubmit=async (e)=>{
    e.preventDefault();
    if(!validate())return;
    setError(null);
    setLoading(true);
    try{
      await axiosInstance.post("/api/users/register",{
        ...formData,
        role:"USER"
      });
      setSuccess(true);
    }
    catch(err){
      setError(err.response?.data?.message || "Registeration Failed. Please try again.");
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
      if (!success) return;

      if (countdown === 0) {
        navigateTo("/login");
        return;
      }

      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }, [success, countdown]);


  return (
  <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition">
    
    <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
      
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Create an Account
      </h2>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl text-center w-75">
            
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              🎉 Registration Successful!
            </h3>

            <p className="text-gray-700 dark:text-gray-300">
              Redirecting to login in{" "}
              <span className="font-bold">{countdown}</span>...
            </p>

          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Name */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 
              ${fieldError.name ? "border-red-500 ring-red-300" : "border-gray-300 dark:border-gray-600"}
              bg-white dark:bg-gray-700 text-gray-800 dark:text-white`}
          />
          {fieldError.name && (
            <p className="text-red-500 text-xs mt-1">{fieldError.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 
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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {/* Footer */}
      <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Log in
        </Link>
      </p>
    </div>
  </div>
);
}
export default Register;