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
  } = useAdminCarreras();

  const alertVariant = mensaje && mensaje.startsWith("OK") ? "success" : "danger";

  return (
    <div className="container mt-5">
      <Card className="p-4 bg-white text-dark shadow-sm">
        <h4 className="fw-bold mb-3">Gestion de Carreras e Inscripcion</h4>

        <div style={{ minHeight: "40px" }}>
          {mensaje && <Alert variant={alertVariant}>{mensaje}</Alert>}
        </div>

        <Tabs defaultActiveKey="gestion" className="mb-3">
          <Tab eventKey="gestion" title="Gestion de Carreras">
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
            ) : (
              <p className="text-muted">No hay carreras activas</p>
            )}
          </Tab>

          <Tab eventKey="inscripcion" title="Inscripcion de Alumnos">
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
