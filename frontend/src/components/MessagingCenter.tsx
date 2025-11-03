import { format } from "date-fns";
import type { Message } from "../types";

interface MessagingCenterProps {
  messages: Message[];
}

export function MessagingCenter({ messages }: MessagingCenterProps) {
  if (!messages.length) {
    return <p className="empty-state">Nuk ka mesazhe të reja.</p>;
  }

  return (
    <div className="messaging-center">
      {messages.map((message) => (
        <article key={message.id} className="message-card">
          <header className="message-card__header">
            <h3>Mesazh nga #{message.sender_id}</h3>
            <span>{format(new Date(message.created_at), "d MMM, HH:mm")}</span>
          </header>
          <p className="message-card__meta">Për #{message.recipient_id}</p>
          <p className="message-card__body">{message.content}</p>
          <footer className="message-card__footer">
            <button type="button" className="ghost-button ghost-button--inline">
              Përgjigju
            </button>
            <button type="button" className="ghost-button ghost-button--inline">
              Arkivo
            </button>
          </footer>
        </article>
      ))}
    </div>
  );
}
