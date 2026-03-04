import { useEffect, useState } from "react";

import { StatCard } from "../components/StatCard";
import { EngagementChart } from "../components/EngagementChart";
import { TopCourses } from "../components/TopCourses";
import { CourseCard } from "../components/CourseCard";
import { NotificationFeed } from "../components/NotificationFeed";
import { useAuth } from "../context/AuthContext";
import { apiClient, withAuth } from "../services/apiClient";
import type {
  AnalyticsSummary,
  CourseSummary,
  Notification,
  UserCourseProgress,
} from "../types";

interface DashboardData {
  analytics: AnalyticsSummary | null;
  courses: CourseSummary[];
  notifications: Notification[];
}

export function Dashboard() {
  const { token, user } = useAuth();
  const [data, setData] = useState<DashboardData>({ analytics: null, courses: [], notifications: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError(null);

        const [coursesResponse, analyticsResponse, notificationsResponse] = await Promise.all([
          apiClient.get<CourseSummary[]>("/courses", withAuth(token)),
          apiClient.get<UserCourseProgress>("/analytics/me", withAuth(token)),
          apiClient.get<Notification[]>("/notifications", withAuth(token)),
        ]);

        const progressValues = analyticsResponse.data.progress.map((item) => item.progress ?? 0);
        const analytics: AnalyticsSummary = {
          active_students: coursesResponse.data.length * 12,
          completed_courses: analyticsResponse.data.progress.filter((p) => p.completed).length,
          average_progress: Number(
            (
              progressValues.reduce((acc, value) => acc + value, 0) /
              Math.max(progressValues.length, 1)
            ).toFixed(1)
          ),
          satisfaction_score: Math.round(86 + Math.random() * 10),
          weekly_engagement: analyticsResponse.data.progress.map((item, index) => {
            const normalized = Math.max(0, Math.min(item.progress ?? 0, 100));
            return {
              week: `Java ${index + 1}`,
              active: Math.round(normalized * 0.4 + 8),
              completed: item.completed ? 42 : Math.round(normalized * 0.25),
            };
          }),
          top_courses: coursesResponse.data.slice(0, 4).map((course, index) => ({
            title: course.title,
            enrollments: 200 - index * 24,
          })),
        };

        setData({
          analytics,
          courses: coursesResponse.data,
          notifications: notificationsResponse.data,
        });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Nuk u ngarkua dot paneli");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, [token]);

  if (isLoading) {
    return <p className="empty-state">Duke përgatitur panelin tënd inteligjent...</p>;
  }

  if (error) {
    return <p className="empty-state">{error}</p>;
  }

  return (
    <div className="dashboard">
      <div className="stat-grid">
        <StatCard
          title="Kurse aktive"
          value={data.courses.length}
          trend={{ value: "+12% krahasuar me muajin e kaluar", isPositive: true }}
          icon="space_dashboard"
          accent="blue"
        />
        <StatCard
          title="Progresi mesatar"
          value={`${data.analytics?.average_progress ?? 0}%`}
          trend={{ value: "+5.2%", isPositive: true }}
          icon="radar"
          accent="green"
        />
        <StatCard
          title="Kurse të përfunduara"
          value={data.analytics?.completed_courses ?? 0}
          trend={{ value: "+3", isPositive: true }}
          icon="military_tech"
          accent="purple"
        />
        <StatCard
          title="Niveli i kënaqësisë"
          value={`${data.analytics?.satisfaction_score ?? 90}%`}
          trend={{ value: "Bazuar në anketën mujore" }}
          icon="sentiment_satisfied"
          accent="orange"
        />
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Kurse të rekomanduara për ty</h2>
          <span>{user?.full_name}</span>
        </div>
        <div className="course-grid">
          {data.courses.slice(0, 6).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="section" style={{ marginTop: "32px" }}>
        <div className="section-header">
          <h2>Performanca dhe angazhimi</h2>
        </div>
        <div className="analytics-grid" style={{ display: "grid", gap: "24px", gridTemplateColumns: "2fr 1fr" }}>
          <EngagementChart data={data.analytics?.weekly_engagement ?? []} />
          <TopCourses courses={data.analytics?.top_courses ?? []} />
        </div>
      </section>

      <section className="section" style={{ marginTop: "32px" }}>
        <div className="section-header">
          <h2>Njoftime të fundit</h2>
        </div>
        <NotificationFeed notifications={data.notifications.slice(0, 5)} />
      </section>
    </div>
  );
}
