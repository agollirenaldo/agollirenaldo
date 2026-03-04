import { formatDistanceToNow } from "date-fns";
import type { DiscussionThread } from "../types";

interface DiscussionBoardProps {
  threads: DiscussionThread[];
}

export function DiscussionBoard({ threads }: DiscussionBoardProps) {
  if (!threads.length) {
    return <p className="empty-state">Nuk ka diskutime ende.</p>;
  }

  return (
    <div className="discussion-board">
      {threads.map((thread) => (
        <article key={thread.id} className="discussion-card">
          <header className="discussion-card__header">
            <h3>{thread.title}</h3>
            <span className="discussion-card__timestamp">
              {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
            </span>
          </header>
          <ul className="discussion-card__replies">
            {thread.posts.map((post) => (
              <li key={post.id}>
                <div className="discussion-card__reply-meta">
                  <strong>Përdorues #{post.author_id}</strong>
                  <span>
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
          <button type="button" className="ghost-button ghost-button--inline">
            <span className="material-symbols-rounded">reply</span>
            Përgjigju
          </button>
        </article>
      ))}
    </div>
  );
}
