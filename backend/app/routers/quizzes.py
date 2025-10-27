from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..dependencies import require_role
from ..models import (
    Quiz,
    QuizAnswer,
    QuizChoice,
    QuizQuestion,
    QuizSubmission,
    User,
    UserRole,
)
from ..schemas import (
    QuestionType,
    QuizAnswerCreate,
    QuizChoiceCreate,
    QuizChoiceOut,
    QuizCreate,
    QuizOut,
    QuizQuestionCreate,
    QuizQuestionOut,
    QuizSubmissionCreate,
)

router = APIRouter(prefix="/quizzes", tags=["quizzes"])


@router.post("/", response_model=QuizOut, status_code=status.HTTP_201_CREATED)
def create_quiz(
    payload: QuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> Quiz:
    quiz = Quiz(
        course_id=payload.course_id,
        title=payload.title,
        description=payload.description,
        time_limit_minutes=payload.time_limit_minutes,
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz


@router.get("/course/{course_id}", response_model=List[QuizOut])
def list_quizzes(course_id: int, db: Session = Depends(get_db)) -> List[Quiz]:
    return db.query(Quiz).filter(Quiz.course_id == course_id).all()


@router.post("/{quiz_id}/questions", response_model=QuizQuestionOut, status_code=status.HTTP_201_CREATED)
def add_question(
    quiz_id: int,
    payload: QuizQuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> QuizQuestion:
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    question = QuizQuestion(
        quiz_id=quiz_id,
        prompt=payload.prompt,
        question_type=payload.question_type,
        points=payload.points,
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


@router.post("/questions/{question_id}/choices", response_model=QuizChoiceOut, status_code=status.HTTP_201_CREATED)
def add_choice(
    question_id: int,
    payload: QuizChoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> QuizChoice:
    question = db.query(QuizQuestion).filter(QuizQuestion.id == question_id).first()
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    choice = QuizChoice(question_id=question_id, text=payload.text, is_correct=payload.is_correct)
    db.add(choice)
    db.commit()
    db.refresh(choice)
    return choice


@router.get("/{quiz_id}", response_model=QuizOut)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)) -> Quiz:
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    return quiz


@router.post("/{quiz_id}/submit", response_model=dict, status_code=status.HTTP_201_CREATED)
def submit_quiz(
    quiz_id: int,
    payload: QuizSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role((UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN))),
) -> dict:
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    submission = QuizSubmission(quiz_id=quiz_id, student_id=current_user.id)
    db.add(submission)
    db.flush()

    score = 0.0
    total = 0.0

    for answer_payload in payload.answers:
        question = (
            db.query(QuizQuestion)
            .filter(QuizQuestion.id == answer_payload.question_id, QuizQuestion.quiz_id == quiz_id)
            .first()
        )
        if not question:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid question {answer_payload.question_id}",
            )
        total += question.points
        is_correct = False
        if question.question_type == QuestionType.multiple_choice:
            if answer_payload.selected_choice_id is None:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Choice required")
            choice = (
                db.query(QuizChoice)
                .filter(
                    QuizChoice.id == answer_payload.selected_choice_id,
                    QuizChoice.question_id == question.id,
                )
                .first()
            )
            if not choice:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid choice")
            is_correct = choice.is_correct
        elif question.question_type == QuestionType.boolean:
            if answer_payload.selected_choice_id is None:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Choice required")
            choice = (
                db.query(QuizChoice)
                .filter(
                    QuizChoice.id == answer_payload.selected_choice_id,
                    QuizChoice.question_id == question.id,
                )
                .first()
            )
            if not choice:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid choice")
            is_correct = choice.is_correct
        else:
            is_correct = False

        if is_correct:
            score += question.points

        quiz_answer = QuizAnswer(
            submission_id=submission.id,
            question_id=question.id,
            selected_choice_id=answer_payload.selected_choice_id,
            answer_text=answer_payload.answer_text,
            is_correct=is_correct,
        )
        db.add(quiz_answer)

    submission.score = score
    db.commit()
    db.refresh(submission)
    percentage = (score / total * 100) if total else 0.0
    return {"submission_id": submission.id, "score": score, "percentage": percentage}
