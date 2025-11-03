import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { AssignmentList } from "../components/AssignmentList";
import { QuizList } from "../components/QuizList";
import { useAuth } from "../context/AuthContext";
import { apiClient, withAuth } from "../services/apiClient";
import type { Assignment, CourseDetail as CourseDetailType, Quiz } from "../types";

export function CourseDetail() {
  const { id } = useParams();
  const courseId = Number(id);
  const { token } = useAuth();
  const [course, setCourse] = useState<CourseDetailType | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || Number.isNaN(courseId)) {
      return;
    }

    async function loadCourse() {
      try {
        setIsLoading(true);
        setError(null);
        const [courseResponse, assignmentsResponse, quizzesResponse] = await Promise.all([
          apiClient.get<CourseDetailType>(`/courses/${courseId}`, withAuth(token)),
          apiClient.get<Assignment[]>(`/assignments/course/${courseId}`, withAuth(token)),
          apiClient.get<Quiz[]>(`/quizzes/course/${courseId}`, withAuth(token)),
        ]);
        setCourse(courseResponse.data);
        setAssignments(assignmentsResponse.data);
        setQuizzes(quizzesResponse.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Nuk u gjet kursi");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadCourse();
  }, [courseId, token]);

  const totalDuration = useMemo(() => {
    if (!course) {
      return 0;
    }
    return course.modules
      .flatMap((module) => module.lessons)
      .reduce((acc, lesson) => acc + (lesson?.duration_minutes ?? 0), 0);
  }, [course]);

  if (isLoading) {
    return <p className="empty-state">Duke ngarkuar detajet e kursit...</p>;
  }

  if (error) {
    return <p className="empty-state">{error}</p>;
  }

  if (!course) {
    return <p className="empty-state">Kursi nuk u gjet.</p>;
  }

  return (
    <div className="course-detail" style={{ display: "grid", gap: "32px" }}>
      <section className="course-detail__hero" style={{ display: "grid", gap: "16px" }}>
        <div>
          <span className="badge">{course.category ?? "Pa kategori"}</span>
          <h1>{course.title}</h1>
          <p style={{ color: "#475569", lineHeight: 1.6 }}>{course.description}</p>
        </div>
        <div className="course-detail__meta" style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <div className="stat-card stat-card--blue" style={{ minWidth: "200px" }}>
            <div className="stat-card__icon">
              <span className="material-symbols-rounded">schedule</span>
            </div>
            <div className="stat-card__body">
              <p className="stat-card__title">Kohëzgjatja totale</p>
              <p className="stat-card__value">{Math.round(totalDuration / 60)} orë</p>
            </div>
          </div>
          <div className="stat-card stat-card--purple" style={{ minWidth: "200px" }}>
            <div className="stat-card__icon">
              <span className="material-symbols-rounded">view_in_ar</span>
            </div>
            <div className="stat-card__body">
              <p className="stat-card__title">Modulet</p>
              <p className="stat-card__value">{course.modules.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="course-detail__modules" style={{ display: "grid", gap: "20px" }}>
        <h2>Struktura e kursit</h2>
        <div style={{ display: "grid", gap: "16px" }}>
          {course.modules.map((module) => (
            <article key={module.id} className="discussion-card">
              <header className="discussion-card__header">
                <h3>{module.title}</h3>
                <span>Rendi #{module.order}</span>
              </header>
              {module.description && (
                <p style={{ marginTop: "12px", color: "#475569" }}>{module.description}</p>
              )}
              <ul className="discussion-card__replies" style={{ marginTop: "16px" }}>
                {module.lessons.map((lesson, index) => (
                  <li key={index}>
                    <div className="discussion-card__reply-meta">
                      <strong>{lesson.title}</strong>
                      <span>{lesson.duration_minutes} min</span>
                    </div>
                    <p>{lesson.content?.slice(0, 160) ?? "Pa përmbajtje"}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="course-detail__assignments" style={{ display: "grid", gap: "16px" }}>
        <h2>Detyrat</h2>
        <AssignmentList assignments={assignments} />
      </section>

      <section className="course-detail__quizzes" style={{ display: "grid", gap: "16px" }}>
        <h2>Quiz-et</h2>
        <QuizList quizzes={quizzes} />
      </section>
    </div>
  );
}
