import type { Quiz } from "../types";

interface QuizListProps {
  quizzes: Quiz[];
}

export function QuizList({ quizzes }: QuizListProps) {
  if (!quizzes.length) {
    return <p className="empty-state">Nuk ka quiz të disponueshëm.</p>;
  }

  return (
    <div className="card-list">
      {quizzes.map((quiz) => (
        <article key={quiz.id} className="quiz-card">
          <header className="quiz-card__header">
            <span className="material-symbols-rounded">quiz</span>
            <h3>{quiz.title}</h3>
          </header>
          {quiz.description && <p className="quiz-card__meta">{quiz.description}</p>}
          <p className="quiz-card__status">
            Kursi #{quiz.course_id} • {quiz.time_limit_minutes ?? 20} minuta limit kohor
          </p>
          <button type="button" className="primary-button primary-button--block">
            Nis vlerësimin
          </button>
        </article>
      ))}
    </div>
  );
}
