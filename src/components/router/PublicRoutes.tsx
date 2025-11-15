import { Navigate, Outlet } from "react-router-dom";

function PublicRoutes() {
  const token = localStorage.getItem("token");

  if (token) {
    // Si ya está logueado, redirigir según el tipo de usuario
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userType = user.type;

    if (userType === "alumno") {
      return <Navigate to="/dashboard" />;
      

    } else if (userType === "admin") {
      return <Navigate to="/mi-perfil" />;

    } else {
      // Si no tiene tipo definido, redirigir al Login! dashboard legacy
      return <Navigate to="/login" />;
    }
  }

  return <Outlet />;
}

export default PublicRoutes;