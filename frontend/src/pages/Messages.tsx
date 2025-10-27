import { useEffect, useState } from "react";

import { MessagingCenter } from "../components/MessagingCenter";
import { useAuth } from "../context/AuthContext";
import { apiClient, withAuth } from "../services/apiClient";
import type { Message } from "../types";

export function Messages() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function loadMessages() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get<Message[]>("/messages/inbox", withAuth(token));
        setMessages(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Nuk u ngarkuan mesazhet");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadMessages();
  }, [token]);

  if (isLoading) {
    return <p className="empty-state">Duke hapur qendrën e mesazheve...</p>;
  }

  if (error) {
    return <p className="empty-state">{error}</p>;
  }

  return (
    <section>
      <div className="section-header">
        <h2>Mesazhet e mia</h2>
        <span>{messages.length} në inbox</span>
      </div>
      <MessagingCenter messages={messages} />
    </section>
  );
}
