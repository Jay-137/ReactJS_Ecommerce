import { createBrowserRouter,RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";
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
        element:<ProtectedRoute/>,
        children:[
          {
            path:"cart",
            element:<Cart/>
          },
          { path: "order-success", element: <OrderSuccess /> }
        ]
      }
    ]
  },
  {
    path:"*",
    element:<NotFound/>
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
