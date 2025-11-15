


import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "null") {
        const user = JSON.parse(storedUser);
        const tipo = user.userdetail?.type || user.type || null;
        if (tipo) {
          setTipoUsuario(tipo.toLowerCase());
        }
      }
    } catch (error) {
      console.error("Error leyendo localStorage:", error);
      setTipoUsuario(null);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg bg-primary">
      <div className="container-fluid">
        {/* Brand - solo texto */}
        <span className="navbar-brand text-white fw-bold">
          Sistema Escuela
        </span>

        {/* Toggle button for mobile */}
        <button className="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {tipoUsuario === "administrativo" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/admin">
                    Inicio
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/admin/perfil">
                    Perfil
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/admin/alumnos">
                    Alumnos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/admin/pagos">
                    Pagos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/admin/carreras">
                    Carreras
                  </NavLink>
                </li>
              </>
            )}

            {tipoUsuario === "alumno" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/dashboard">
                    Inicio
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/dashboard/perfil">
                    Perfil
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/dashboard/pagos">
                    Mis Pagos
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Logout button */}
          <div className="d-flex">
            <button className="btn btn-danger" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;





























































// import { NavLink, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// function Navbar() {
//   const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser && storedUser !== "null") {
//         const user = JSON.parse(storedUser);
//         const tipo = user.userdetail?.type || user.type || null;
//         if (tipo) {
//           setTipoUsuario(tipo.toLowerCase());
//         }
//       }
//     } catch (error) {
//       console.error("Error leyendo localStorage:", error);
//       setTipoUsuario(null);
//     }
//   }, []);

//   function handleLogout() {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     navigate("/login");
//   }

//   return (
//     <nav style={{ padding: "1rem", background: "#f0f0f0" }}>
//       {tipoUsuario === "administrativo" && (
//         <>
//           <NavLink to="/admin" style={{ marginRight: "1rem" }}>Inicio</NavLink>
//           <NavLink to="/admin/perfil" style={{ marginRight: "1rem" }}>Perfil</NavLink>
//           <NavLink to="/admin/alumnos" style={{ marginRight: "1rem" }}>Alumnos</NavLink>
//           <NavLink to="/admin/pagos" style={{ marginRight: "1rem" }}>Pagos</NavLink>
//           <NavLink to="/admin/carreras" style={{ marginRight: "1rem" }}>Carreras</NavLink>
//         </>
//       )}

//       {tipoUsuario === "alumno" && (
//         <>
//           <NavLink to="/dashboard/perfil" style={{ marginRight: "1rem" }}>Perfil</NavLink>
//           <NavLink to="/dashboard/pagos" style={{ marginRight: "1rem" }}>Mis Pagos</NavLink>
//         </>
//       )}

//       <NavLink to="/login" onClick={handleLogout}>
//         Logout
//       </NavLink>
//     </nav>
//   );
// }

// export default Navbar;
