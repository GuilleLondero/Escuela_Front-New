import { Card, Form, Button, Alert } from "react-bootstrap";
import { useProfileForm } from "../hooks/useProfileForm";

const ProfileAdmin = () => {
  const {
    user,
    form,
    newPassword,
    message,
    hasChanges,
    handleChange,
    handlePasswordChange,
    handleSubmit,
    isSubmitting,
  } = useProfileForm();

  if (!user) return <p className="text-danger">Cargando usuario...</p>;

  return (
    <div className="container mt-5">
      <Card
        className="shadow-sm border-0 bg-white text-dark mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <Card.Header className="accent">
          <h5 className="mb-0 text-white">Perfil del Administrador</h5>
          <small className="text-white-50">Gestiona tu correo y credenciales internas.</small>
        </Card.Header>
        <Card.Body className="p-4">

          <div style={{ minHeight: "55px" }}>
            {message && (
              <Alert variant={message.includes("�o.") ? "success" : "danger"}>
                {message}
              </Alert>
            )}
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de usuario</Form.Label>
              <Form.Control
                type="text"
                value={form.type}
                disabled
                style={{
                  backgroundColor: "#e9ecef",
                  fontWeight: "bold",
                  color: "#495057",
                  opacity: 1,
                }}
              />
              <Form.Text className="text-muted">
                Este campo no puede ser modificado.
              </Form.Text>
            </Form.Group>

            <hr />

            <Form.Group className="mb-3">
              <Form.Label>Nueva contrase��a</Form.Label>
              <Form.Control
                type="password"
                placeholder="Dejar vac��o si no se desea cambiar"
                value={newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 d-flex justify-content-center align-items-center"
              disabled={!hasChanges || isSubmitting}
            >
              {isSubmitting && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
              )}
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfileAdmin;
