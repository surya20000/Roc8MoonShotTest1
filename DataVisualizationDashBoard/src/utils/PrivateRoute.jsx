import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { getUserInfo } from "../reducers/userSlice";

const PrivateRoutes = () => {
  const currUser = useSelector(getUserInfo);

  return <>{currUser ? <Outlet /> : <Navigate to="/" />}</>;
};

export default PrivateRoutes;
