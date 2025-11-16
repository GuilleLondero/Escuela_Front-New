import { Card, Spinner } from "react-bootstrap";
import { useNotificationsList } from "../hooks/useNotificationsList";

const NotificacionesAlumno = () => {
  const { notifications, loading } = useNotificationsList();

  return (
    <Card className="mt-4 shadow-sm p-4 bg-white text-dark">
      <h5 className="fw-bold mb-3">📢 Notificaciones</h5>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Cargando notificaciones...</p>
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-muted">No hay notificaciones disponibles.</p>
      ) : (
        <ul className="list-group">
          {notifications.map((n) => (
            <li key={n.id} className="list-group-item d-flex justify-content-between align-items-start">
              <div className="me-auto">{n.message}</div>
              <small className="text-muted ms-3">{n.created_at}</small>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default NotificacionesAlumno;
