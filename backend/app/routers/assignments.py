from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..dependencies import require_role
from ..models import Assignment, AssignmentSubmission, User, UserRole
from ..schemas import (
    AssignmentGradeUpdate,
    AssignmentOut,
    AssignmentSubmissionCreate,
    AssignmentSubmissionOut,
)

router = APIRouter(prefix="/assignments", tags=["assignments"])


@router.get("/course/{course_id}", response_model=List[AssignmentOut])
def list_assignments(course_id: int, db: Session = Depends(get_db)) -> List[Assignment]:
    return db.query(Assignment).filter(Assignment.course_id == course_id).all()


@router.post("/{assignment_id}/submit", response_model=AssignmentSubmissionOut, status_code=status.HTTP_201_CREATED)
def submit_assignment(
    assignment_id: int,
    payload: AssignmentSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> AssignmentSubmission:
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found")
    submission = AssignmentSubmission(assignment_id=assignment_id, student_id=current_user.id, content=payload.content)
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.post("/{submission_id}/grade", response_model=AssignmentSubmissionOut)
def grade_submission(
    submission_id: int,
    payload: AssignmentGradeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> AssignmentSubmission:
    submission = db.query(AssignmentSubmission).filter(AssignmentSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")
    course = submission.assignment.course
    if current_user.role != UserRole.ADMIN and course.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed to grade this submission")
    submission.grade = payload.grade
    submission.feedback = payload.feedback
    db.commit()
    db.refresh(submission)
    return submission
