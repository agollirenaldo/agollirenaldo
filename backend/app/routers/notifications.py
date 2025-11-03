from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..dependencies import require_role
from ..models import Notification, User, UserRole
from ..schemas import NotificationDispatch, NotificationOut

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/", response_model=list[NotificationOut])
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> list[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .all()
    )


@router.post("/", response_model=NotificationOut, status_code=status.HTTP_201_CREATED)
def send_notification(
    payload: NotificationDispatch,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> Notification:
    recipient = db.query(User).filter(User.id == payload.recipient_id).first()
    if not recipient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipient not found")
    notification = Notification(user_id=payload.recipient_id, title=payload.title, body=payload.body)
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


@router.post("/{notification_id}/read", response_model=NotificationOut)
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> Notification:
    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == current_user.id)
        .first()
    )
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification
