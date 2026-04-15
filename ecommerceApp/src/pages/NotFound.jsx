import { useNavigate } from "react-router-dom";
const NotFound=()=>{
  const navigate=useNavigate();
  return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6 text-center px-4">
      <div className="text-8xl font-bold text-blue-600 dark:text-blue-400">404</div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Page Not Found</h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md">
        Oops! It looks like the page you are looking for has been moved or doesn't exist.
      </p>
      <button 
        onClick={() => navigate('/')}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors cursor-pointer"
      >
        Return to Home
      </button>
    </div>
  );

}
export default NotFound;