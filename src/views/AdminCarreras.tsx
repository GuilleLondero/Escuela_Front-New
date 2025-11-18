import { Button, Form, Table, Alert, Card, Tabs, Tab } from "react-bootstrap";
import Select from "react-select";
import { useAdminCarreras } from "../hooks/useAdminCarreras";

const AdminCarreras = () => {
  const {
    carreras,
    nombreCarrera,
    editandoId,
    mensaje,
    alumnoSeleccionado,
    carreraSeleccionada,
    alumnoOptions,
    carreraOptions,
    setNombreCarrera,
    setAlumnoSeleccionado,
    setCarreraSeleccionada,
    handleGuardar,
    handleEditar,
    handleEliminar,
    handleInscribir,
    savingCareer,
    enrolling,
  } = useAdminCarreras();

  const alertVariant = mensaje && mensaje.startsWith("OK") ? "success" : "danger";

  return (
    <div className="container mt-5">
      <Card className="shadow-sm border-0 bg-white text-dark">
        <Card.Header className="accent">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0 text-white">Gestión de Carreras e Inscripción</h4>
              <small className="text-white-50">
                Altas, bajas y asignación de carreras para cada alumno.
              </small>
            </div>
            <i className="bi bi-mortarboard fs-2 text-white opacity-75" />
          </div>
        </Card.Header>
        <Card.Body className="p-4">
          <div style={{ minHeight: "40px" }}>
            {mensaje && (
              <Alert variant={alertVariant} className="rounded-3">
                {mensaje}
              </Alert>
            )}
          </div>

          <Tabs defaultActiveKey="gestion" className="mb-3">
            <Tab eventKey="gestion" title="Gestión de Carreras">
              <Form.Group className="mb-3">
                <Form.Label>Nombre de la carrera</Form.Label>
                <Form.Control
                  type="text"
                  value={nombreCarrera}
                  onChange={(e) => setNombreCarrera(e.target.value)}
                  placeholder="Ej: Tecnicatura en Software"
                />
              </Form.Group>

              <Button
                variant="success"
                onClick={handleGuardar}
                className="mb-3 d-flex align-items-center"
                disabled={savingCareer}
              >
                {savingCareer && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                {savingCareer
                  ? "Guardando..."
                  : editandoId
                  ? "Actualizar carrera"
                  : "Agregar carrera"}
              </Button>

              {carreras.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover responsive className="mb-0">
                    <thead>
                      <tr className="text-center text-nowrap">
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carreras.map((c) => (
                        <tr key={c.id}>
                          <td className="text-center text-nowrap">{c.id}</td>
                          <td className="text-center text-nowrap">{c.name}</td>
                          <td className="text-center text-nowrap">
                            <div className="d-flex justify-content-center gap-2">
                              <Button variant="primary" size="sm" onClick={() => handleEditar(c)}>
                                Editar
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => handleEliminar(c.id)}>
                                Eliminar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted">No hay carreras activas</p>
              )}
            </Tab>

            <Tab eventKey="inscripcion" title="Inscripción de Alumnos">
              <Form.Group className="mb-3">
                <Form.Label>Seleccionar Alumno</Form.Label>
                <Select
                  isClearable
                  placeholder="-- Seleccionar --"
                  options={alumnoOptions}
                  value={
                    alumnoSeleccionado
                      ? alumnoOptions.find((opt) => opt.value === alumnoSeleccionado) ?? null
                      : null
                  }
                  onChange={(option) => setAlumnoSeleccionado(option?.value ?? null)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Seleccionar Carrera</Form.Label>
                <Select
                  isClearable
                  placeholder="-- Seleccionar --"
                  options={carreraOptions}
                  value={
                    carreraSeleccionada
                      ? carreraOptions.find((opt) => opt.value === carreraSeleccionada) ?? null
                      : null
                  }
                  onChange={(option) => setCarreraSeleccionada(option?.value ?? null)}
                />
              </Form.Group>

              <Button
                variant="primary"
                onClick={handleInscribir}
                disabled={enrolling}
                className="d-flex align-items-center"
              >
                {enrolling && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                {enrolling ? "Inscribiendo..." : "Inscribir Alumno"}
              </Button>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminCarreras;
