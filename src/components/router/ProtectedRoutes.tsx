import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";

function ProtectedRoutes() {
  const location = useLocation();
  const { redirectTo, replace } = useProtectedRoute(location.pathname);

  if (redirectTo) {
    return <Navigate to={redirectTo} replace={replace} />;
  }

  return <Outlet />;
}

export default ProtectedRoutes;
