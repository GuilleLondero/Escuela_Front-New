import { useAuthUser } from "./useAuthUser";

type ProtectedRouteDecision = {
  redirectTo: string | null;
  replace?: boolean;
};

const alumnoRoutes = ["/dashboard", "/profile", "/myPayments"];
const legacyRoutes = ["/dashboard", "/profile", "/notifications"];

export function useProtectedRoute(pathname: string): ProtectedRouteDecision {
  const { token, userType } = useAuthUser();

  if (!token) {
    return { redirectTo: "/login" };
  }

  // Alumno routes remain limited to the existing allowlist + legacy support.
  if (userType === "alumno") {
    if (!alumnoRoutes.includes(pathname) && !legacyRoutes.includes(pathname)) {
      return { redirectTo: "/profile", replace: true };
    }
    return { redirectTo: null };
  }

  // Admin logic preserves the current special cases.
  if (userType === "admin" && pathname === "/mis-pagos") {
    return { redirectTo: "/mi-perfil", replace: true };
  }

  return { redirectTo: null };
}
