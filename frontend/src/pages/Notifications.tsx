import { useEffect, useState } from "react";

import { NotificationFeed } from "../components/NotificationFeed";
import { useAuth } from "../context/AuthContext";
import { apiClient, withAuth } from "../services/apiClient";
import type { Notification } from "../types";

export function Notifications() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function loadNotifications() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get<Notification[]>("/notifications", withAuth(token));
        setNotifications(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Nuk u ngarkuan njoftimet");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadNotifications();
  }, [token]);

  if (isLoading) {
    return <p className="empty-state">Duke grumbulluar njoftimet inteligjente...</p>;
  }

  if (error) {
    return <p className="empty-state">{error}</p>;
  }

  return (
    <section>
      <div className="section-header">
        <h2>Njoftimet</h2>
        <span>{notifications.length} të reja</span>
      </div>
      <NotificationFeed notifications={notifications} />
    </section>
  );
}
