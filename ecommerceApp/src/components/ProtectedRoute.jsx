import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";

const ProtectedRoute=({requireAdmin=false})=>{
  const {isAuthenticated,user}=useSelector(state=>state.auth);
  if(!isAuthenticated)
    return <Navigate to="/login" replace/>
  if(requireAdmin && user?.role!=="ADMIN"){
    return <Navigate to="/" replace />;
  }
  else
    return <Outlet/>;
}
export default ProtectedRoute;