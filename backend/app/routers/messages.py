from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..dependencies import require_role
from ..models import Message, User, UserRole
from ..schemas import MessageCreate, MessageOut

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("/", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def send_message(
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> Message:
    recipient = db.query(User).filter(User.id == payload.recipient_id).first()
    if not recipient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipient not found")
    message = Message(sender_id=current_user.id, recipient_id=payload.recipient_id, content=payload.content)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("/inbox", response_model=List[MessageOut])
def inbox(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> List[Message]:
    return (
        db.query(Message)
        .filter(Message.recipient_id == current_user.id)
        .order_by(Message.created_at.desc())
        .all()
    )


@router.get("/sent", response_model=List[MessageOut])
def sent_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> List[Message]:
    return (
        db.query(Message)
        .filter(Message.sender_id == current_user.id)
        .order_by(Message.created_at.desc())
        .all()
    )
