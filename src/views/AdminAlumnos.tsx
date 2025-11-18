import { Button, Table, Card, Form, Tabs, Tab, Alert } from "react-bootstrap";
import Select from "react-select";
import { useAdminAlumnos } from "../hooks/useAdminAlumnos";

const AdminAlumnos = () => {
  const {
    alumnos,
    alumnosPaginados,
    mensaje,
    nuevo,
    carreraOptions,
    handleChange,
    handleCarreraSelect,
    handleCrearAlumno,
    isSubmitting,
    page,
    totalPages,
    nextPage,
    prevPage,
  } = useAdminAlumnos();

  const alertVariant = mensaje && mensaje.startsWith("OK") ? "success" : "danger";

  return (
    <div className="container mt-5">
      <Card className="shadow-sm border-0 bg-white text-dark">
        <Card.Header className="accent">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0 text-white">Listado de Alumnos</h4>
              <small className="text-white-50">
                Consulta y creación de alumnos desde un mismo módulo.
              </small>
            </div>
            <i className="bi bi-people fs-2 text-white opacity-75" />
          </div>
        </Card.Header>
        <Card.Body className="p-4">
          {mensaje && (
            <Alert variant={alertVariant} className="rounded-3">
              {mensaje}
            </Alert>
          )}

          <Tabs defaultActiveKey="lista" className="mb-3">
            <Tab eventKey="lista" title="Lista de alumnos">
              {alumnosPaginados.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover className="mb-0">
                    <thead>
                      <tr>
                        <th className="text-center text-nowrap">#</th>
                        <th className="text-center text-nowrap">Nombre</th>
                        <th className="text-center text-nowrap">Apellido</th>
                        <th className="text-center text-nowrap">Email</th>
                        <th className="text-center">Carreras</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alumnosPaginados.map((alumno, i) => (
                        <tr key={alumno.id}>
                          <td className="text-center text-nowrap">
                            {(page - 1) * 20 + i + 1}
                          </td>
                          <td className="text-center text-nowrap">{alumno.nombre}</td>
                          <td className="text-center text-nowrap">{alumno.apellido}</td>
                          <td className="text-center text-nowrap">{alumno.email}</td>
                          <td className="text-center">
                            {alumno.carreras.length === 0 ? (
                              <span className="text-muted small">Sin asignación</span>
                            ) : (
                              alumno.carreras.map((c, idx) => (
                                <span key={`${alumno.id}-${idx}`} className="badge-soft px-2 py-1 me-1">
                                  {c}
                                </span>
                              ))
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted mb-0">No hay alumnos registrados.</p>
              )}
              {alumnos.length > 20 && (
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <Button variant="outline-secondary" size="sm" onClick={prevPage} disabled={page === 1}>
                    Anterior
                  </Button>
                  <span className="small text-muted">
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={nextPage}
                    disabled={page === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </Tab>

            <Tab eventKey="crear" title="Crear nuevo alumno">
              <Form className="pt-3">
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control name="firstname" value={nuevo.firstname} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control name="lastname" value={nuevo.lastname} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={nuevo.email}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control name="dni" value={nuevo.dni} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de usuario</Form.Label>
                  <Form.Control name="username" value={nuevo.username} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={nuevo.password}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Asignar a una carrera (opcional)</Form.Label>
                  <Select
                    isClearable
                    placeholder="-- Ninguna --"
                    options={carreraOptions}
                    value={carreraOptions.find((opt) => opt.value === nuevo.id_career) ?? null}
                    onChange={(option) => handleCarreraSelect(option?.value ?? null)}
                  />
                </Form.Group>
                <Button
                  onClick={handleCrearAlumno}
                  disabled={isSubmitting}
                  className="d-flex align-items-center"
                >
                  {isSubmitting && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  {isSubmitting ? "Creando..." : "Crear Alumno"}
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminAlumnos;
