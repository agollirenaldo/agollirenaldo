import { useEffect, useState } from "react";

import { DiscussionBoard } from "../components/DiscussionBoard";
import { useAuth } from "../context/AuthContext";
import { apiClient, withAuth } from "../services/apiClient";
import type { CourseSummary, DiscussionThread } from "../types";

export function Discussions() {
  const { token } = useAuth();
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function loadThreads() {
      try {
        setIsLoading(true);
        setError(null);
        const coursesResponse = await apiClient.get<CourseSummary[]>("/courses", withAuth(token));
        const threadRequests = coursesResponse.data.map((course) =>
          apiClient.get<DiscussionThread[]>(`/discussions/course/${course.id}`, withAuth(token))
        );
        const threadResults = await Promise.all(threadRequests);
        setThreads(threadResults.flatMap((result) => result.data));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Nuk u ngarkuan diskutimet");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadThreads();
  }, [token]);

  if (isLoading) {
    return <p className="empty-state">Duke hapur diskutimet e komunitetit...</p>;
  }

  if (error) {
    return <p className="empty-state">{error}</p>;
  }

  return (
    <section>
      <div className="section-header">
        <h2>Diskutimet</h2>
        <span>{threads.length} tema</span>
      </div>
      <DiscussionBoard threads={threads} />
    </section>
  );
}
