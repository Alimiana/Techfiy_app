export type Language = 'id' | 'en';
export type UserRole = 'mahasiswa' | 'dosen';
export type MainTab = 'dashboard' | 'kelas' | 'materi' | 'diskusi' | 'profil';
export type ActiveOverlay =
  | null
  | { type: 'notifications' }
  | { type: 'quiz'; mode: 'pretest' | 'posttest'; courseId?: string; openResult?: boolean }
  | { type: 'video'; courseId?: string; chapterId?: string }
  | { type: 'manual' }
  | { type: 'xp' }
  | { type: 'history' };

export interface UserProfile {
  name: string;
  email: string;
  identityType: string;
  identityNumber: string;
  program: string;
  faculty?: string;
  cohort?: string;
  semesterLabel?: string;
  advisor?: string;
  phone?: string;
  address?: string;
  avatarDataUrl?: string;
  role: UserRole;
  isAuthenticated: boolean;
}

export interface ChapterItem {
  id: string;
  number: number;
  title: string;
  moduleLabel: string;
  duration: string;
  videoDuration: string;
  youtubeUrl: string;
  summary: string;
  keyPoints: string[];
  codeExample?: string;
}

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
export type AttendanceStatus = 'hadir' | 'sakit' | 'izin' | 'alpha';

export interface AttendanceLogEntry {
  id: string;
  meetingNumber: number;
  dateLabel: string;
  dateKey: string;
  timeLabel: string;
  topic: string;
  status: AttendanceStatus;
  method?: 'QR' | 'Manual';
}

export interface Course {
  id: string;
  code: string;
  title: string;
  scheduleTitle?: string;
  lecturer: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  scheduleDayTime: string;
  room: string;
  mode: string;
  credits: number;
  tone: 'teal' | 'sky' | 'amber' | 'violet' | 'rose' | 'emerald';
  description: string;
  chapters: ChapterItem[];
  initialAttendanceLogs: AttendanceLogEntry[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseQuizSet {
  courseId: string;
  pretest: QuizQuestion[];
  posttest: QuizQuestion[];
}

export interface QuizAttempt {
  courseId: string;
  mode: 'pretest' | 'posttest';
  score: number;
  total: number;
  completedAt: string;
}

export interface DiscussionReply {
  id: string;
  authorName: string;
  authorInitials: string;
  authorRole: UserRole;
  body: string;
  createdAt: string;
}

export interface DiscussionThread {
  id: string;
  courseId: string;
  courseTitle: string;
  chapterLabel: string;
  title: string;
  body: string;
  authorName: string;
  authorInitials: string;
  authorRole: UserRole;
  createdAt: string;
  timestampMs: number;
  views: number;
  replies: DiscussionReply[];
}

export interface AssignmentItem {
  id: string;
  courseId: string;
  chapterLabel: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  instructions: string;
  instructionsEn: string;
  deadline: string;
  deadlineEn: string;
}

export interface AssignmentSubmission {
  assignmentId: string;
  courseId: string;
  answerText: string;
  submissionLink: string;
  attachmentName: string;
  submittedAt: string;
}

export interface ActivityEntry {
  id: string;
  type: 'materi' | 'pretest' | 'posttest' | 'video' | 'diskusi' | 'jadwal' | 'checkin' | 'manual' | 'tugas';
  title: string;
  subtitle: string;
  activityLabel?: string;
  courseId?: string;
  courseTitle?: string;
  chapterId?: string;
  threadId?: string;
  assignmentId?: string;
  dateKey: string;
  xpEarned: number;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleEn: string;
  body: string;
  bodyEn: string;
  time: string;
  read: boolean;
  targetTab: MainTab;
}

export interface TechifyState {
  language: Language;
  darkMode: boolean;
  notificationsEnabled: boolean;
  user: UserProfile;
  xp: number;
  completedChapterIds: string[];
  downloadedChapterIds: string[];
  watchedVideoIds: string[];
  quizAttempts: QuizAttempt[];
  threads: DiscussionThread[];
  history: ActivityEntry[];
  notifications: NotificationItem[];
  savedScheduleIds: string[];
  attendanceByCourse: Record<string, AttendanceLogEntry[]>;
  assignmentSubmissions: AssignmentSubmission[];
  dailyDateKey: string;
  completedDailyTargets: string[];
  claimedFeatureKeys: string[];
  checkInStreakCount: number;
  lastCheckInDateKey: string | null;
}
