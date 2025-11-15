import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import NotificacionesAdmin from "./NotificacionesAdmin";

const AdminHome = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const nombre = user?.userdetail?.first_name || "Admin";
  const apellido = user?.userdetail?.last_name || "";

  const [alumnosCount, setAlumnosCount] = useState(0);
  const [pagosCount, setPagosCount] = useState(0);
  const [pagosRecientes, setPagosRecientes] = useState<any[]>([]);
  const [alumnosRecientes, setAlumnosRecientes] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/users/alumnos")
      .then(res => res.json())
      .then(data => {
        setAlumnosCount(data.length);
        setAlumnosRecientes(data.slice(-5).reverse());
      });

    fetch("http://localhost:8000/payments/active")
      .then(res => res.json())
      .then(data => {
        setPagosCount(data.length);
        setPagosRecientes(data.slice(0, 5));
      });
  }, []);

  return (
    <Container>
      <h2 className="fw-bold text-center mb-4">
        Hola, {nombre} {apellido} 👋
      </h2>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="text-center p-3 shadow-sm">
            <strong>Alumnos registrados</strong>
            <h4>{alumnosCount}</h4>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="text-center p-3 shadow-sm">
            <strong>Pagos activos</strong>
            <h4>{pagosCount}</h4>
          </Card>
        </Col>
      </Row>

     <Row className="mb-4 align-items-stretch">
  <Col md={6} className="d-flex">
    <Card className="p-3 shadow-sm w-100">
      <h5 className="fw-bold mb-3">Últimos pagos registrados</h5>
      <table className="table table-sm align-middle">
        <thead className="table-light">
          <tr>
            <th>Alumno</th>
            <th>Carrera</th>
            <th>Monto</th>
            <th>Mes</th>
          </tr>
        </thead>
        <tbody>
          {pagosRecientes.map((pago, index) => (
            <tr key={index}>
              <td>{pago.alumno}</td>
              <td>{pago.carrera}</td>
              <td>${pago.monto}</td>
              <td>{pago.mes_afectado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </Col>

  <Col md={6} className="d-flex">
    <Card className="p-3 shadow-sm w-100">
      <h5 className="fw-bold mb-3">Últimos alumnos inscriptos</h5>
      <table className="table table-sm align-middle">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Carrera</th>
          </tr>
        </thead>
        <tbody>
          {alumnosRecientes.map((alumno, index) => (
            <tr key={index}>
              <td>{alumno.nombre} {alumno.apellido}</td>
              <td>({alumno.username})</td>
              <td>
                {alumno.carreras?.length > 0
                  ? alumno.carreras.map((c, idx) => <div key={idx}>{c}</div>)
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </Col>
</Row>


      <div className="mt-5">
        <NotificacionesAdmin />
      </div>
    </Container>
  );
};

export default AdminHome;
