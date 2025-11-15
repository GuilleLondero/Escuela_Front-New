import { useEffect, useState } from "react";
import { Card, Form, Table, Button, Alert } from "react-bootstrap";

type Alumno = {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
};

type Pago = {
  id: number;
  amount: number;
  fecha_pago: string;
  carrera: string;
  mes_afectado: string;
};

type NuevoPago = {
  id_user: number;
  id_career: number;
  amount: string | number;
  affected_month: string;
};

type Carrera = {
  id: number;
  name: string;
};

const AdminPagos = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [selectedAlumno, setSelectedAlumno] = useState<string>("");
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [filtroCarrera, setFiltroCarrera] = useState<string>("");
  const [nuevoPago, setNuevoPago] = useState<NuevoPago | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [pagoEditando, setPagoEditando] = useState<Pago | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const alumnosRes = await fetch("http://localhost:8000/users/alumnos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const alumnosData = await alumnosRes.json();
        setAlumnos(alumnosData);

        const carrerasRes = await fetch("http://localhost:8000/careers/active", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const carrerasData = await carrerasRes.json();
        setCarreras(Array.isArray(carrerasData) ? carrerasData : []);
      } catch (error) {
        console.error("Error cargando datos iniciales", error);
      }
    };

    fetchInitialData();
  }, [token]);

  const fetchPagos = async (username: string) => {
    try {
      const res = await fetch(`http://localhost:8000/payment/user/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPagos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar pagos", err);
    }
  };

  const handleAlumnoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const username = e.target.value;
    setSelectedAlumno(username);
    setMensaje(null);
    setPagos([]);
    setNuevoPago(null);
    setPagoEditando(null);

    if (!username) return;
    const alumno = alumnos.find((a) => a.username === username);
    if (alumno) {
      setNuevoPago({
        id_user: alumno.id,
        id_career: carreras.length > 0 ? carreras[0].id : 1,
        amount: "",
        affected_month: "",
      });
      fetchPagos(username);
    }
  };

  const handleNuevoPagoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!nuevoPago) return;
    const { name, value } = e.target;
    if (name === "amount") {
      if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
        setNuevoPago({ ...nuevoPago, [name]: value });
      }
    } else {
      setNuevoPago({ ...nuevoPago, [name]: name === "id_career" ? Number(value) : value });
    }
  };

  const handleAgregarPago = async () => {
    if (!nuevoPago) return;
    const amount = Number(nuevoPago.amount);
    if (!nuevoPago.amount || amount <= 0 || isNaN(amount)) {
      setMensaje(" El monto debe ser mayor a 0");
      return;
    }
    if (!nuevoPago.affected_month.trim()) {
      setMensaje(" Debe especificar el mes afectado");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/payment/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...nuevoPago, amount }),
      });
      if (res.ok) {
        setMensaje("✅ Pago registrado correctamente.");
        setTimeout(() => setMensaje(null), 3000);
        fetchPagos(selectedAlumno);
        setNuevoPago({ ...nuevoPago, amount: "", affected_month: "" });
      } else {
        const data = await res.json();
        setMensaje(` Error: ${data.message || JSON.stringify(data)}`);
      }
    } catch {
      setMensaje(" Error de red al agregar pago.");
    }
  };

  const handleEditarPago = (pago: Pago) => {
    setPagoEditando(pago);
    const carreraEncontrada = carreras.find((c) => c.name === pago.carrera);
    setNuevoPago({
      id_user: nuevoPago?.id_user || 0,
      id_career: carreraEncontrada?.id || 0,
      amount: pago.amount,
      affected_month: "", // vacío para evitar conflictos con type=month
    });
  };

  const handleConfirmarEdicion = async () => {
    if (!pagoEditando || !nuevoPago) return;
    try {
      const res = await fetch(`http://localhost:8000/payments/${pagoEditando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoPago),
      });
      if (res.ok) {
        setMensaje("✅ Pago actualizado correctamente.");
        setTimeout(() => setMensaje(null), 3000);
        fetchPagos(selectedAlumno);
        setPagoEditando(null);
      } else {
        const data = await res.json();
        setMensaje(` Error al actualizar: ${data.message || "Error interno"}`);
      }
    } catch {
      setMensaje(" Error de red al actualizar");
    }
  };

  const handleEliminarPago = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/payment/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMensaje("✅ Pago eliminado correctamente.");
        setTimeout(() => setMensaje(null), 3000);
        fetchPagos(selectedAlumno);
      } else {
        setMensaje(" Error al eliminar el pago.");
      }
    } catch {
      setMensaje(" Error de red al eliminar.");
    }
  };

  const carrerasDisponibles = [...new Set(pagos.map((p) => p.carrera))];
  const pagosFiltrados = filtroCarrera ? pagos.filter((p) => p.carrera === filtroCarrera) : pagos;

  return (
    <div className="container mt-5">
      <Card className="p-4 shadow-sm border-0 rounded-2 bg-white text-dark">
        <h4 className="fw-bold mb-4">Gestión de Pagos por Alumno</h4>

        <div style={{ minHeight: "45px" }}>
          {mensaje && <Alert variant={mensaje.includes("✅") ? "success" : "danger"}>{mensaje}</Alert>}
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Seleccionar Alumno</Form.Label>
          <Form.Select value={selectedAlumno} onChange={handleAlumnoChange}>
            <option value="">-- Seleccionar --</option>
            {alumnos.map((a) => (
              <option key={a.id} value={a.username}>
                {a.nombre} {a.apellido} ({a.username})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {carrerasDisponibles.length > 0 && (
          <Form.Group className="mb-4">
            <Form.Label>Filtrar por carrera</Form.Label>
            <Form.Select value={filtroCarrera} onChange={(e) => setFiltroCarrera(e.target.value)}>
              <option value="">Todas</option>
              {carrerasDisponibles.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </Form.Select>
          </Form.Group>
        )}

        {nuevoPago && (
          <div className="mb-4">
            <h5 className="mb-3">Registrar nuevo pago</h5>
            <Form.Group className="mb-2">
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                min="0"
                step="0.01"
                placeholder="Ingresa el monto"
                value={nuevoPago.amount}
                onChange={handleNuevoPagoChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Mes afectado</Form.Label>
              <Form.Control
                type="month"
                name="affected_month"
                value={nuevoPago.affected_month}
                onChange={handleNuevoPagoChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Carrera</Form.Label>
              <Form.Select
                name="id_career"
                value={nuevoPago.id_career}
                onChange={handleNuevoPagoChange}
              >
                {carreras.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="success" onClick={handleAgregarPago}>
              Registrar Pago
            </Button>
            {pagoEditando && (
              <div className="mt-3">
                <Button variant="primary" onClick={handleConfirmarEdicion}>
                  Confirmar edición
                </Button>
              </div>
            )}
          </div>
        )}

        {pagosFiltrados.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Fecha</th>
                <th className="text-center">Carrera</th>
                <th className="text-center">Mes afectado</th>
                <th className="text-center">Monto</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.map((p) => (
                <tr key={p.id}>
                  <td className="align-middle text-center">{new Date(p.fecha_pago).toLocaleDateString()}</td>
                  <td className="align-middle text-center">{p.carrera}</td>
                  <td className="align-middle text-center">{p.mes_afectado}</td>
                  <td className="align-middle text-center">${p.amount}</td>
                  <td className="align-middle text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditarPago(p)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleEliminarPago(p.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          selectedAlumno && <p className="text-muted">No hay pagos cargados para este alumno.</p>
        )}
      </Card>
    </div>
  );
};

export default AdminPagos;