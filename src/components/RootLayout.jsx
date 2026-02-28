import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
const RootLayout=()=>{
    return(
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white transition-colors duration-300 ">
        <Navbar/>
        <main className="max-w-7xl mx-auto">
          <Outlet/>
        </main>
      </div>
    )
  
}
export default RootLayout;