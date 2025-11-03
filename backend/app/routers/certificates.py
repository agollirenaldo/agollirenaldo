from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..dependencies import require_role
from ..models import Certificate, CourseEnrollment, User, UserRole
from ..schemas import CertificateOut

router = APIRouter(prefix="/certificates", tags=["certificates"])


@router.post("/issue/{enrollment_id}", response_model=CertificateOut, status_code=status.HTTP_201_CREATED)
def issue_certificate(
    enrollment_id: int,
    credential_url: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> Certificate:
    enrollment = db.query(CourseEnrollment).filter(CourseEnrollment.id == enrollment_id).first()
    if not enrollment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enrollment not found")
    if current_user.role != UserRole.ADMIN and enrollment.course.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed to issue certificate")
    certificate = Certificate(user_id=enrollment.user_id, course_id=enrollment.course_id, credential_url=credential_url)
    db.add(certificate)
    db.commit()
    db.refresh(certificate)
    return certificate


@router.get("/me", response_model=list[CertificateOut])
def my_certificates(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> list[Certificate]:
    return db.query(Certificate).filter(Certificate.user_id == current_user.id).all()
