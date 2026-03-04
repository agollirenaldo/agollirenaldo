from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..core.config import get_settings
from ..core.security import create_access_token, get_password_hash, verify_password
from ..db import get_db
from ..dependencies import get_current_user
from ..models import User
from ..schemas import Token, UserCreate, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate, db: Session = Depends(get_db)) -> User:
    settings = get_settings()
    domain = payload.email.split("@")[-1]
    if domain.lower() != settings.allowed_email_domain.lower():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email domain not allowed")
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    hashed_password = get_password_hash(payload.password)
    user = User(
        email=payload.email,
        hashed_password=hashed_password,
        full_name=payload.full_name,
        role=payload.role,
        bio=payload.bio,
        domain=domain,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
) -> Token:
    settings = get_settings()
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password")
    domain = user.email.split("@")[-1]
    if domain.lower() != settings.allowed_email_domain.lower():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized domain")
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password")
    access_token = create_access_token({"sub": user.email, "role": user.role.value})
    return Token(access_token=access_token)


@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)) -> User:
    return current_user
