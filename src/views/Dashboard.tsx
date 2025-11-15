import { useEffect, useState } from "react";
import NotificacionesAlumno from "./NotificacionesAlumno";

function Dashboard() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser.userdetail?.first_name || "Usuario";
  const username = storedUser.username || null;

  const BACKEND_IP = "localhost";
  const BACKEND_PORT = "8000";
  const USER_DETAIL_ENDPOINT = `users/${username}`;
  const USER_DETAIL_URL = `http://${BACKEND_IP}:${BACKEND_PORT}/${USER_DETAIL_ENDPOINT}`;

  type User = {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    type: string;
    email: string;
    dni: string;
    [key: string]: any;
  };

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cachedUserData = storedUser;

  function getUserData() {
    if (!username) {
      setError("No se pudo obtener el username del usuario");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    fetch(USER_DETAIL_URL, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (!data.message) {
          setUserData(data);
          setError(null);
        } else {
          setError("No se pudieron cargar los datos del usuario");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        setError("Error al conectar con el servidor");
        setLoading(false);
      });
  }

  useEffect(() => {
    getUserData();
  }, []);

  const customStyles = {
    primaryColor: "#4F46E5",
    secondaryColor: "#6366F1",
    accentColor: "#F59E0B",
    neutralLight: "#F3F4F6",
    neutralDark: "#1F2937",
    textPrimary: "#111827",
    textInverted: "#F9FAFB",
  };

  const datos = userData || cachedUserData;

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif",
        minHeight: "100vh",
        backgroundColor: customStyles.neutralLight,
      }}
    >
      <div className="container-fluid px-4 py-4">
        <div className="row">
          <div className="col-12">
            <div
              className="card shadow-sm border-0 rounded-2 mb-4"
              style={{ backgroundColor: "white" }}
            >
              <div className="card-body p-4">
                <h1
                  className="card-title fw-bold mb-3"
                  style={{ color: customStyles.textPrimary, fontSize: "2rem" }}
                >
                  Dashboard del Alumno
                </h1>
                <p
                  className="card-text fs-5"
                  style={{ color: customStyles.secondaryColor }}
                >
                  ¡Bienvenido {userName}!
                </p>
              </div>
            </div>

            <div className="card shadow-sm border-0 rounded-2">
              <div
                className="card-header"
                style={{
                  backgroundColor: customStyles.neutralLight,
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <h3
                  className="mb-0 fw-bold"
                  style={{ color: customStyles.textPrimary, fontSize: "1.25rem" }}
                >
                  Mis Datos Personales
                </h3>
              </div>

              <div className="card-body p-4">
                {error && (
                  <div
                    className="alert alert-danger rounded-2 mb-4"
                    role="alert"
                  >
                    <strong>Error:</strong> {error}
                  </div>
                )}

                {loading && !datos ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3 text-muted">
                      Cargando datos del usuario...
                    </p>
                  </div>
                ) : datos ? (
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div
                        className="border rounded-2 p-3"
                        style={{ backgroundColor: customStyles.neutralLight }}
                      >
                        <label className="form-label fw-bold text-muted small">
                          NOMBRE
                        </label>
                        <p
                          className="fs-5 mb-0 fw-medium"
                          style={{ color: customStyles.textPrimary }}
                        >
                          {datos.first_name}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="border rounded-2 p-3"
                        style={{ backgroundColor: customStyles.neutralLight }}
                      >
                        <label className="form-label fw-bold text-muted small">
                          APELLIDO
                        </label>
                        <p
                          className="fs-5 mb-0 fw-medium"
                          style={{ color: customStyles.textPrimary }}
                        >
                          {datos.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="border rounded-2 p-3"
                        style={{ backgroundColor: customStyles.neutralLight }}
                      >
                        <label className="form-label fw-bold text-muted small">
                          EMAIL
                        </label>
                        <p
                          className="fs-5 mb-0 fw-medium"
                          style={{ color: customStyles.textPrimary }}
                        >
                          {datos.email}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="border rounded-2 p-3"
                        style={{ backgroundColor: customStyles.neutralLight }}
                      >
                        <label className="form-label fw-bold text-muted small">
                          DNI
                        </label>
                        <p
                          className="fs-5 mb-0 fw-medium"
                          style={{ color: customStyles.textPrimary }}
                        >
                          {datos.dni || "No disponible"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="border rounded-2 p-3"
                        style={{ backgroundColor: customStyles.neutralLight }}
                      >
                        <label className="form-label fw-bold text-muted small">
                          USUARIO
                        </label>
                        <p
                          className="fs-5 mb-0 fw-medium"
                          style={{ color: customStyles.textPrimary }}
                        >
                          {datos.username}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="border rounded-2 p-3 d-flex flex-column justify-content-center"
                        style={{
                          backgroundColor: customStyles.neutralLight,
                          minHeight: "100px",
                        }}
                      >
                        <label className="form-label fw-bold text-muted small mb-2">
                          TIPO DE USUARIO
                        </label>
                        <span
                          className="badge rounded-pill px-3 py-2 fw-medium align-self-start"
                          style={{
                            backgroundColor: customStyles.secondaryColor,
                            color: "white",
                            fontSize: "0.9rem",
                          }}
                        >
                          {datos.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <NotificacionesAlumno />
    </div>
    
  );
}

export default Dashboard;
