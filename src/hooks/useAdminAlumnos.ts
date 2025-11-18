import { useEffect, useMemo, useState } from "react";

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

interface NuevoAlumno {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  dni: string;
  type: "alumno";
  email: string;
  id_career: string;
}

type SelectOption = {
  value: string;
  label: string;
};

const INITIAL_FORM: NuevoAlumno = {
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  dni: "",
  type: "alumno",
  email: "",
  id_career: "",
};

const BASE_URL = "http://localhost:8000";

export function useAdminAlumnos() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [nuevo, setNuevo] = useState<NuevoAlumno>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const token = localStorage.getItem("token");

  const fetchAlumnos = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/alumnos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAlumnos(data);
      setPage(1);
    } catch (error) {
      console.error("Error al obtener alumnos", error);
    }
  };

  const fetchCarreras = async () => {
    try {
      const res = await fetch(`${BASE_URL}/careers/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCarreras(data);
    } catch (error) {
      console.error("Error al obtener carreras", error);
    }
  };

  useEffect(() => {
    fetchAlumnos();
    fetchCarreras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCarreraSelect = (value: string | null) => {
    setNuevo((prev) => ({ ...prev, id_career: value ?? "" }));
  };

  const handleCrearAlumno = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
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

      const res = await fetch(`${BASE_URL}/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (nuevo.id_career !== "") {
          const res2 = await fetch(`${BASE_URL}/users/alumnos`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const alumnosData = await res2.json();
          const nuevoAlumno = alumnosData.find((a: Alumno) => a.username === nuevo.username);

          if (nuevoAlumno) {
            await fetch(`${BASE_URL}/user/addcareer`, {
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
        setMensaje("OK: Alumno creado correctamente.");
        fetchAlumnos();
        setNuevo(INITIAL_FORM);
      } else {
        setMensaje("ERROR: No se pudo crear el alumno.");
      }
    } catch {
      setMensaje("ERROR: Problema de red al crear alumno.");
    } finally {
      setTimeout(() => setMensaje(null), 3000);
      setIsSubmitting(false);
    }
  };

  const carreraOptions: SelectOption[] = useMemo(
    () =>
      carreras.map((carrera) => ({
        value: String(carrera.id),
        label: carrera.name,
      })),
    [carreras]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(alumnos.length / pageSize)),
    [alumnos.length, pageSize]
  );

  const alumnosPaginados = useMemo(
    () => alumnos.slice((page - 1) * pageSize, page * pageSize),
    [alumnos, page, pageSize]
  );

  const nextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const goToPage = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  return {
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
    goToPage,
  };
}
