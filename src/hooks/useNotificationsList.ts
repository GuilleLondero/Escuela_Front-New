import { useEffect, useState } from "react";

type ApiNotification = {
  id: number;
  message?: string;
  mensaje?: string;
  created_at: string;
};

export type NotificationItem = {
  id: number;
  message: string;
  created_at: string;
};

export function useNotificationsList() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/notifications")
      .then((res) => res.json())
      .then((data: ApiNotification[]) => {
        const parsed = Array.isArray(data)
          ? data.map((n) => ({
              id: n.id,
              message: n.message ?? n.mensaje ?? "",
              created_at: n.created_at,
            }))
          : [];
        setNotifications(parsed);
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  return { notifications, loading };
}

