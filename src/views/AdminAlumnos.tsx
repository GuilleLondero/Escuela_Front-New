import { useEffect, useState } from "react";
import { Button, Table, Card, Form, Tabs, Tab, Alert } from "react-bootstrap";

// Tipado de datos
interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  carreras: string[];
  username: string;
}

interface Carrera {
  id: number;
  name: string;
}

const AdminAlumnos = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [nuevo, setNuevo] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    dni: "",
    type: "alumno",
    email: "",
    id_career: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAlumnos();
    fetchCarreras();
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrearAlumno = async () => {
    try {
      const body = {
        username: nuevo.username,
        password: nuevo.password,
        firstname: nuevo.firstname,
        lastname: nuevo.lastname,
        dni: parseInt(nuevo.dni),
        type: "alumno",
        email: nuevo.email,
      };

      const res = await fetch("http://localhost:8000/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (nuevo.id_career !== "") {
          const res2 = await fetch("http://localhost:8000/users/alumnos", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const alumnos = await res2.json();
          const nuevoAlumno = alumnos.find((a: Alumno) => a.username === nuevo.username);

          if (nuevoAlumno) {
            await fetch("http://localhost:8000/user/addcareer", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                id_user: nuevoAlumno.id,
                id_career: parseInt(nuevo.id_career),
              }),
            });
          }
        }
        setMensaje("✅ Alumno creado correctamente.");
        fetchAlumnos();
        setNuevo({
          username: "",
          password: "",
          firstname: "",
          lastname: "",
          dni: "",
          type: "alumno",
          email: "",
          id_career: ""
        });
      } else {
        setMensaje("❌ Error al crear alumno.");
      }
    } catch {
      setMensaje("❌ Error de red al crear alumno.");
    } finally {
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  return (
    <div className="container mt-5">
      <Card className="p-4 shadow-sm bg-white text-dark">
        <h4 className="fw-bold mb-4">Listado de Alumnos</h4>

        {mensaje && (
          <Alert variant={mensaje.includes("✅") ? "success" : "danger"}>{mensaje}</Alert>
        )}

        <Tabs defaultActiveKey="lista">
          <Tab eventKey="lista" title="📋 Lista de alumnos">
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
                        {alumno.carreras.map((c, i) => (
                          <div key={i} className="small">{c}</div>
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

          <Tab eventKey="crear" title="🧑‍🎓 Crear nuevo alumno">
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
                <Form.Control type="email" name="email" value={nuevo.email} onChange={handleChange} />
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
                <Form.Control type="password" name="password" value={nuevo.password} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Asignar a una carrera (opcional)</Form.Label>
                <Form.Select name="id_career" value={nuevo.id_career} onChange={handleChange}>
                  <option value="">-- Ninguna --</option>
                  {carreras.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Form.Select>
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
