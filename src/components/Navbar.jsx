import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  // Consume the context
  const { theme, toggleTheme } = useTheme();
  const cartQuantity=useSelector(state=>state.cart.totalQuantity);
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center transition-colors duration-300">
      <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
        TechStore
      </Link>
      
      <div className="flex items-center gap-6 font-semibold text-gray-700 dark:text-gray-200">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
        <Link to="/cart" className="hover:text-blue-600 dark:hover:text-blue-400">Cart ({cartQuantity})</Link>
        
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer "
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;