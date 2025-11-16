import { useEffect, useMemo, useState } from "react";

type Carrera = {
  id: number;
  name: string;
  active?: boolean;
};

type Alumno = {
  id: number;
  nombre: string;
  apellido: string;
};

type SelectOption = {
  value: number;
  label: string;
};

const BASE_URL = "http://localhost:8000";

export function useAdminCarreras() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [nombreCarrera, setNombreCarrera] = useState<string>("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<number | null>(null);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<number | null>(null);

  const token = localStorage.getItem("token");

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

  const fetchAlumnos = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/alumnos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAlumnos(data);
    } catch (error) {
      console.error("Error al obtener alumnos", error);
    }
  };

  useEffect(() => {
    fetchCarreras();
    fetchAlumnos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuardar = async () => {
    if (!nombreCarrera.trim()) return;

    const url = editandoId ? `${BASE_URL}/careers/${editandoId}` : `${BASE_URL}/career/add`;
    const method = editandoId ? "PUT" : "POST";
    const body = JSON.stringify(
      editandoId ? { name: nombreCarrera, active: true } : { name: nombreCarrera }
    );

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (res.ok) {
        setMensaje(editandoId ? "OK: Carrera actualizada." : "OK: Carrera agregada.");
        setNombreCarrera("");
        setEditandoId(null);
        fetchCarreras();
      } else {
        setMensaje("ERROR: No se pudo guardar la carrera.");
      }
    } catch {
      setMensaje("ERROR: Problema de red al guardar carrera.");
    } finally {
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const handleEditar = (carrera: Carrera) => {
    setNombreCarrera(carrera.name);
    setEditandoId(carrera.id);
  };

  const handleEliminar = async (id: number) => {
    try {
      const res = await fetch(`${BASE_URL}/careers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMensaje("OK: Carrera eliminada logicamente.");
        fetchCarreras();
      } else {
        setMensaje("ERROR: No se pudo eliminar la carrera.");
      }
    } catch {
      setMensaje("ERROR: Problema de red al eliminar.");
    } finally {
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const handleInscribir = async () => {
    const id_user = alumnoSeleccionado ?? 0;
    const id_career = carreraSeleccionada ?? 0;

    if (!id_user || !id_career) return;

    try {
      const res = await fetch(`${BASE_URL}/user/addcareer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_user, id_career }),
      });
      const data = await res.text();
      setMensaje(`OK: ${data}`);
      setTimeout(() => setMensaje(null), 4000);
    } catch {
      setMensaje("ERROR: No se pudo inscribir al alumno.");
    }
  };

  const alumnoOptions: SelectOption[] = useMemo(
    () =>
      alumnos.map((alumno) => ({
        value: alumno.id,
        label: `${alumno.nombre} ${alumno.apellido}`,
      })),
    [alumnos]
  );

  const carreraOptions: SelectOption[] = useMemo(
    () =>
      carreras.map((carrera) => ({
        value: carrera.id,
        label: carrera.name,
      })),
    [carreras]
  );

  return {
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
  };
}

