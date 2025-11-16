import { Card, Form, Button, Table, Alert } from "react-bootstrap";
import { useAdminNotifications } from "../hooks/useAdminNotifications";

const NotificacionesAdmin = () => {
  const {
    notificaciones,
    mensaje,
    mensajeStatus,
    editandoId,
    setMensaje,
    handleSubmit,
    handleEditar,
    handleEliminar,
  } = useAdminNotifications();

  const alertVariant =
    mensajeStatus && mensajeStatus.startsWith("OK") ? "success" : "danger";

  return (
    <Card className="mt-4 p-4 shadow-sm bg-white text-dark">
      <h5 className="fw-bold mb-3">Publicar Notificacion</h5>

      {mensajeStatus && <Alert variant={alertVariant}>{mensajeStatus}</Alert>}

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

      <h6 className="mt-4">Notificaciones existentes</h6>
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
                  <Button variant="warning" size="sm" onClick={() => handleEditar(n)}>
                    Editar
                  </Button>{" "}
                  <Button variant="danger" size="sm" onClick={() => handleEliminar(n.id)}>
                    Eliminar
                  </Button>
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
