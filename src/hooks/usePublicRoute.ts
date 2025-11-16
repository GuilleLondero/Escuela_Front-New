import { useAuthUser } from "./useAuthUser";

type PublicRouteDecision = {
  redirectTo: string | null;
};

export function usePublicRoute(): PublicRouteDecision {
  const { token, userType } = useAuthUser();

  if (!token) {
    return { redirectTo: null };
  }

  if (userType === "alumno") {
    return { redirectTo: "/dashboard" };
  }

  if (userType === "admin") {
    return { redirectTo: "/mi-perfil" };
  }

  return { redirectTo: "/login" };
}

