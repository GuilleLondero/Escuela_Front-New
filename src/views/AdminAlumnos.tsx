import { Button, Table, Card, Form, Tabs, Tab, Alert } from "react-bootstrap";
import Select from "react-select";
import { useAdminAlumnos } from "../hooks/useAdminAlumnos";

const AdminAlumnos = () => {
  const {
    alumnos,
    mensaje,
    nuevo,
    carreraOptions,
    handleChange,
    handleCarreraSelect,
    handleCrearAlumno,
  } = useAdminAlumnos();

  const alertVariant = mensaje && mensaje.startsWith("OK") ? "success" : "danger";

  return (
    <div className="container mt-5">
      <Card className="p-4 shadow-sm bg-white text-dark">
        <h4 className="fw-bold mb-4">Listado de Alumnos</h4>

        {mensaje && <Alert variant={alertVariant}>{mensaje}</Alert>}

        <Tabs defaultActiveKey="lista">
          <Tab eventKey="lista" title="Lista de alumnos">
            {alumnos.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className="text-center">#</th>
                    <th className="text-center">Nombre</th>
                    <th className="text-center">Apellido</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">Carreras</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnos.map((alumno, i) => (
                    <tr key={alumno.id}>
                      <td className="align-middle text-center">{i + 1}</td>
                      <td className="align-middle text-center">{alumno.nombre}</td>
                      <td className="align-middle text-center">{alumno.apellido}</td>
                      <td className="align-middle text-center">{alumno.email}</td>
                      <td className="align-middle">
                        {alumno.carreras.map((c, idx) => (
                          <div key={idx} className="small">
                            {c}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-muted">No hay alumnos registrados.</p>
            )}
          </Tab>

          <Tab eventKey="crear" title="Crear nuevo alumno">
            <Form>
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
                <Form.Label>Contrasena</Form.Label>
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
              <Button onClick={handleCrearAlumno}>Crear Alumno</Button>
            </Form>
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminAlumnos;
