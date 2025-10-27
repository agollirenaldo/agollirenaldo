import { formatDistanceToNow } from "date-fns";
import type { Notification } from "../types";

interface NotificationFeedProps {
  notifications: Notification[];
}

export function NotificationFeed({ notifications }: NotificationFeedProps) {
  if (!notifications.length) {
    return <p className="empty-state">Asnjë njoftim i ri.</p>;
  }

  return (
    <ul className="notification-feed">
      {notifications.map((notification) => (
        <li key={notification.id} className="notification-feed__item notification-feed__item--info">
          <span className="material-symbols-rounded">notifications</span>
          <div>
            <p>
              <strong>{notification.title}</strong>
            </p>
            <p>{notification.body}</p>
            <span>
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </span>
          </div>
          {!notification.is_read && <span className="notification-feed__dot" />}
        </li>
      ))}
    </ul>
  );
}
