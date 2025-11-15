import { useEffect, useState } from "react";
import { Table, Card, Alert, Spinner } from "react-bootstrap";

type Pago = {
  id: number;
  fecha: string;
  mes_afectado: string;
  monto: number;
  carrera: string;
};

function MyPayments() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username;

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8000/user/pagos/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los pagos");
        return res.json();
      })
      .then((data) => {
        setPagos(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("❌ No se pudieron cargar los pagos.");
      })
      .finally(() => setLoading(false));
  }, [username]);

  return (
    <div className="container mt-5">
      <Card className="p-4 shadow-sm bg-white text-dark">
        <h4 className="fw-bold mb-4">📄 Mis Pagos</h4>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Cargando pagos...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : pagos.length === 0 ? (
          <Alert variant="warning">No se registran pagos hasta el momento.</Alert>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Fecha</th>
                <th className="text-center">Carrera</th>
                <th className="text-center">Mes afectado</th>
                <th className="text-center">Monto</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago) => (
                <tr key={pago.id}>
                  <td className="align-middle text-center">{pago.fecha}</td>
                  <td className="align-middle text-center">{pago.carrera}</td>
                  <td className="align-middle text-center">{pago.mes_afectado}</td>
                  <td className="align-middle text-center">${pago.monto.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}

export default MyPayments;
