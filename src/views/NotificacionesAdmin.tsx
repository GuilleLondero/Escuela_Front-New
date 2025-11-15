import { useEffect, useState } from "react";
import { Card, Form, Button, Table, Alert } from "react-bootstrap";

type Notificacion = {
  id: number;
  mensaje: string;
  created_at: string;
};

const NotificacionesAdmin = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [mensajeStatus, setMensajeStatus] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  const fetchNotificaciones = async () => {
    try {
      const res = await fetch("http://localhost:8000/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotificaciones(data);
    } catch (err) {
      console.error("Error al obtener notificaciones", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    const url = editandoId
      ? `http://localhost:8000/notifications/${editandoId}`
      : "http://localhost:8000/notifications";
    const method = editandoId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: mensaje }),
      });

      if (res.ok) {
        setMensajeStatus(editandoId ? "✏️ Notificación editada" : "✅ Notificación publicada");
        setMensaje("");
        setEditandoId(null);
        fetchNotificaciones();
      } else {
        setMensajeStatus("❌ Error al guardar la notificación");
      }
    } catch {
      setMensajeStatus("❌ Error de red");
    } finally {
      setTimeout(() => setMensajeStatus(null), 3000);
    }
  };

  const handleEditar = (n: Notificacion) => {
    setMensaje(n.mensaje);
    setEditandoId(n.id);
  };

  const handleEliminar = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMensajeStatus("🗑️ Notificación eliminada");
        fetchNotificaciones();
      } else {
        setMensajeStatus("❌ No se pudo eliminar");
      }
    } catch {
      setMensajeStatus("❌ Error de red");
    } finally {
      setTimeout(() => setMensajeStatus(null), 3000);
    }
  };

  return (
    <Card className="mt-4 p-4 shadow-sm bg-white text-dark">
      <h5 className="fw-bold mb-3">📢 Publicar Notificación</h5>

      {mensajeStatus && (
        <Alert variant={mensajeStatus.includes("✅") || mensajeStatus.includes("✏️") ? "success" : "danger"}>
          {mensajeStatus}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Escribir mensaje para todos los alumnos..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          {editandoId ? "Guardar cambios" : "Publicar"}
        </Button>
      </Form>

      <hr />

      <h6 className="mt-4">🗂️ Notificaciones existentes</h6>
      {notificaciones.length === 0 ? (
        <p className="text-muted">No hay notificaciones publicadas.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Mensaje</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {notificaciones.map((n) => (
              <tr key={n.id}>
                <td>{n.mensaje}</td>
                <td>{new Date(n.created_at).toLocaleDateString("es-ES")}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleEditar(n)}>Editar</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => handleEliminar(n.id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
};

export default NotificacionesAdmin;
