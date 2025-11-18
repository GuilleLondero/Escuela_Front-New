import { Card, Spinner } from "react-bootstrap";
import { useNotificationsList } from "../hooks/useNotificationsList";

const NotificacionesAlumno = () => {
  const { notifications, loading } = useNotificationsList();

  return (
    <Card className="mt-4 shadow-sm bg-white text-dark">
      <Card.Header className="accent">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 text-white">Notificaciones</h5>
          <i className="bi bi-bell text-white opacity-75" />
        </div>
      </Card.Header>
      <Card.Body className="p-4">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Cargando notificaciones...</p>
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-muted mb-0">No hay notificaciones disponibles.</p>
        ) : (
          <ul className="list-group">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="list-group-item d-flex justify-content-between align-items-start"
              >
                <div className="me-auto pe-3">{n.message}</div>
                <small className="text-muted ms-3">{n.created_at}</small>
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
};

export default NotificacionesAlumno;
