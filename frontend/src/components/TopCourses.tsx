interface TopCoursesProps {
  courses: Array<{ title: string; enrollments: number }>;
}

export function TopCourses({ courses }: TopCoursesProps) {
  if (!courses.length) {
    return <p className="empty-state">Nuk ka kurse të preferuara për momentin.</p>;
  }

  return (
    <div className="top-courses">
      <h3>Kurse me performancën më të mirë</h3>
      <ul>
        {courses.map((course) => (
          <li key={course.title}>
            <div>
              <p>{course.title}</p>
              <span>{course.enrollments} regjistrime</span>
            </div>
            <div className="top-courses__meter">
              <div
                style={{
                  width: `${
                    courses[0].enrollments === 0
                      ? 0
                      : Math.min(course.enrollments / courses[0].enrollments, 1) * 100
                  }%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
