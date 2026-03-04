"""Utility script to seed the database with demo data for local testing."""
from __future__ import annotations

from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from .core.security import get_password_hash
from .db import Base, SessionLocal, engine
from .models import (
    Assignment,
    AssignmentSubmission,
    Course,
    CourseEnrollment,
    DiscussionPost,
    DiscussionThread,
    Lesson,
    Message,
    Module,
    Notification,
    Quiz,
    QuizAnswer,
    QuizChoice,
    QuizQuestion,
    QuizSubmission,
    QuestionType,
    User,
    UserRole,
)

DEFAULT_PASSWORD = "Password123!"
DEMO_DOMAIN = "example.com"


def ensure_user(db: Session, *, email: str, role: UserRole, full_name: str, bio: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user
    user = User(
        email=email,
        hashed_password=get_password_hash(DEFAULT_PASSWORD),
        full_name=full_name,
        role=role,
        bio=bio,
        domain=email.split("@")[-1],
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def ensure_course(
    db: Session,
    *,
    owner: User,
    title: str,
    description: str,
    category: str,
    level: str,
    language: str,
    thumbnail_url: str,
) -> Course:
    course = (
        db.query(Course)
        .filter(Course.title == title, Course.owner_id == owner.id)
        .first()
    )
    if course:
        return course
    course = Course(
        title=title,
        description=description,
        category=category,
        level=level,
        language=language,
        thumbnail_url=thumbnail_url,
        owner_id=owner.id,
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


def ensure_module(db: Session, *, course: Course, title: str, order: int, description: str) -> Module:
    module = (
        db.query(Module)
        .filter(Module.course_id == course.id, Module.title == title)
        .first()
    )
    if module:
        return module
    module = Module(course_id=course.id, title=title, order=order, description=description)
    db.add(module)
    db.commit()
    db.refresh(module)
    return module


def ensure_lesson(
    db: Session,
    *,
    module: Module,
    title: str,
    order: int,
    content: str,
    video_url: str,
    resources: str,
    duration_minutes: int,
) -> Lesson:
    lesson = (
        db.query(Lesson)
        .filter(Lesson.module_id == module.id, Lesson.title == title)
        .first()
    )
    if lesson:
        return lesson
    lesson = Lesson(
        module_id=module.id,
        title=title,
        content=content,
        video_url=video_url,
        resources=resources,
        order=order,
        duration_minutes=duration_minutes,
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson


def ensure_assignment(
    db: Session,
    *,
    course: Course,
    lesson: Lesson,
    title: str,
    description: str,
    max_score: int,
) -> Assignment:
    assignment = (
        db.query(Assignment)
        .filter(Assignment.course_id == course.id, Assignment.title == title)
        .first()
    )
    if assignment:
        return assignment
    assignment = Assignment(
        course_id=course.id,
        lesson_id=lesson.id,
        title=title,
        description=description,
        due_date=datetime.utcnow() + timedelta(days=7),
        max_score=max_score,
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


def ensure_quiz(db: Session, *, course: Course, title: str, description: str) -> Quiz:
    quiz = (
        db.query(Quiz)
        .filter(Quiz.course_id == course.id, Quiz.title == title)
        .first()
    )
    if quiz:
        return quiz
    quiz = Quiz(
        course_id=course.id,
        title=title,
        description=description,
        time_limit_minutes=30,
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz


def ensure_quiz_question(
    db: Session,
    *,
    quiz: Quiz,
    prompt: str,
    question_type: QuestionType,
    points: float,
    choices: list[tuple[str, bool]] | None = None,
) -> QuizQuestion:
    question = (
        db.query(QuizQuestion)
        .filter(QuizQuestion.quiz_id == quiz.id, QuizQuestion.prompt == prompt)
        .first()
    )
    if question:
        return question
    question = QuizQuestion(
        quiz_id=quiz.id,
        prompt=prompt,
        question_type=question_type,
        points=points,
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    if choices:
        for text, is_correct in choices:
            choice = QuizChoice(question_id=question.id, text=text, is_correct=is_correct)
            db.add(choice)
        db.commit()
    return question


def ensure_enrollment(db: Session, *, user: User, course: Course) -> CourseEnrollment:
    enrollment = (
        db.query(CourseEnrollment)
        .filter(
            CourseEnrollment.course_id == course.id,
            CourseEnrollment.user_id == user.id,
        )
        .first()
    )
    if enrollment:
        return enrollment
    enrollment = CourseEnrollment(course_id=course.id, user_id=user.id, progress=35.0)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


def ensure_assignment_submission(
    db: Session,
    *,
    assignment: Assignment,
    student: User,
    content: str,
    grade: float,
    feedback: str,
) -> AssignmentSubmission:
    submission = (
        db.query(AssignmentSubmission)
        .filter(
            AssignmentSubmission.assignment_id == assignment.id,
            AssignmentSubmission.student_id == student.id,
        )
        .first()
    )
    if submission:
        return submission
    submission = AssignmentSubmission(
        assignment_id=assignment.id,
        student_id=student.id,
        content=content,
        grade=grade,
        feedback=feedback,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


def ensure_quiz_submission(
    db: Session,
    *,
    quiz: Quiz,
    student: User,
    score: float,
    answers: list[tuple[QuizQuestion, QuizChoice | None, str | None, bool]],
) -> QuizSubmission:
    submission = (
        db.query(QuizSubmission)
        .filter(QuizSubmission.quiz_id == quiz.id, QuizSubmission.student_id == student.id)
        .first()
    )
    if submission:
        return submission
    submission = QuizSubmission(
        quiz_id=quiz.id,
        student_id=student.id,
        score=score,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    for question, selected_choice, answer_text, is_correct in answers:
        answer = QuizAnswer(
            submission_id=submission.id,
            question_id=question.id,
            selected_choice_id=selected_choice.id if selected_choice else None,
            answer_text=answer_text,
            is_correct=is_correct,
        )
        db.add(answer)
    db.commit()
    return submission


def ensure_notification(db: Session, *, user: User, title: str, body: str) -> Notification:
    notification = (
        db.query(Notification)
        .filter(Notification.user_id == user.id, Notification.title == title)
        .first()
    )
    if notification:
        return notification
    notification = Notification(user_id=user.id, title=title, body=body)
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def ensure_discussion_thread(
    db: Session,
    *,
    course: Course,
    created_by: User,
    title: str,
    post_author: User,
    post_content: str,
) -> DiscussionThread:
    thread = (
        db.query(DiscussionThread)
        .filter(DiscussionThread.course_id == course.id, DiscussionThread.title == title)
        .first()
    )
    if thread:
        return thread
    thread = DiscussionThread(
        course_id=course.id,
        title=title,
        created_by_id=created_by.id,
    )
    db.add(thread)
    db.commit()
    db.refresh(thread)
    post = DiscussionPost(
        thread_id=thread.id,
        author_id=post_author.id,
        content=post_content,
    )
    db.add(post)
    db.commit()
    return thread


def ensure_message(
    db: Session,
    *,
    sender: User,
    recipient: User,
    content: str,
) -> Message:
    message = (
        db.query(Message)
        .filter(
            Message.sender_id == sender.id,
            Message.recipient_id == recipient.id,
            Message.content == content,
        )
        .first()
    )
    if message:
        return message
    message = Message(sender_id=sender.id, recipient_id=recipient.id, content=content)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def run_seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin = ensure_user(
            db,
            email=f"admin@{DEMO_DOMAIN}",
            role=UserRole.ADMIN,
            full_name="Platform Admin",
            bio="Mbikëqyr të gjitha kurset dhe përdoruesit.",
        )
        instructor = ensure_user(
            db,
            email=f"instructor@{DEMO_DOMAIN}",
            role=UserRole.INSTRUCTOR,
            full_name="Dr. Ina Mentor",
            bio="Instruktore e pasionuar për teknologjitë e të mësuarit.",
        )
        student = ensure_user(
            db,
            email=f"student@{DEMO_DOMAIN}",
            role=UserRole.STUDENT,
            full_name="Arti Student", 
            bio="Student që eksploron platformën moderne e-learning.",
        )

        course = ensure_course(
            db,
            owner=instructor,
            title="Onboarding në Platformën E-Learning",
            description="Një kurs demonstrues që shfaq veçoritë kryesore për studentët dhe instruktorët.",
            category="Teknologji",
            level="Fillestar",
            language="Shqip",
            thumbnail_url="https://placehold.co/600x400?text=E-Learning",
        )

        module_basics = ensure_module(
            db,
            course=course,
            title="Hyrje dhe Navigim",
            order=1,
            description="Mësoni se si të lundroni në pult, kurse dhe module.",
        )
        module_assessments = ensure_module(
            db,
            course=course,
            title="Vlerësime dhe Feedback",
            order=2,
            description="Si funksionojnë detyrat, quiz-et dhe vlerësimi.",
        )

        lesson_dashboard = ensure_lesson(
            db,
            module=module_basics,
            title="Mirë se erdhët në pult",
            order=1,
            content="Ky leksion shpjegon ndërfaqen kryesore dhe panelin e progresit.",
            video_url="https://www.example.com/video/dashboard",
            resources="https://www.example.com/resources/guide.pdf",
            duration_minutes=8,
        )
        lesson_assignments = ensure_lesson(
            db,
            module=module_assessments,
            title="Dorëzimi i detyrave",
            order=1,
            content="Shihni si të ngarkoni detyrat dhe të kontrolloni rezultatet.",
            video_url="https://www.example.com/video/assignments",
            resources="https://www.example.com/resources/assignments.pdf",
            duration_minutes=10,
        )

        assignment = ensure_assignment(
            db,
            course=course,
            lesson=lesson_dashboard,
            title="Hapat e parë në platformë",
            description="Dorëzoni një screenshot të pultit tuaj dhe komentoni përshtypjet e para.",
            max_score=100,
        )

        quiz = ensure_quiz(
            db,
            course=course,
            title="Quiz i shpejtë për funksionet",
            description="Testoni njohuritë rreth navigimit dhe funksioneve kryesore.",
        )

        question_navigation = ensure_quiz_question(
            db,
            quiz=quiz,
            prompt="Cila kartë ju tregon progresin e kursit?",
            question_type=QuestionType.MULTIPLE_CHOICE,
            points=5,
            choices=[
                ("StatCard 'Progresi i Kursit'", True),
                ("Tabela e Diskutimeve", False),
                ("Mesazhet e fundit", False),
            ],
        )

        question_feedback = ensure_quiz_question(
            db,
            quiz=quiz,
            prompt="Si mund të shihni feedback-un nga instruktori?",
            question_type=QuestionType.TEXT,
            points=5,
        )

        enrollment = ensure_enrollment(db, user=student, course=course)
        ensure_notification(
            db,
            user=student,
            title="Mirë se erdhët në kursin demonstrues!",
            body="Filloni me leksionin 'Mirë se erdhët në pult' për të parë veçoritë kryesore.",
        )
        ensure_notification(
            db,
            user=instructor,
            title="Student i ri i regjistruar",
            body=f"{student.full_name} u regjistrua në kursin tuaj demonstrues.",
        )

        ensure_discussion_thread(
            db,
            course=course,
            created_by=instructor,
            title="Prezanto veten",
            post_author=student,
            post_content="Përshëndetje të gjithëve! Jam Arti dhe po provoj këtë platformë.",
        )

        ensure_message(
            db,
            sender=instructor,
            recipient=student,
            content="Mirë se erdhe në kurs! Njoftomë nëse ke pyetje.",
        )

        ensure_assignment_submission(
            db,
            assignment=assignment,
            student=student,
            content="Screenshoti im është bashkëngjitur dhe platforma duket e qartë!",
            grade=95,
            feedback="Fantastike! Vazhdoni të eksploroni modulet e tjera.",
        )

        navigation_correct_choice = (
            db.query(QuizChoice)
            .filter(QuizChoice.question_id == question_navigation.id, QuizChoice.is_correct.is_(True))
            .first()
        )

        ensure_quiz_submission(
            db,
            quiz=quiz,
            student=student,
            score=9.5,
            answers=[
                (question_navigation, navigation_correct_choice, None, True),
                (question_feedback, None, "Në faqen e detyrave ose në email.", True),
            ],
        )

        enrollment.progress = 60.0
        enrollment.completed_at = None
        db.commit()

        print(
            "\n✅ Demo data seeded successfully!",
            f"\n   Admin: admin@{DEMO_DOMAIN} / {DEFAULT_PASSWORD}",
            f"\n   Instructor: instructor@{DEMO_DOMAIN} / {DEFAULT_PASSWORD}",
            f"\n   Student: student@{DEMO_DOMAIN} / {DEFAULT_PASSWORD}",
            "\nShfrytëzo këto kredenciale për të hyrë në frontend ose për të testuar API-n.",
        )
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
