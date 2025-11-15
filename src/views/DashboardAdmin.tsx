import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import AdminHome from "./AdminHome";
import ProfileAdmin from "./ProfileAdmin";
import AdminAlumnos from "./AdminAlumnos";
import AdminPagos from "./AdminPagos";
import AdminCarreras from "./AdminCarreras";


const DashboardAdmin = () => {
  return (
    <Container className="mt-4">
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="perfil" element={<ProfileAdmin />} />
        <Route path="alumnos" element={<AdminAlumnos />} />
        <Route path="pagos" element={<AdminPagos />} />
        <Route path="carreras" element={<AdminCarreras />} />
 
      </Routes>
    </Container>
  );
};

export default DashboardAdmin;
