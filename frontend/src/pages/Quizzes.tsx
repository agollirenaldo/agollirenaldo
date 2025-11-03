import { useEffect, useState } from "react";

import { QuizList } from "../components/QuizList";
import { useAuth } from "../context/AuthContext";
import { apiClient, withAuth } from "../services/apiClient";
import type { CourseSummary, Quiz } from "../types";

export function Quizzes() {
  const { token } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function loadQuizzes() {
      try {
        setIsLoading(true);
        setError(null);
        const coursesResponse = await apiClient.get<CourseSummary[]>("/courses", withAuth(token));
        const quizRequests = coursesResponse.data.map((course) =>
          apiClient.get<Quiz[]>(`/quizzes/course/${course.id}`, withAuth(token))
        );
        const quizResults = await Promise.all(quizRequests);
        setQuizzes(quizResults.flatMap((result) => result.data));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Nuk u ngarkuan quiz-et");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadQuizzes();
  }, [token]);

  if (isLoading) {
    return <p className="empty-state">Duke përgatitur quiz-et...</p>;
  }

  if (error) {
    return <p className="empty-state">{error}</p>;
  }

  return (
    <section>
      <div className="section-header">
        <h2>Quiz-et</h2>
        <span>{quizzes.length} quiz në dispozicion</span>
      </div>
      <QuizList quizzes={quizzes} />
    </section>
  );
}
