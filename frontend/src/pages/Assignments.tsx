import { useEffect, useState } from "react";

import { AssignmentList } from "../components/AssignmentList";
import { useAuth } from "../context/AuthContext";
import { apiClient, withAuth } from "../services/apiClient";
import type { Assignment, CourseSummary } from "../types";

export function Assignments() {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function loadAssignments() {
      try {
        setIsLoading(true);
        setError(null);
        const coursesResponse = await apiClient.get<CourseSummary[]>("/courses", withAuth(token));
        const assignmentRequests = coursesResponse.data.map((course) =>
          apiClient.get<Assignment[]>(`/assignments/course/${course.id}`, withAuth(token))
        );
        const assignmentResults = await Promise.all(assignmentRequests);
        const merged = assignmentResults.flatMap((result) => result.data);
        setAssignments(merged);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Nuk u ngarkuan detyrat");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadAssignments();
  }, [token]);

  if (isLoading) {
    return <p className="empty-state">Duke përgatitur detyrat e tua...</p>;
  }

  if (error) {
    return <p className="empty-state">{error}</p>;
  }

  return (
    <section>
      <div className="section-header">
        <h2>Detyrat</h2>
        <span>{assignments.length} detyra aktive</span>
      </div>
      <AssignmentList assignments={assignments} />
    </section>
  );
}
