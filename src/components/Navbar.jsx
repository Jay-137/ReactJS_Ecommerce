import { useState,useRef,useEffect } from 'react'; // 1. Import useState
import { useTheme } from '../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const cartQuantity = useSelector(state => state.cart.totalQuantity);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navRef=useRef(null);
  useEffect(()=>{
  const handleClickOutside=(event)=>{
    if(navRef.current && !navRef.current.contains(event.target))
      setIsOpen(false);
  }
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  },[]);
  
  // 2. Add local state to track if the mobile menu is open
  const [isOpen, setIsOpen] = useState(false);

  const handleCartClick = () => {
    // Optional UX tweak: close the menu when they click a link!
    setIsOpen(false); 
    if (isAuthenticated) {
      navigate('/cart');
    } else {
      toast.error("Please log in to view your cart!");
    }
  };

  return (
    <nav ref={navRef} className="bg-white dark:bg-gray-800 shadow-md p-4 flex flex-wrap justify-between items-center transition-colors duration-300">
      
      {/* 3. Group the Logo and the Hamburger Button together */}
      <div className="flex justify-between items-center w-full sm:w-auto">
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400" onClick={() => setIsOpen(false)}>
          TechStore
        </Link>
        
        {/* The Hamburger Button (Only visible on small screens) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 focus:outline-none cursor-pointer"
        >
          {/* SVG for the 3 lines (Hamburger) or X (Close) depending on state */}
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* 4. The Menu Links container */}
      {/* Logic: 
          - Mobile: hidden by default, becomes flex (flex-col) if isOpen is true.
          - sm and up: ALWAYS sm:flex and sm:flex-row regardless of isOpen. 
      */}
      <div className={`
        ${isOpen ? 'flex' : 'hidden'} 
        w-full sm:flex sm:w-auto flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-4 sm:mt-0 
        font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-200
      `}>
        
        <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
        <button onClick={handleCartClick} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
          Cart ({cartQuantity})
        </button>
        
        <div className="flex items-center gap-4 sm:border-r sm:pr-4 border-gray-300 dark:border-gray-600 w-full sm:w-auto justify-center">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">Hi, {user?.name ?? "Guest"}</span>
              <button 
                onClick={() => { dispatch(logout()); setIsOpen(false); }} 
                className="text-sm font-semibold text-red-500 hover:text-red-600 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { dispatch(login("Jayanaath")); setIsOpen(false); }} 
              className="text-sm font-semibold text-blue-600 hover:text-blue-500 cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
        
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 w-full sm:w-auto rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

    </nav>
  );
};

export default Navbar;