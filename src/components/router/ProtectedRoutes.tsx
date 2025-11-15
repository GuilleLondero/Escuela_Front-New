import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoutes() {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Si no hay token, redirigimos al login:
  if (!token) {
    return <Navigate to="/login" />;
  }
  // Obtener información del usuario:
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = user.type;

  // Definir rutas permitidas por tipo de usuario:
  const alumnoRoutes = ["/dashboard", "/profile", "/myPayments" ];
  const adminRoutes = ["/mi-perfil", "/gestion-alumnos", "/gestion-pagos", "/gestion-carreras"];

  // Rutas heredadas (mantenemos por compatibilidad)
  const legacyRoutes = ["/dashboard", "/profile", "/notifications"];

  // Verificar si el usuario está intentando acceder a una ruta no permitida
  const currentPath = location.pathname;

  if (userType === "alumno") {
    // Si es alumno y está en ruta no permitida, redirigir a su perfil:
    if (!alumnoRoutes.includes(currentPath) && !legacyRoutes.includes(currentPath)) {
      return <Navigate to="/profile" replace />;
    }
  }

  if (userType === "admin") {
    // Si es admin y está en ruta no permitida:
    if (currentPath === "/mis-pagos") {
      return <Navigate to="/mi-perfil" replace />;
    }
    // Si está en la raíz redirigir a su perfil
    /*if (currentPath === "/" || currentPath === "/dashboard") {
      return <Navigate to="/mi-perfil" replace />;
    }*/
  }
  return <Outlet />;
}

export default ProtectedRoutes;