import { useEffect, useState } from "react";
import { Button, Form, Table, Alert, Card, Tabs, Tab } from "react-bootstrap";

// Tipado de datos
type Carrera = {
  id: number;
  name: string;
  active?: boolean;
};

type Alumno = {
  id: number;
  nombre: string;
  apellido: string;
};

const AdminCarreras = () => {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [nombreCarrera, setNombreCarrera] = useState<string>("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<string>("");
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<string>("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCarreras();
    fetchAlumnos();
  }, []);

  const fetchCarreras = async () => {
    try {
      const res = await fetch("http://localhost:8000/careers/active", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCarreras(data);
    } catch (error) {
      console.error("Error al obtener carreras", error);
    }
  };

  const fetchAlumnos = async () => {
    try {
      const res = await fetch("http://localhost:8000/users/alumnos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAlumnos(data);
    } catch (error) {
      console.error("Error al obtener alumnos", error);
    }
  };

  const handleGuardar = async () => {
    if (!nombreCarrera.trim()) return;

    const url = editandoId
      ? `http://localhost:8000/careers/${editandoId}`
      : "http://localhost:8000/career/add";
    const method = editandoId ? "PUT" : "POST";
    const body = JSON.stringify(
      editandoId
        ? { name: nombreCarrera, active: true }
        : { name: nombreCarrera }
    );

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (res.ok) {
        setMensaje(editandoId ? "✅  Carrera actualizada" : "✅  Carrera agregada");
        setNombreCarrera("");
        setEditandoId(null);
        fetchCarreras();
      } else {
        setMensaje(" Error al guardar carrera");
      }
    } catch {
      setMensaje(" Error de red");
    } finally {
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const handleEditar = (carrera: Carrera) => {
    setNombreCarrera(carrera.name);
    setEditandoId(carrera.id);
  };

  const handleEliminar = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/careers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMensaje(" Carrera eliminada lógicamente");
        fetchCarreras();
      } else {
        setMensaje(" No se pudo eliminar la carrera");
      }
    } catch {
      setMensaje(" Error de red al eliminar");
    } finally {
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const handleInscribir = async () => {
    const id_user = parseInt(alumnoSeleccionado);
    const id_career = parseInt(carreraSeleccionada);

    if (!id_user || !id_career) return;

    try {
      const res = await fetch("http://localhost:8000/user/addcareer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_user, id_career }),
      });
      const data = await res.text();
      setMensaje(`✅ ${data}`);
      setTimeout(() => setMensaje(null), 4000);
    } catch {
      setMensaje(" Error al inscribir alumno");
    }
  };

  return (
    <div className="container mt-5">
      <Card className="p-4 bg-white text-dark shadow-sm">
        <h4 className="fw-bold mb-3">Gestión de Carreras e Inscripción</h4>

        <div style={{ minHeight: "40px" }}>
          {mensaje && (
            <Alert variant={mensaje.includes("✅") ? "success" : "danger"}>{mensaje}</Alert>
          )}
        </div>

        <Tabs defaultActiveKey="gestion" className="mb-3">
          <Tab eventKey="gestion" title="🛠️ Gestión de Carreras">
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la carrera</Form.Label>
              <Form.Control
                type="text"
                value={nombreCarrera}
                onChange={(e) => setNombreCarrera(e.target.value)}
                placeholder="Ej: Tecnicatura en Software"
              />
            </Form.Group>

            <Button variant="success" onClick={handleGuardar} className="mb-3">
              {editandoId ? "Actualizar carrera" : "Agregar carrera"}
            </Button>

            {carreras.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead>
                  <tr className="text-center">
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {carreras.map((c) => (
                    <tr key={c.id}>
                      <td className="align-middle text-center">{c.id}</td>
                      <td className="align-middle text-center">{c.name}</td>
                      <td className="align-middle text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button variant="primary" size="sm" onClick={() => handleEditar(c)}>Editar</Button>
                          <Button variant="danger" size="sm" onClick={() => handleEliminar(c.id)}>Eliminar</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-muted">No hay carreras activas</p>
            )}
          </Tab>

          <Tab eventKey="inscripcion" title="📋 Inscripción de Alumnos">
            <Form.Group className="mb-3">
              <Form.Label>Seleccionar Alumno</Form.Label>
              <Form.Select value={alumnoSeleccionado} onChange={(e) => setAlumnoSeleccionado(e.target.value)}>
                <option value="">-- Seleccionar --</option>
                {alumnos.map((a) => (
                  <option key={a.id} value={a.id}>{`${a.nombre} ${a.apellido}`}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Seleccionar Carrera</Form.Label>
              <Form.Select value={carreraSeleccionada} onChange={(e) => setCarreraSeleccionada(e.target.value)}>
                <option value="">-- Seleccionar --</option>
                {carreras.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" onClick={handleInscribir}>
              Inscribir Alumno
            </Button>
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminCarreras;
