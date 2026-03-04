from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import get_settings
from .db import Base, engine
from .routers import analytics, assignments, auth, certificates, courses, discussions, messages, notifications, quizzes

Base.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(assignments.router)
app.include_router(quizzes.router)
app.include_router(analytics.router)
app.include_router(notifications.router)
app.include_router(discussions.router)
app.include_router(messages.router)
app.include_router(certificates.router)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Welcome to the modern E-Learning Platform API"}
