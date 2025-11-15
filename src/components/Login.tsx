/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type LoginProcessResponse = {
  status: string;
  token?: string;
  user?: unknown;
  message?: string;
};

function Login() {
  const BACKEND_IP = "localhost";
  const BACKEND_PORT = "8000";
  const ENDPOINT = "users/login";
  const LOGIN_URL = `http://${BACKEND_IP}:${BACKEND_PORT}/${ENDPOINT}`;

  const userInputRef = useRef<HTMLInputElement>(null);
  const passInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  function loginProcess(dataObject: LoginProcessResponse) {
    if (dataObject.status === "success") {
      localStorage.setItem("token", dataObject.token ?? "");

      // Guardar user en localStorage con estructura userdetail
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
      setMessage("Iniciando sesión...");

      // Redirigir según tipo de usuario
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
      .catch((error) => console.log("error", error));
  }

  function checkNewPassword(p: any) {
    const tieneNumero = /\d/.test(p);
  }

  function handleChangeHola(e: any) {
    setNewPassword(e.target.value);
  }

  useEffect(() => {
    if (newPassword) checkNewPassword(newPassword);
    return () => {};
  }, [newPassword]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h1 className="text-center mb-3">Inicio de sesión</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="inputUser" className="form-label">
              Usuario
            </label>
            <input
              type="text"
              className="form-control"
              id="inputUser"
              ref={userInputRef}
              aria-describedby="userHelp"
            />
            <div id="userHelp" className="form-text"></div>
          </div>

          <div className="mb-4">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              ref={passInputRef}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Enviar
          </button>

          <div className="mt-3 text-center">
            <span>¿No tenés una cuenta? </span>
            <a href="/registro">Creá una aquí</a>
          </div>

          <span className="ms-3 text-danger">{message}</span>
        </form>
      </div>
    </div>
  );
}

export default Login;
































































