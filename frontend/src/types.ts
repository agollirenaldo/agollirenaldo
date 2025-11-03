export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  role: "student" | "instructor" | "admin";
  bio?: string | null;
  domain: string;
  is_active: boolean;
  created_at: string;
}

export interface CourseSummary {
  id: number;
  title: string;
  description: string;
  category?: string | null;
  level?: string | null;
  language?: string | null;
  thumbnail_url?: string | null;
  progress?: number;
  modules: ModuleSummary[];
}

export interface CourseDetail extends CourseSummary {
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface ModuleSummary {
  id: number;
  title: string;
  description?: string | null;
  order: number;
  lessons: LessonSummary[];
}

export interface LessonSummary {
  title: string;
  content?: string | null;
  video_url?: string | null;
  resources?: string | null;
  order: number;
  duration_minutes: number;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date?: string | null;
  max_score: number;
  course_id: number;
  lesson_id?: number | null;
}

export interface Quiz {
  id: number;
  title: string;
  description?: string | null;
  time_limit_minutes?: number | null;
  course_id: number;
}

export interface DiscussionReply {
  id: number;
  content: string;
  author_id: number;
  created_at: string;
}

export interface DiscussionThread {
  id: number;
  title: string;
  created_by_id: number;
  created_at: string;
  posts: DiscussionReply[];
}

export interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  created_at: string;
  read_at?: string | null;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface Certificate {
  id: number;
  user_id: number;
  course_id: number;
  issued_at: string;
  credential_url?: string | null;
}

export interface AnalyticsSummary {
  active_students: number;
  completed_courses: number;
  average_progress: number;
  satisfaction_score: number;
  weekly_engagement: Array<{ week: string; active: number; completed: number }>;
  top_courses: Array<{ title: string; enrollments: number }>;
}

export interface UserCourseProgress {
  enrolled_courses: number;
  average_quiz_score: number;
  average_assignment_grade: number;
  progress: Array<{ course_id: number; progress: number; completed: boolean }>;
}

export interface CourseEnrollment {
  id: number;
  user_id: number;
  course_id: number;
  progress: number;
  enrolled_at: string;
  completed_at?: string | null;
}
