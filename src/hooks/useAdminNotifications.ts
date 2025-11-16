import { useEffect, useState } from "react";

type Notificacion = {
  id: number;
  mensaje: string;
  created_at: string;
};

const BASE_URL = "http://localhost:8000";

export function useAdminNotifications() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [mensajeStatus, setMensajeStatus] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const token = localStorage.getItem("token");

  const fetchNotificaciones = async () => {
    try {
      const res = await fetch(`${BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotificaciones(data);
    } catch (err) {
      console.error("Error al obtener notificaciones", err);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    const url = editandoId ? `${BASE_URL}/notifications/${editandoId}` : `${BASE_URL}/notifications`;
    const method = editandoId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: mensaje }),
      });

      if (res.ok) {
        setMensajeStatus(editandoId ? "OK: Notificacion editada." : "OK: Notificacion publicada.");
        setMensaje("");
        setEditandoId(null);
        fetchNotificaciones();
      } else {
        setMensajeStatus("ERROR: No se pudo guardar la notificacion.");
      }
    } catch {
      setMensajeStatus("ERROR: Problema de red.");
    } finally {
      setTimeout(() => setMensajeStatus(null), 3000);
    }
  };

  const handleEditar = (n: Notificacion) => {
    setMensaje(n.mensaje);
    setEditandoId(n.id);
  };

  const handleEliminar = async (id: number) => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMensajeStatus("OK: Notificacion eliminada.");
        fetchNotificaciones();
      } else {
        setMensajeStatus("ERROR: No se pudo eliminar.");
      }
    } catch {
      setMensajeStatus("ERROR: Problema de red.");
    } finally {
      setTimeout(() => setMensajeStatus(null), 3000);
    }
  };

  return {
    notificaciones,
    mensaje,
    mensajeStatus,
    editandoId,
    setMensaje,
    handleSubmit,
    handleEditar,
    handleEliminar,
  };
}

