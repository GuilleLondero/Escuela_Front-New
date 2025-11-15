import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import PublicRoutes from "./components/router/PublicRoutes";
import ProtectedRoutes from "./components/router/ProtectedRoutes";
import MainLayout from "./components/layouts/MainLayout";
import DashboardAdmin from "./views/DashboardAdmin"; 


function App() {
  const Dashboard = lazy(() => import("./views/Dashboard"));
  const Profile = lazy(() => import("./views/Profile"));
  const MyPayments = lazy(() => import("./views/myPayments")); //no se esta usando, se va por navbar, la dejo por las dudas
  const Notifications = lazy(() => import("./views/Notifications"));

  /* Nuevos componentes para admin
  const GestionAlumnos = lazy(() => import("./views/GestionAlumnos"));
  const GestionPagos = lazy(() => import("./views/GestionPagos"));
  const GestionCarreras = lazy(() => import("./views/GestionCarreras"));*/

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/dashboard/perfil" element={<Profile />} />
            <Route path="/dashboard/pagos" element={<MyPayments />} />


            {/* ✅ Ruta única para todas las internas del panel admin */}
            <Route path="/admin/*" element={<DashboardAdmin />} />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
