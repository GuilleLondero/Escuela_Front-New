import { useEffect, useMemo, useState } from "react";

type ProfileFormState = {
  first_name: string;
  last_name: string;
  email: string;
  type: string;
  dni?: string;
};

type StoredUser = {
  username: string;
  userdetail: ProfileFormState;
};

type UseProfileFormOptions = {
  includeDni?: boolean;
};

const buildInitialState = (includeDni?: boolean): ProfileFormState =>
  includeDni
    ? { first_name: "", last_name: "", email: "", type: "", dni: "" }
    : { first_name: "", last_name: "", email: "", type: "" };

export function useProfileForm(options?: UseProfileFormOptions) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [form, setForm] = useState<ProfileFormState>(() =>
    buildInitialState(options?.includeDni)
  );
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [original, setOriginal] = useState<ProfileFormState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser) as StoredUser;
      if (parsed.userdetail) {
        setUser(parsed);
        setForm(parsed.userdetail);
        setOriginal(parsed.userdetail);
      }
    }
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (value: string) => setNewPassword(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const payload = {
        ...form,
        ...(newPassword && { new_password: newPassword }),
      };

      const response = await fetch("http://localhost:8000/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("�o. Perfil actualizado correctamente.");
        if (user) {
          const updatedUser: StoredUser = {
            ...user,
            userdetail: { ...form },
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setOriginal({ ...form });
          setNewPassword("");
        }
      } else {
        setMessage(data.message || " Error al actualizar.");
      }
    } catch {
      setMessage(" Error de red o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = useMemo(() => {
    if (!original) return false;

    const baseChanged =
      form.first_name !== original.first_name ||
      form.last_name !== original.last_name ||
      form.email !== original.email;

    const dniChanged = options?.includeDni
      ? form.dni !== original.dni
      : false;

    return baseChanged || dniChanged || newPassword !== "";
  }, [form, original, newPassword, options?.includeDni]);

  return {
    user,
    form,
    newPassword,
    message,
    hasChanges,
    handleChange,
    handlePasswordChange,
    handleSubmit,
    isSubmitting,
  };
}
