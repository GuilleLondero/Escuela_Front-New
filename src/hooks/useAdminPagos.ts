import { useEffect, useMemo, useState } from "react";

type Alumno = {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
};

type Pago = {
  id: number;
  amount: number;
  fecha_pago: string;
  carrera: string;
  mes_afectado: string;
};

type NuevoPago = {
  id_user: number;
  id_career: number;
  amount: string | number;
  affected_month: string;
};

type Carrera = {
  id: number;
  name: string;
};

type CarrerasFilterOption = {
  value: string;
  label: string;
};

type CarrerasSelectOption = {
  value: number;
  label: string;
};

const BASE_URL = "http://localhost:8000";

export function useAdminPagos() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [selectedAlumno, setSelectedAlumno] = useState<string>("");
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [filtroCarrera, setFiltroCarrera] = useState<string>("");
  const [nuevoPago, setNuevoPago] = useState<NuevoPago | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [pagoEditando, setPagoEditando] = useState<Pago | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const alumnosRes = await fetch(`${BASE_URL}/users/alumnos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const alumnosData = await alumnosRes.json();
        setAlumnos(alumnosData);

        const carrerasRes = await fetch(`${BASE_URL}/careers/active`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const carrerasData = await carrerasRes.json();
        setCarreras(Array.isArray(carrerasData) ? carrerasData : []);
      } catch (error) {
        console.error("Error cargando datos iniciales", error);
      }
    };

    fetchInitialData();
  }, [token]);

  const fetchPagos = async (username: string) => {
    try {
      const res = await fetch(`${BASE_URL}/payment/user/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPagos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar pagos", err);
    }
  };

  const handleAlumnoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const username = e.target.value;
    setSelectedAlumno(username);
    setMensaje(null);
    setPagos([]);
    setNuevoPago(null);
    setPagoEditando(null);

    if (!username) return;
    const alumno = alumnos.find((a) => a.username === username);
    if (alumno) {
      setNuevoPago({
        id_user: alumno.id,
        id_career: carreras.length > 0 ? carreras[0].id : 1,
        amount: "",
        affected_month: "",
      });
      fetchPagos(username);
    }
  };

  const handleNuevoPagoAmount = (value: string) => {
    if (!nuevoPago) return;
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setNuevoPago({ ...nuevoPago, amount: value });
    }
  };

  const handleNuevoPagoMonth = (value: string) => {
    if (!nuevoPago) return;
    setNuevoPago({ ...nuevoPago, affected_month: value });
  };

  const handleNuevoPagoCarrera = (value: number | null) => {
    if (!nuevoPago) return;
    if (typeof value === "number") {
      setNuevoPago({ ...nuevoPago, id_career: value });
    }
  };

  const handleAgregarPago = async () => {
    if (!nuevoPago) return;
    const amount = Number(nuevoPago.amount);
    if (!nuevoPago.amount || amount <= 0 || isNaN(amount)) {
      setMensaje(" El monto debe ser mayor a 0");
      return;
    }
    if (!nuevoPago.affected_month.trim()) {
      setMensaje(" Debe especificar el mes afectado");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/payment/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...nuevoPago, amount }),
      });
      if (res.ok) {
        setMensaje("¡Pago registrado correctamente!");
        setTimeout(() => setMensaje(null), 3000);
        fetchPagos(selectedAlumno);
        setNuevoPago({ ...nuevoPago, amount: "", affected_month: "" });
      } else {
        const data = await res.json();
        setMensaje(` Error: ${data.message || JSON.stringify(data)}`);
      }
    } catch {
      setMensaje(" Error de red al agregar pago.");
    }
  };

  const handleEditarPago = (pago: Pago) => {
    setPagoEditando(pago);
    const carreraEncontrada = carreras.find((c) => c.name === pago.carrera);
    setNuevoPago({
      id_user: nuevoPago?.id_user || 0,
      id_career: carreraEncontrada?.id || 0,
      amount: pago.amount,
      affected_month: "",
    });
  };

  const handleConfirmarEdicion = async () => {
    if (!pagoEditando || !nuevoPago) return;
    try {
      const res = await fetch(`${BASE_URL}/payments/${pagoEditando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoPago),
      });
      if (res.ok) {
        setMensaje("¡Pago actualizado correctamente!");
        setTimeout(() => setMensaje(null), 3000);
        fetchPagos(selectedAlumno);
        setPagoEditando(null);
      } else {
        const data = await res.json();
        setMensaje(` Error al actualizar: ${data.message || "Error interno"}`);
      }
    } catch {
      setMensaje(" Error de red al actualizar");
    }
  };

  const handleEliminarPago = async (id: number) => {
    try {
      const res = await fetch(`${BASE_URL}/payment/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMensaje("¡Pago eliminado correctamente!");
        setTimeout(() => setMensaje(null), 3000);
        fetchPagos(selectedAlumno);
      } else {
        setMensaje(" Error al eliminar el pago.");
      }
    } catch {
      setMensaje(" Error de red al eliminar.");
    }
  };

  const carrerasDisponibles = useMemo(
    () => [...new Set(pagos.map((p) => p.carrera))],
    [pagos]
  );

  const carreraFilterOptions: CarrerasFilterOption[] = useMemo(
    () =>
      carrerasDisponibles.map((carrera) => ({
        label: carrera,
        value: carrera,
      })),
    [carrerasDisponibles]
  );

  const carreraSelectOptions: CarrerasSelectOption[] = useMemo(
    () =>
      carreras.map((carrera) => ({
        label: carrera.name,
        value: carrera.id,
      })),
    [carreras]
  );

  const pagosFiltrados = useMemo(
    () =>
      filtroCarrera
        ? pagos.filter((p) => p.carrera === filtroCarrera)
        : pagos,
    [pagos, filtroCarrera]
  );

  const tieneEdicion = Boolean(pagoEditando);

  return {
    alumnos,
    selectedAlumno,
    pagosFiltrados,
    filtroCarrera,
    carrerasDisponibles,
    mensaje,
    nuevoPago,
    carreraFilterOptions,
    carreraSelectOptions,
    handleAlumnoChange,
    handleFiltroCarreraChange: setFiltroCarrera,
    handleAgregarPago,
    handleNuevoPagoAmount,
    handleNuevoPagoMonth,
    handleNuevoPagoCarrera,
    handleEditarPago,
    handleEliminarPago,
    handleConfirmarEdicion,
    tieneEdicion,
  };
}
