import { useState } from 'react';
import {
  ArrowLeft,
  Award,
  Bell,
  BookOpen,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Lock,
  PlayCircle,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { COURSES, COURSE_QUIZZES, MANUAL_BOOK_SECTIONS } from '../data/curriculum';
import { TRANSLATIONS } from '../data/translations';
import {
  CHECK_IN_REWARDS,
  LEVEL_THRESHOLDS,
  getTodayDateKey,
} from '../hooks/useTechifyStore';
import {
  ActiveOverlay,
  ActivityEntry,
  Language,
  MainTab,
  NotificationItem,
  QuizAttempt,
} from '../types/lms';
import {
  formatHistoryDateLabel,
  getActivityDisplayLabel,
  groupHistoryBySubject,
} from '../utils/historyHelpers';
import { ActivityIcon } from './ActivityIcon';

interface InteractiveModalsProps {
  overlay: ActiveOverlay;
  language: Language;
  notifications: NotificationItem[];
  quizAttempts: QuizAttempt[];
  watchedVideoIds: string[];
  history: ActivityEntry[];
  xp: number;
  level: number;
  xpRemainingToNext: number;
  levelProgressPercent: number;
  checkInStreakCount: number;
  canClaimCheckInToday: boolean;
  onClaimCheckIn: () => void;
  onClose: () => void;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onNavigateTab: (tab: MainTab) => void;
  onSubmitQuiz: (
    courseId: string,
    mode: 'pretest' | 'posttest',
    score: number,
    total: number
  ) => void;
  onCompleteVideo: (
    courseId: string,
    chapterId: string,
    chapterTitle: string
  ) => void;
  onOpenHistoryItem: (item: ActivityEntry) => void;
}

export function InteractiveModals({
  overlay,
  language,
  notifications,
  quizAttempts,
  watchedVideoIds,
  history,
  xp,
  level,
  xpRemainingToNext,
  levelProgressPercent,
  checkInStreakCount,
  canClaimCheckInToday,
  onClaimCheckIn,
  onClose,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onNavigateTab,
  onSubmitQuiz,
  onCompleteVideo,
  onOpenHistoryItem,
}: InteractiveModalsProps) {
  if (!overlay) return null;

  return (
    <div className="w-full">
      {overlay.type === 'notifications' && (
        <NotificationsPage
          language={language}
          notifications={notifications}
          onClose={onClose}
          onMarkRead={onMarkNotificationRead}
          onMarkAllRead={onMarkAllNotificationsRead}
          onNavigateTab={onNavigateTab}
        />
      )}

      {overlay.type === 'quiz' && (
        <QuizRunnerPage
          language={language}
          mode={overlay.mode}
          initialCourseId={overlay.courseId}
          initialOpenResult={overlay.openResult}
          quizAttempts={quizAttempts}
          onClose={onClose}
          onSubmitQuiz={onSubmitQuiz}
        />
      )}

      {overlay.type === 'video' && (
        <VideoListPage
          language={language}
          initialCourseId={overlay.courseId}
          initialChapterId={overlay.chapterId}
          watchedVideoIds={watchedVideoIds}
          onClose={onClose}
          onCompleteVideo={onCompleteVideo}
        />
      )}

      {overlay.type === 'manual' && (
        <ManualBookPage language={language} onClose={onClose} />
      )}

      {overlay.type === 'xp' && (
        <XpDetailPage
          language={language}
          xp={xp}
          level={level}
          xpRemainingToNext={xpRemainingToNext}
          levelProgressPercent={levelProgressPercent}
          checkInStreakCount={checkInStreakCount}
          canClaimCheckInToday={canClaimCheckInToday}
          onClaimCheckIn={onClaimCheckIn}
          onClose={onClose}
        />
      )}

      {overlay.type === 'history' && (
        <AllHistoryPage
          language={language}
          history={history}
          onClose={onClose}
          onOpenHistoryItem={onOpenHistoryItem}
        />
      )}
    </div>
  );
}

function SubPageHeader({
  title,
  subtitle,
  backLabel,
  onBack,
  rightSlot,
}: {
  title: string;
  subtitle?: string;
  backLabel: string;
  onBack: () => void;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer shrink-0"
          aria-label={backLabel}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl font-display font-bold text-slate-900 tracking-tight leading-snug">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </div>
  );
}

function NotificationsPage({
  language,
  notifications,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onNavigateTab,
}: {
  language: Language;
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigateTab: (tab: MainTab) => void;
}) {
  const t = TRANSLATIONS[language];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-5">
      <SubPageHeader
        title={t.notificationsTitle}
        subtitle={
          unreadCount > 0
            ? language === 'id'
              ? `${unreadCount} notifikasi belum dibaca`
              : `${unreadCount} unread notifications`
            : language === 'id'
              ? 'Semua notifikasi telah dibaca'
              : 'All notifications read'
        }
        backLabel={t.backBtn}
        onBack={onClose}
        rightSlot={
          unreadCount > 0 ? (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="h-10 px-3 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-xs font-semibold text-[#0F766E] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{t.markAllRead}</span>
            </button>
          ) : null
        }
      />

      <div className="space-y-2.5">
        {notifications.map((notif) => (
          <button
            key={notif.id}
            type="button"
            onClick={() => {
              onMarkRead(notif.id);
              onNavigateTab(notif.targetTab);
              onClose();
            }}
            className={`w-full text-left p-4 rounded-2xl border transition-colors cursor-pointer flex items-start justify-between gap-3 ${
              notif.read
                ? 'bg-white border-slate-200 text-slate-600'
                : 'bg-white border-teal-300 ring-1 ring-teal-200/60 text-slate-900'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.read
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-teal-50 text-[#0F766E]'
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-display font-semibold leading-snug">
                  {language === 'id' ? notif.title : notif.titleEn}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'id' ? notif.body : notif.bodyEn}
                </p>
                <p className="text-[11px] text-slate-400">{notif.time}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
          </button>
        ))}
      </div>
    </div>
  );
}

function QuizRunnerPage({
  language,
  mode,
  initialCourseId,
  initialOpenResult,
  quizAttempts,
  onClose,
  onSubmitQuiz,
}: {
  language: Language;
  mode: 'pretest' | 'posttest';
  initialCourseId?: string;
  initialOpenResult?: boolean;
  quizAttempts: QuizAttempt[];
  onClose: () => void;
  onSubmitQuiz: (
    courseId: string,
    mode: 'pretest' | 'posttest',
    score: number,
    total: number
  ) => void;
}) {
  const t = TRANSLATIONS[language];
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    initialCourseId || null
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const existingInitialAttempt = initialCourseId
    ? quizAttempts.find((a) => a.courseId === initialCourseId && a.mode === mode)
    : undefined;
  const [isSubmitted, setIsSubmitted] = useState(
    Boolean(initialOpenResult && existingInitialAttempt)
  );
  const [viewingSavedResult, setViewingSavedResult] = useState(
    Boolean(initialOpenResult && existingInitialAttempt)
  );

  const selectedCourse = COURSES.find((c) => c.id === selectedCourseId) || null;
  const quizSet = COURSE_QUIZZES.find((q) => q.courseId === selectedCourseId);
  const questions = quizSet
    ? mode === 'pretest'
      ? quizSet.pretest
      : quizSet.posttest
    : [];
  const savedAttempt = selectedCourseId
    ? quizAttempts.find((a) => a.courseId === selectedCourseId && a.mode === mode)
    : undefined;

  const title = mode === 'pretest' ? 'Pretest' : 'Posttest';

  if (!selectedCourseId || !selectedCourse) {
    return (
      <div className="space-y-5">
        <SubPageHeader
          title={title}
          subtitle={
            language === 'id'
              ? `Pilih mata kuliah untuk mengerjakan ${title} (${mode === 'pretest' ? '+40 XP' : '+60 XP'})`
              : `Select a subject to start ${title} (${mode === 'pretest' ? '+40 XP' : '+60 XP'})`
          }
          backLabel={t.backBtn}
          onBack={onClose}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COURSES.map((course) => {
            const attempt = quizAttempts.find(
              (a) => a.courseId === course.id && a.mode === mode
            );
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => {
                  setSelectedCourseId(course.id);
                  setCurrentIndex(0);
                  setAnswers({});
                  setIsSubmitted(false);
                  setViewingSavedResult(false);
                }}
                className="text-left p-4 rounded-2xl border border-slate-200 hover:border-[#0F766E]/50 bg-white hover:bg-[#F4FAF9]/40 transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-mono font-semibold text-[#0F766E]">
                    {course.code}
                  </p>
                  <p className="text-sm sm:text-base font-display font-bold text-slate-900 leading-snug">
                    {course.title}
                  </p>
                  {attempt && (
                    <p className="text-xs text-teal-700 tabular-nums">
                      {language === 'id' ? 'Skor terakhir:' : 'Last score:'}{' '}
                      {attempt.score}/{attempt.total}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const computedScore = questions.reduce(
    (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
    0
  );

  const handleFinish = () => {
    setViewingSavedResult(false);
    setIsSubmitted(true);
    onSubmitQuiz(selectedCourse.id, mode, computedScore, questions.length);
  };

  if (isSubmitted) {
    const displayedScore =
      viewingSavedResult && savedAttempt ? savedAttempt.score : computedScore;
    const displayedTotal =
      viewingSavedResult && savedAttempt ? savedAttempt.total : questions.length;
    const pct =
      displayedTotal > 0 ? Math.round((displayedScore / displayedTotal) * 100) : 0;

    return (
      <div className="space-y-5">
        <SubPageHeader
          title={language === 'id' ? `Hasil ${title}` : `${title} Results`}
          subtitle={selectedCourse.title}
          backLabel={t.backBtn}
          onBack={onClose}
        />

        <div className="bg-[#0F766E] text-white rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-teal-100">{selectedCourse.title}</p>
            <p className="text-2xl font-display font-bold tabular-nums mt-0.5">
              {displayedScore}/{displayedTotal} ({pct}%)
            </p>
            {viewingSavedResult && savedAttempt && (
              <p className="text-[11px] text-teal-100 mt-1">
                {language === 'id'
                  ? `Tercatat · ${savedAttempt.completedAt}`
                  : `Recorded · ${savedAttempt.completedAt}`}
              </p>
            )}
          </div>
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-amber-200" />
          </div>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const chosen = answers[q.id];
            const hasSessionChoice = chosen !== undefined;
            const correct = hasSessionChoice ? chosen === q.correctIndex : true;
            return (
              <div
                key={q.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5"
              >
                <div className="flex items-start gap-2">
                  {correct ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                    {idx + 1}. {q.question}
                  </p>
                </div>
                {viewingSavedResult && (
                  <p className="text-xs font-medium text-[#0F766E] pl-6">
                    {language === 'id' ? 'Kunci:' : 'Answer:'}{' '}
                    {q.options[q.correctIndex]}
                  </p>
                )}
                <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              setCurrentIndex(0);
              setAnswers({});
              setIsSubmitted(false);
              setViewingSavedResult(false);
            }}
            className="flex-1 h-11 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold cursor-pointer whitespace-nowrap"
          >
            {language === 'id' ? 'Kerjakan Ulang' : 'Retake Quiz'}
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCourseId(null);
              setIsSubmitted(false);
              setViewingSavedResult(false);
            }}
            className="flex-1 h-11 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold cursor-pointer whitespace-nowrap"
          >
            {language === 'id' ? 'Mata Kuliah Lain' : 'Other Subject'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 px-4 rounded-xl bg-[#0F766E] hover:bg-[#147D73] text-white text-sm font-semibold cursor-pointer whitespace-nowrap"
          >
            {language === 'id' ? 'Selesai' : 'Done'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SubPageHeader
        title={`${title} · ${selectedCourse.title}`}
        subtitle={
          language === 'id'
            ? `Soal ${currentIndex + 1} dari ${questions.length}`
            : `Question ${currentIndex + 1} of ${questions.length}`
        }
        backLabel={t.backBtn}
        onBack={() => {
          setSelectedCourseId(null);
          setCurrentIndex(0);
          setAnswers({});
        }}
      />

      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-5">
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-[#0F766E] transition-all duration-200"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
            {currentQuestion.question}
          </p>

          <div className="space-y-2">
            {currentQuestion.options.map((opt, idx) => {
              const selected = answers[currentQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: idx }))
                  }
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all cursor-pointer flex items-center gap-3 ${
                    selected
                      ? 'border-[#0F766E] bg-teal-50/70 text-teal-950 font-medium'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                      selected
                        ? 'bg-[#0F766E] border-[#0F766E] text-white'
                        : 'border-slate-300 text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              if (currentIndex === 0) {
                setSelectedCourseId(null);
              } else {
                setCurrentIndex((i) => i - 1);
              }
            }}
            className="h-11 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold cursor-pointer"
          >
            {language === 'id' ? 'Sebelumnya' : 'Previous'}
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              disabled={answers[currentQuestion.id] === undefined}
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="h-11 px-5 rounded-xl bg-[#0F766E] hover:bg-[#147D73] text-white text-sm font-semibold disabled:opacity-50 cursor-pointer"
            >
              {language === 'id' ? 'Berikutnya' : 'Next'}
            </button>
          ) : (
            <button
              type="button"
              disabled={answers[currentQuestion.id] === undefined}
              onClick={handleFinish}
              className="h-11 px-5 rounded-xl bg-[#0F766E] hover:bg-[#147D73] text-white text-sm font-semibold disabled:opacity-50 cursor-pointer"
            >
              {language === 'id' ? 'Kumpulkan Jawaban' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoListPage({
  language,
  initialCourseId,
  initialChapterId,
  watchedVideoIds,
  onClose,
  onCompleteVideo,
}: {
  language: Language;
  initialCourseId?: string;
  initialChapterId?: string;
  watchedVideoIds: string[];
  onClose: () => void;
  onCompleteVideo: (
    courseId: string,
    chapterId: string,
    chapterTitle: string
  ) => void;
}) {
  const t = TRANSLATIONS[language];
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>(
    initialCourseId || 'all'
  );

  const visibleCourses =
    selectedCourseFilter === 'all'
      ? COURSES
      : COURSES.filter((c) => c.id === selectedCourseFilter);

  return (
    <div className="space-y-5">
      <SubPageHeader
        title={t.menuVideo}
        subtitle={t.videoPageSubtitle}
        backLabel={t.backBtn}
        onBack={onClose}
      />

      {/* Subject Filter Chips (No truncation) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setSelectedCourseFilter('all')}
          className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
            selectedCourseFilter === 'all'
              ? 'bg-[#0F766E] text-white border-[#0F766E]'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t.filterAll}
        </button>
        {COURSES.map((course) => (
          <button
            key={course.id}
            type="button"
            onClick={() => setSelectedCourseFilter(course.id)}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
              selectedCourseFilter === course.id
                ? 'bg-[#0F766E] text-white border-[#0F766E]'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {course.title}
          </button>
        ))}
      </div>

      {/* Videos Grouped by Course & Chapter */}
      <div className="space-y-4">
        {visibleCourses.map((course) => {
          const watchedCount = course.chapters.filter((ch) =>
            watchedVideoIds.includes(ch.id)
          ).length;

          return (
            <section
              key={course.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-mono font-semibold text-[#0F766E]">
                    {course.code} · {course.lecturer}
                  </p>
                  <h2 className="text-base sm:text-lg font-display font-bold text-slate-900 leading-snug mt-0.5">
                    {course.title}
                  </h2>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums shrink-0">
                  {watchedCount}/{course.chapters.length}
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/30">
                {course.chapters.map((chapter) => {
                  const isWatched = watchedVideoIds.includes(chapter.id);
                  const isHighlighted = initialChapterId === chapter.id;
                  return (
                    <a
                      key={chapter.id}
                      href={chapter.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        onCompleteVideo(course.id, chapter.id, chapter.title)
                      }
                      className={`w-full text-left px-3.5 py-3 hover:bg-[#F4FAF9] active:bg-teal-50/60 transition-colors flex items-center justify-between gap-3 ${
                        isHighlighted ? 'bg-teal-50/70' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isWatched
                              ? 'bg-teal-50 text-[#0F766E]'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          <PlayCircle className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                            {chapter.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                            YouTube · {chapter.videoDuration} · {t.watchOnYoutube}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isWatched ? (
                          <span className="px-2 py-0.5 rounded-md bg-teal-50 text-[#0F766E] border border-teal-200/70 text-[11px] font-semibold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{t.watchedLabel}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/70 text-[11px] font-mono font-semibold tabular-nums">
                            +30 XP
                          </span>
                        )}
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function ManualBookPage({
  language,
  onClose,
}: {
  language: Language;
  onClose: () => void;
}) {
  const t = TRANSLATIONS[language];
  return (
    <div className="space-y-5">
      <SubPageHeader
        title="Manual Book — Techify"
        subtitle={t.menuManualSub}
        backLabel={t.backBtn}
        onBack={onClose}
      />

      <div className="space-y-3">
        {MANUAL_BOOK_SECTIONS.map((sec, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0F766E] shrink-0" />
              <h2 className="text-sm sm:text-base font-display font-bold text-slate-900">
                {language === 'id' ? sec.title : sec.titleEn}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
              {language === 'id' ? sec.body : sec.bodyEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function XpDetailPage({
  language,
  xp,
  level,
  xpRemainingToNext,
  levelProgressPercent,
  checkInStreakCount,
  canClaimCheckInToday,
  onClaimCheckIn,
  onClose,
}: {
  language: Language;
  xp: number;
  level: number;
  xpRemainingToNext: number;
  levelProgressPercent: number;
  checkInStreakCount: number;
  canClaimCheckInToday: boolean;
  onClaimCheckIn: () => void;
  onClose: () => void;
}) {
  const t = TRANSLATIONS[language];
  const cycleClaimedCount =
    canClaimCheckInToday && checkInStreakCount >= 7 ? 0 : checkInStreakCount;
  const activeDayIndex = canClaimCheckInToday ? cycleClaimedCount : -1;
  const activeRewardXp =
    activeDayIndex >= 0 ? CHECK_IN_REWARDS[activeDayIndex] : 0;

  const xpSources = [
    {
      label: language === 'id' ? 'Pretest' : 'Pretest',
      value: '+40 XP',
    },
    {
      label: language === 'id' ? 'Materi / Modul Ajar' : 'Materials / Modules',
      value: language === 'id' ? '+25 XP / bab' : '+25 XP / chapter',
    },
    {
      label: language === 'id' ? 'Unduh Materi' : 'Download Module',
      value: language === 'id' ? '+15 XP / modul' : '+15 XP / module',
    },
    {
      label: language === 'id' ? 'Video Belajar (YouTube)' : 'Study Videos (YouTube)',
      value: language === 'id' ? '+30 XP / video' : '+30 XP / video',
    },
    {
      label: language === 'id' ? 'Pengumpulan Tugas' : 'Assignment Submission',
      value: language === 'id' ? '+35 XP / tugas' : '+35 XP / task',
    },
    {
      label: language === 'id' ? 'Posttest' : 'Posttest',
      value: '+60 XP',
    },
    {
      label: language === 'id' ? 'Diskusi Kelas' : 'Class Discussion',
      value:
        language === 'id'
          ? '+15 XP topik · +10 XP balasan'
          : '+15 XP topic · +10 XP reply',
    },
    {
      label:
        language === 'id'
          ? 'Jadwal Pelajaran & Manual Book'
          : 'Schedule & Manual Book',
      value: language === 'id' ? '+10 XP / hari' : '+10 XP / day',
    },
  ];

  return (
    <div className="space-y-5">
      <SubPageHeader
        title={t.xpModalTitle}
        subtitle={
          language === 'id'
            ? 'Check-in harian, ketentuan level, dan perolehan poin belajar'
            : 'Daily check-in, level progression rules, and learning XP sources'
        }
        backLabel={t.backBtn}
        onBack={onClose}
      />

      {/* Current XP Summary Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#147D73] text-white p-5 sm:p-6 space-y-3 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-teal-100 font-medium">
              {t.levelLabel} {level}
            </p>
            <p className="text-2xl sm:text-3xl font-display font-bold tabular-nums">
              {xp} XP
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-amber-200" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white dark:bg-white transition-all duration-300"
              style={{ width: `${Math.max(4, levelProgressPercent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-teal-50 tabular-nums">
            <span>{t.xpToNext(xpRemainingToNext, level + 1)}</span>
            <span className="font-mono">{levelProgressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Check-in XP Harian (7 Hari ala Koin Shopee) */}
      <section className="space-y-3 border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-display font-bold text-slate-900">
              {t.checkInTitle}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">{t.checkInSubtitle}</p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#0F766E] tabular-nums shrink-0">
            {cycleClaimedCount}/7
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {CHECK_IN_REWARDS.map((reward, idx) => {
            const isClaimed = idx < cycleClaimedCount;
            const isToday = idx === activeDayIndex;

            return (
              <div
                key={idx}
                className={`rounded-xl border p-2.5 flex flex-col items-center justify-between text-center gap-1.5 min-h-[86px] transition-all ${
                  isClaimed
                    ? 'bg-teal-50 border-teal-200 text-[#0F766E]'
                    : isToday
                      ? 'bg-white border-[#0F766E] dark:border-teal-400 ring-2 ring-[#0F766E]/15 dark:ring-teal-400/20 text-slate-900 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 text-slate-400'
                }`}
              >
                <span className="text-[11px] font-semibold whitespace-nowrap">
                  {t.dayLabel(idx + 1)}
                </span>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    isClaimed
                      ? 'bg-[#0F766E] text-white'
                      : isToday
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isClaimed ? (
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  ) : isToday ? (
                    <Sparkles className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                </div>

                <span
                  className={`text-[11px] font-mono font-bold tabular-nums ${
                    isClaimed
                      ? 'text-[#0F766E]'
                      : isToday
                        ? 'text-[#0F766E]'
                        : 'text-slate-400'
                  }`}
                >
                  +{reward} XP
                </span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!canClaimCheckInToday}
          onClick={onClaimCheckIn}
          className={`w-full h-11 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
            canClaimCheckInToday
              ? 'bg-[#0F766E] hover:bg-[#147D73] text-white cursor-pointer'
              : 'bg-teal-50 text-[#0F766E] border border-teal-200 cursor-default'
          }`}
        >
          {canClaimCheckInToday ? (
            <>
              <Sparkles className="w-4 h-4" />
              <span>
                {t.claimTodayXpBtn} (+{activeRewardXp} XP)
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.claimedTodayXpBtn}</span>
            </>
          )}
        </button>
      </section>

      {/* Ketentuan Naik Level & Sumber Poin XP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <section className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white space-y-2.5">
          <h2 className="text-sm font-display font-bold text-slate-900">
            {t.levelRulesTitle}
          </h2>
          <div className="divide-y divide-slate-100">
            {LEVEL_THRESHOLDS.map((item) => {
              const reached = xp >= item.minXp;
              const isCurrent = level === item.level;
              return (
                <div
                  key={item.level}
                  className="py-2.5 first:pt-0.5 last:pb-0.5 flex items-center justify-between text-xs"
                >
                  <span
                    className={`font-semibold ${
                      isCurrent
                        ? 'text-[#0F766E]'
                        : reached
                          ? 'text-slate-800'
                          : 'text-slate-500'
                    }`}
                  >
                    {t.levelLabel} {item.level}
                    {isCurrent
                      ? language === 'id'
                        ? ' (Saat ini)'
                        : ' (Current)'
                      : ''}
                  </span>
                  <span className="font-mono font-semibold text-slate-700 tabular-nums">
                    {item.minXp.toLocaleString('id-ID')} XP
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white space-y-2.5">
          <h2 className="text-sm font-display font-bold text-slate-900">
            {t.xpSourcesTitle}
          </h2>
          <div className="divide-y divide-slate-100">
            {xpSources.map((src, idx) => (
              <div
                key={idx}
                className="py-2.5 first:pt-0.5 last:pb-0.5 flex items-center justify-between gap-2 text-xs"
              >
                <span className="text-slate-700 font-medium">{src.label}</span>
                <span className="font-mono font-semibold text-[#0F766E] shrink-0 tabular-nums">
                  {src.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function AllHistoryPage({
  language,
  history,
  onClose,
  onOpenHistoryItem,
}: {
  language: Language;
  history: ActivityEntry[];
  onClose: () => void;
  onOpenHistoryItem: (item: ActivityEntry) => void;
}) {
  const t = TRANSLATIONS[language];
  const todayKey = getTodayDateKey();

  const dateBuckets = new Map<string, ActivityEntry[]>();
  for (const item of history) {
    const key = item.dateKey || todayKey;
    const existing = dateBuckets.get(key);
    if (existing) {
      existing.push(item);
    } else {
      dateBuckets.set(key, [item]);
    }
  }

  const orderedDates = Array.from(dateBuckets.entries()).sort((a, b) =>
    b[0].localeCompare(a[0])
  );

  return (
    <div className="space-y-5">
      <SubPageHeader
        title={t.allHistoryTitle}
        subtitle={
          history.length > 0
            ? t.activitiesCountLabel(history.length)
            : t.historyEmpty
        }
        backLabel={t.backBtn}
        onBack={onClose}
      />

      {orderedDates.length === 0 ? (
        <div className="py-10 text-center border border-dashed border-slate-200 rounded-2xl bg-white">
          <Clock className="w-6 h-6 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500">{t.historyEmpty}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {orderedDates.map(([dateKey, dateItems]) => {
            const subjectGroups = groupHistoryBySubject(
              dateItems,
              t.generalActivityGroup
            );
            return (
              <section
                key={dateKey}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="text-xs sm:text-sm font-display font-bold text-slate-900">
                    {formatHistoryDateLabel(dateKey, todayKey, language)}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 tabular-nums">
                    {t.activitiesCountLabel(dateItems.length)}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {subjectGroups.map((group) => (
                    <div
                      key={`${dateKey}-${group.groupTitle}`}
                      className="space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2 px-1">
                        <h2 className="text-xs font-display font-bold text-slate-700">
                          {group.groupTitle}
                        </h2>
                        <span className="text-[11px] text-slate-500 tabular-nums">
                          {t.activitiesCountLabel(group.items.length)}
                        </span>
                      </div>

                      <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden bg-slate-50/30">
                        {group.items.map((item) => {
                          const typeLabel = getActivityDisplayLabel(
                            item,
                            language
                          );
                          const showSubtitle =
                            item.subtitle && item.subtitle !== group.groupTitle;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => onOpenHistoryItem(item)}
                              className="w-full text-left px-3 py-2.5 hover:bg-[#F4FAF9] active:bg-teal-50/60 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <ActivityIcon type={item.type} />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs sm:text-sm font-medium text-slate-900 leading-snug">
                                    <span className="font-semibold text-[#0F766E]">
                                      {typeLabel}
                                    </span>
                                    <span className="text-slate-400 mx-1">
                                      ·
                                    </span>
                                    <span>{item.title}</span>
                                  </p>
                                  <p className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                                    {showSubtitle
                                      ? `${item.subtitle} · ${item.timestamp}`
                                      : item.timestamp}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {item.xpEarned > 0 && (
                                  <span className="px-2 py-0.5 rounded-md bg-teal-50 text-[#0F766E] border border-teal-200/70 text-[11px] font-mono font-semibold tabular-nums">
                                    +{item.xpEarned} XP
                                  </span>
                                )}
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
