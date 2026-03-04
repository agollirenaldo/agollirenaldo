import { useEffect, useState } from "react";

import { CourseCard } from "../components/CourseCard";
import { useAuth } from "../context/AuthContext";
import { apiClient, withAuth } from "../services/apiClient";
import type { CourseSummary } from "../types";

export function Courses() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }
    async function loadCourses() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get<CourseSummary[]>("/courses", withAuth(token));
        setCourses(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Nuk u ngarkuan dot kurset");
        }
      } finally {
        setIsLoading(false);
      }
    }
    void loadCourses();
  }, [token]);

  if (isLoading) {
    return <p className="empty-state">Duke ngarkuar bibliotekën e kurseve...</p>;
  }

  if (error) {
    return <p className="empty-state">{error}</p>;
  }

  return (
    <section>
      <div className="section-header">
        <h2>Biblioteka e kurseve</h2>
        <span>{courses.length} kurse</span>
      </div>
      <div className="course-grid">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
