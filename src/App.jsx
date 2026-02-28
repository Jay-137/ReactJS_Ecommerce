import { createBrowserRouter,RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import { ThemeProvider } from "./context/ThemeContext";

const router=createBrowserRouter([
  {
    path:"/",
    element:<RootLayout/>,
    children:[
      {
        index:true,
        element:<Home/>
      },
      {
        path:"cart",
        element:<Cart/>
      }
    ]
  }
])
function App() {
  return (
    <ThemeProvider>
        <RouterProvider router={router}/>
    </ThemeProvider>
  )
}

export default App;
