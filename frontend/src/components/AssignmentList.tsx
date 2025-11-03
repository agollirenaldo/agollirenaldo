import { format } from "date-fns";
import type { Assignment } from "../types";

interface AssignmentListProps {
  assignments: Assignment[];
}

export function AssignmentList({ assignments }: AssignmentListProps) {
  if (!assignments.length) {
    return <p className="empty-state">Nuk ka detyra për momentin.</p>;
  }

  return (
    <ul className="timeline">
      {assignments.map((assignment) => (
        <li key={assignment.id} className="timeline__item">
          <div className="timeline__status" />
          <div className="timeline__content">
            <div className="timeline__header">
              <h3>{assignment.title}</h3>
              <span className="badge">Max {assignment.max_score} pikë</span>
            </div>
            <p>{assignment.description}</p>
            {assignment.due_date && (
              <div className="timeline__meta">
                <span className="material-symbols-rounded">calendar_month</span>
                Afati: {format(new Date(assignment.due_date), "d MMM, HH:mm")}
              </div>
            )}
            {assignment.lesson_id && (
              <div className="timeline__meta">
                <span className="material-symbols-rounded">menu_book</span>
                Leksioni #{assignment.lesson_id}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
