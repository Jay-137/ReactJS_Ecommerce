import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
const RootLayout=()=>{
    return(
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white transition-colors duration-300 ">
        <Navbar/>
        <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }} 
      />
        <main className="max-w-7xl mx-auto">
          <Outlet/>
        </main>
      </div>
    )
  
}
export default RootLayout;