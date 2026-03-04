import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import type { CourseSummary } from "../types";

interface CourseCardProps {
  course: CourseSummary;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <motion.article
      className="course-card"
      whileHover={{ translateY: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="course-card__media">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt={course.title} loading="lazy" />
        ) : (
          <div className="course-card__placeholder" aria-hidden>
            <span className="material-symbols-rounded">menu_book</span>
          </div>
        )}
      </div>
      <div className="course-card__content">
        <p className="course-card__category">{course.category}</p>
        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__description">
          {course.description.length > 140
            ? `${course.description.slice(0, 140)}...`
            : course.description}
        </p>
        <div className="course-card__footer">
          <span className="course-card__level">{course.level}</span>
          {typeof course.progress === "number" && (
            <div className="progress-pill">
              <div className="progress-pill__track">
                <div className="progress-pill__bar" style={{ width: `${course.progress}%` }} />
              </div>
              <span>{course.progress}%</span>
            </div>
          )}
        </div>
      </div>
      <Link to={`/courses/${course.id}`} className="course-card__overlay" aria-label={course.title} />
    </motion.article>
  );
}
