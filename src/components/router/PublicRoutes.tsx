import { Navigate, Outlet } from "react-router-dom";
import { usePublicRoute } from "../../hooks/usePublicRoute";

function PublicRoutes() {
  const { redirectTo } = usePublicRoute();

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  return <Outlet />;
}

export default PublicRoutes;
