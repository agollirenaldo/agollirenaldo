from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    admin = "admin"
    instructor = "instructor"
    student = "student"


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.student
    bio: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class UserOut(UserBase):
    id: int
    domain: str
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True


class CourseBase(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    level: Optional[str] = None
    language: Optional[str] = None
    thumbnail_url: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    level: Optional[str] = None
    language: Optional[str] = None
    thumbnail_url: Optional[str] = None


class LessonBase(BaseModel):
    title: str
    content: Optional[str] = None
    video_url: Optional[str] = None
    resources: Optional[str] = None
    order: int = 0
    duration_minutes: int = 0


class LessonCreate(LessonBase):
    module_id: int


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    video_url: Optional[str] = None
    resources: Optional[str] = None
    order: Optional[int] = None
    duration_minutes: Optional[int] = None


class ModuleBase(BaseModel):
    title: str
    description: Optional[str] = None
    order: int = 0


class ModuleCreate(ModuleBase):
    course_id: int


class ModuleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None


class AssignmentBase(BaseModel):
    title: str
    description: str
    due_date: Optional[datetime] = None
    max_score: int = 100
    lesson_id: Optional[int] = None


class AssignmentCreate(AssignmentBase):
    course_id: int


class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    max_score: Optional[int] = None
    lesson_id: Optional[int] = None


class AssignmentSubmissionCreate(BaseModel):
    content: str


class AssignmentGradeUpdate(BaseModel):
    grade: float
    feedback: Optional[str] = None


class AssignmentSubmissionOut(BaseModel):
    id: int
    assignment_id: int
    student_id: int
    content: str
    submitted_at: datetime
    grade: Optional[float]
    feedback: Optional[str]

    class Config:
        orm_mode = True


class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    time_limit_minutes: Optional[int] = None


class QuizCreate(QuizBase):
    course_id: int


class QuizUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    time_limit_minutes: Optional[int] = None


class QuestionType(str, Enum):
    multiple_choice = "multiple_choice"
    text = "text"
    boolean = "boolean"


class QuizQuestionCreate(BaseModel):
    prompt: str
    question_type: QuestionType = QuestionType.multiple_choice
    points: float = 1.0


class QuizChoiceCreate(BaseModel):
    text: str
    is_correct: bool = False


class QuizAnswerCreate(BaseModel):
    question_id: int
    selected_choice_id: Optional[int] = None
    answer_text: Optional[str] = None


class QuizSubmissionCreate(BaseModel):
    answers: List[QuizAnswerCreate]


class QuizChoiceOut(BaseModel):
    id: int
    text: str
    is_correct: bool

    class Config:
        orm_mode = True


class QuizQuestionOut(BaseModel):
    id: int
    prompt: str
    question_type: QuestionType
    points: float
    choices: List[QuizChoiceOut] = Field(default_factory=list)

    class Config:
        orm_mode = True


class QuizOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    time_limit_minutes: Optional[int]
    questions: List[QuizQuestionOut] = Field(default_factory=list)

    class Config:
        orm_mode = True


class EnrollmentProgressUpdate(BaseModel):
    progress: float
    mark_complete: bool = False


class CourseEnrollmentOut(BaseModel):
    id: int
    user_id: int
    course_id: int
    progress: float
    enrolled_at: datetime
    completed_at: Optional[datetime]

    class Config:
        orm_mode = True


class ModuleOut(ModuleBase):
    id: int
    lessons: List[LessonBase] = Field(default_factory=list)

    class Config:
        orm_mode = True


class LessonOut(LessonBase):
    id: int
    module_id: int

    class Config:
        orm_mode = True


class AssignmentOut(AssignmentBase):
    id: int
    course_id: int

    class Config:
        orm_mode = True


class CourseOut(CourseBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
    modules: List[ModuleOut] = Field(default_factory=list)

    class Config:
        orm_mode = True


class NotificationCreate(BaseModel):
    title: str
    body: str


class NotificationDispatch(NotificationCreate):
    recipient_id: int


class NotificationOut(BaseModel):
    id: int
    title: str
    body: str
    is_read: bool
    created_at: datetime

    class Config:
        orm_mode = True


class DiscussionThreadCreate(BaseModel):
    title: str


class DiscussionPostCreate(BaseModel):
    content: str


class DiscussionPostOut(BaseModel):
    id: int
    content: str
    author_id: int
    created_at: datetime

    class Config:
        orm_mode = True


class DiscussionThreadOut(BaseModel):
    id: int
    title: str
    created_by_id: int
    created_at: datetime
    posts: List[DiscussionPostOut] = Field(default_factory=list)

    class Config:
        orm_mode = True


class MessageCreate(BaseModel):
    recipient_id: int
    content: str


class MessageOut(BaseModel):
    id: int
    sender_id: int
    recipient_id: int
    content: str
    created_at: datetime
    read_at: Optional[datetime]

    class Config:
        orm_mode = True


class CertificateOut(BaseModel):
    id: int
    user_id: int
    course_id: int
    issued_at: datetime
    credential_url: Optional[str]

    class Config:
        orm_mode = True
