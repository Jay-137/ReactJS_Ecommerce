import { createBrowserRouter,RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
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
        path:"login",
        element:<Login/>
      },{
        path:"register",
        element:<Register/>
      },{
        path:"/product/:id",
        element:<ProductDetail/>
      },
      {
        element:<ProtectedRoute/>,
        children:[
          {
            path:"cart",
            element:<Cart/>
          },
          {
            path:"checkout",
            element:<Checkout/>
          },
          { 
            path: "order-success", 
            element: <OrderSuccess />
          },
          { path: "dashboard",
            element: <UserDashboard /> 
          }
        ]
      },
      {
        element:<ProtectedRoute requireAdmin={true}/>,
        children:[{
          path:"admin",
          element:<AdminDashboard/>
        }
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
