from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..dependencies import require_role
from ..models import Course, DiscussionPost, DiscussionThread, User, UserRole
from ..schemas import DiscussionPostCreate, DiscussionPostOut, DiscussionThreadCreate, DiscussionThreadOut

router = APIRouter(prefix="/discussions", tags=["discussions"])


@router.post("/course/{course_id}", response_model=DiscussionThreadOut, status_code=status.HTTP_201_CREATED)
def create_thread(
    course_id: int,
    payload: DiscussionThreadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> DiscussionThread:
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    thread = DiscussionThread(course_id=course_id, title=payload.title, created_by_id=current_user.id)
    db.add(thread)
    db.commit()
    db.refresh(thread)
    return thread


@router.get("/course/{course_id}", response_model=List[DiscussionThreadOut])
def list_threads(course_id: int, db: Session = Depends(get_db)) -> List[DiscussionThread]:
    return db.query(DiscussionThread).filter(DiscussionThread.course_id == course_id).all()


@router.post("/thread/{thread_id}/posts", response_model=DiscussionPostOut, status_code=status.HTTP_201_CREATED)
def add_post(
    thread_id: int,
    payload: DiscussionPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> DiscussionPost:
    thread = db.query(DiscussionThread).filter(DiscussionThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found")
    post = DiscussionPost(thread_id=thread_id, author_id=current_user.id, content=payload.content)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post
