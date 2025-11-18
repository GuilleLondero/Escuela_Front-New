type UserDetail = {
  first_name?: string;
  last_name?: string;
  email?: string;
  type?: string;
  [key: string]: unknown;
};

type StoredUser = {
  username?: string;
  userdetail?: UserDetail;
  type?: string;
  [key: string]: unknown;
};

const parseStoredUser = (rawUser: string | null): StoredUser | null => {
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

export function useAuthUser() {
  const token = localStorage.getItem("token");
  const storedUser = parseStoredUser(localStorage.getItem("user"));
  const rawType = storedUser?.type ?? storedUser?.userdetail?.type ?? null;

  const mapType = (value: unknown) => {
    if (typeof value !== "string") return null;
    const normalized = value.toLowerCase();
    if (normalized === "administrativo" || normalized === "admin") return "admin";
    if (normalized === "alumno") return "alumno";
    return normalized;
  };

  const userType = mapType(rawType);

  return {
    token,
    user: storedUser,
    userType,
  };
}
