from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..dependencies import require_role
from ..models import AssignmentSubmission, Course, CourseEnrollment, QuizSubmission, User, UserRole

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/course/{course_id}")
def course_analytics(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> dict:
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if current_user.role != UserRole.ADMIN and course.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to view this course")

    enrollments = db.query(CourseEnrollment).filter(CourseEnrollment.course_id == course_id).all()
    assignment_submissions = (
        db.query(AssignmentSubmission)
        .join(AssignmentSubmission.assignment)
        .filter(AssignmentSubmission.assignment.has(course_id=course_id))
        .all()
    )
    quiz_submissions = db.query(QuizSubmission).join(QuizSubmission.quiz).filter(QuizSubmission.quiz.has(course_id=course_id)).all()

    avg_assignment_grade = (
        sum(sub.grade for sub in assignment_submissions if sub.grade is not None) / max(1, sum(1 for sub in assignment_submissions if sub.grade is not None))
    )
    avg_quiz_score = (
        sum(sub.score for sub in quiz_submissions if sub.score is not None) / max(1, sum(1 for sub in quiz_submissions if sub.score is not None))
    )

    completed_students = sum(1 for enrollment in enrollments if enrollment.completed_at is not None)

    return {
        "course_id": course_id,
        "total_enrollments": len(enrollments),
        "completed_students": completed_students,
        "average_assignment_grade": round(avg_assignment_grade, 2) if assignment_submissions else 0.0,
        "average_quiz_score": round(avg_quiz_score, 2) if quiz_submissions else 0.0,
    }


@router.get("/me")
def learner_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> dict:
    enrollments = db.query(CourseEnrollment).filter(CourseEnrollment.user_id == current_user.id).all()
    quiz_scores = db.query(QuizSubmission).filter(QuizSubmission.student_id == current_user.id).all()
    assignment_grades = db.query(AssignmentSubmission).filter(AssignmentSubmission.student_id == current_user.id).all()

    avg_quiz = sum(sub.score for sub in quiz_scores if sub.score is not None) / max(
        1, sum(1 for sub in quiz_scores if sub.score is not None)
    )
    avg_assignment = sum(sub.grade for sub in assignment_grades if sub.grade is not None) / max(
        1, sum(1 for sub in assignment_grades if sub.grade is not None)
    )

    return {
        "enrolled_courses": len(enrollments),
        "average_quiz_score": round(avg_quiz, 2) if quiz_scores else 0.0,
        "average_assignment_grade": round(avg_assignment, 2) if assignment_grades else 0.0,
        "progress": [
            {
                "course_id": enrollment.course_id,
                "progress": enrollment.progress,
                "completed": enrollment.completed_at is not None,
            }
            for enrollment in enrollments
        ],
    }
