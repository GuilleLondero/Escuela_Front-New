import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginProcessResponse = {
  status: string;
  token?: string;
  user?: unknown;
  message?: string;
};

const BACKEND_IP = "localhost";
const BACKEND_PORT = "8000";
const ENDPOINT = "users/login";
const LOGIN_URL = `http://${BACKEND_IP}:${BACKEND_PORT}/${ENDPOINT}`;

const checkNewPassword = (password: string) => {
  const tieneNumero = /\d/.test(password);
  return tieneNumero;
};

export function useLoginForm() {
  const navigate = useNavigate();
  const userInputRef = useRef<HTMLInputElement>(null);
  const passInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const handleChangeNewPassword = (value: string) => setNewPassword(value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function loginProcess(dataObject: LoginProcessResponse) {
    if (dataObject.status === "success") {
      localStorage.setItem("token", dataObject.token ?? "");

      const user = {
        username: (dataObject.user as any).username,
        userdetail: {
          first_name: (dataObject.user as any).first_name,
          last_name: (dataObject.user as any).last_name,
          email: (dataObject.user as any).email,
          type: (dataObject.user as any).type,
        },
      };

      localStorage.setItem("user", JSON.stringify(user));
      setMessage("Iniciando sesion...");

      const tipo = user.userdetail.type?.toLowerCase();
      if (tipo === "administrativo") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setMessage(dataObject.message ?? "Error desconocido");
    }
  }

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const username = userInputRef.current?.value ?? "";
    const password = passInputRef.current?.value ?? "";

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ username, password });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch(LOGIN_URL, requestOptions)
      .then((respond) => respond.json())
      .then((dataObject) => loginProcess(dataObject))
      .catch((error) => console.log("error", error))
      .finally(() => setIsSubmitting(false));
  }

  useEffect(() => {
    if (newPassword) checkNewPassword(newPassword);
  }, [newPassword]);

  return {
    message,
    handleLogin,
    userInputRef,
    passInputRef,
    handleChangeNewPassword,
    isSubmitting,
  };
}
