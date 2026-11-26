import { useState } from 'react';
import {
  Bell,
  BookOpen,
  Globe,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  User,
} from 'lucide-react';
import { AuthScreen } from './components/AuthScreen';
import { BrandLogo } from './components/BrandLogo';
import { DashboardView } from './components/DashboardView';
import { DiskusiView } from './components/DiskusiView';
import { InteractiveModals } from './components/InteractiveModals';
import { KelasView } from './components/KelasView';
import { MateriView } from './components/MateriView';
import { ProfilView } from './components/ProfilView';
import { SplashScreen } from './components/SplashScreen';
import { TRANSLATIONS } from './data/translations';
import { useTechifyStore } from './hooks/useTechifyStore';
import { ActiveOverlay, ActivityEntry, MainTab } from './types/lms';

export default function App() {
  const {
    state,
    todayHistory,
    toast,
    level,
    xpRemainingToNext,
    levelProgressPercent,
    canClaimCheckInToday,
    unreadNotificationsCount,
    totalChapters,
    completedChaptersCount,
    overallProgressPercent,
    userInitials,
    toggleLanguage,
    toggleDarkMode,
    loginUser,
    logoutUser,
    updateProfile,
    toggleNotificationsEnabled,
    markNotificationRead,
    markAllNotificationsRead,
    claimDailyCheckIn,
    completeChapter,
    downloadChapterMaterial,
    completeVideo,
    submitQuizAttempt,
    recordFeatureVisit,
    addDiscussionThread,
    addDiscussionReply,
    incrementThreadView,
    submitQrAttendance,
    submitAssignment,
    resetProgress,
    showToast,
  } = useTechifyStore();

  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [deepLinkChapterId, setDeepLinkChapterId] = useState<string | null>(null);
  const [deepLinkMateriSection, setDeepLinkMateriSection] = useState<
    'chapters' | 'assignments' | null
  >(null);
  const [deepLinkAssignmentId, setDeepLinkAssignmentId] = useState<string | null>(null);
  const [deepLinkDiskusi, setDeepLinkDiskusi] = useState<{
    courseId?: string | null;
    threadId?: string | null;
  } | null>(null);
  const [overlay, setOverlay] = useState<ActiveOverlay>(null);
  const [tabSubPageActive, setTabSubPageActive] = useState(false);

  const t = TRANSLATIONS[state.language];
  const isSubPage = overlay !== null || tabSubPageActive;

  const handleNavigateTab = (tab: MainTab, opts?: { openSchedule?: boolean }) => {
    setOverlay(null);
    setActiveTab(tab);
    setTabSubPageActive(false);
    if (tab === 'kelas' && opts?.openSchedule) {
      recordFeatureVisit('jadwal');
    }
    if (tab !== 'materi') {
      setSelectedCourseId(null);
      setDeepLinkChapterId(null);
      setDeepLinkMateriSection(null);
      setDeepLinkAssignmentId(null);
    }
    if (tab !== 'diskusi') {
      setDeepLinkDiskusi(null);
    }
  };

  const handleOpenManual = () => {
    setOverlay({ type: 'manual' });
    recordFeatureVisit('manual');
  };

  // Direct deep-link navigation from Riwayat without granting duplicate XP
  const handleOpenHistoryItem = (item: ActivityEntry) => {
    switch (item.type) {
      case 'materi':
        setOverlay(null);
        setDeepLinkDiskusi(null);
        setDeepLinkMateriSection('chapters');
        setDeepLinkAssignmentId(null);
        setSelectedCourseId(item.courseId || null);
        setDeepLinkChapterId(item.chapterId || null);
        setActiveTab('materi');
        break;
      case 'tugas':
        setOverlay(null);
        setDeepLinkDiskusi(null);
        setDeepLinkChapterId(null);
        setSelectedCourseId(item.courseId || null);
        setDeepLinkMateriSection('assignments');
        setDeepLinkAssignmentId(item.assignmentId || null);
        setActiveTab('materi');
        break;
      case 'video':
        setOverlay({
          type: 'video',
          courseId: item.courseId,
          chapterId: item.chapterId,
        });
        break;
      case 'pretest':
      case 'posttest':
        setOverlay({
          type: 'quiz',
          mode: item.type,
          courseId: item.courseId,
          openResult: true,
        });
        break;
      case 'diskusi':
        setOverlay(null);
        setSelectedCourseId(null);
        setDeepLinkChapterId(null);
        setDeepLinkMateriSection(null);
        setDeepLinkAssignmentId(null);
        setDeepLinkDiskusi({
          courseId: item.courseId || null,
          threadId: item.threadId || null,
        });
        setActiveTab('diskusi');
        break;
      case 'jadwal':
        setOverlay(null);
        setSelectedCourseId(null);
        setDeepLinkChapterId(null);
        setDeepLinkMateriSection(null);
        setDeepLinkAssignmentId(null);
        setDeepLinkDiskusi(null);
        setTabSubPageActive(false);
        setActiveTab('kelas');
        break;
      case 'manual':
        setOverlay({ type: 'manual' });
        break;
      case 'checkin':
        setOverlay({ type: 'xp' });
        break;
      default:
        setOverlay(null);
        break;
    }
  };

  if (showSplash) {
    return (
      <SplashScreen
        language={state.language}
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  if (!state.user.isAuthenticated) {
    return (
      <>
        <AuthScreen
          language={state.language}
          onToggleLanguage={toggleLanguage}
          onAuthenticated={(payload) => {
            loginUser(payload);
            setActiveTab('dashboard');
          }}
          onNotify={(msg) => showToast(msg)}
        />
        {toast && <ToastBanner message={toast.message} />}
      </>
    );
  }

  const navItems: { id: MainTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'kelas', label: t.navKelas, icon: GraduationCap },
    { id: 'materi', label: t.navMateri, icon: BookOpen },
    { id: 'diskusi', label: t.navDiskusi, icon: MessageSquare },
    { id: 'profil', label: t.navProfil, icon: User },
  ];

  const tabCanvasBg: Record<MainTab, string> = {
    dashboard: 'bg-[#F4FAF9] dark:bg-[#0B1214]',
    kelas: 'bg-[#F8FAFC] dark:bg-[#0B1214]',
    materi: 'bg-[#F6F8F7] dark:bg-[#0B1214]',
    diskusi: 'bg-[#F9FAFB] dark:bg-[#0B1214]',
    profil: 'bg-[#F3F8F7] dark:bg-[#0B1214]',
  };

  return (
    <div className={`min-h-screen ${tabCanvasBg[activeTab]} text-slate-900 dark:text-slate-100 flex transition-colors duration-200`}>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200 z-30">
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
          {activeTab === 'dashboard' ? (
            <BrandLogo size="sm" />
          ) : (
            <span className="text-base font-display font-bold tracking-tight text-slate-900">
              {navItems.find((item) => item.id === activeTab)?.label}
            </span>
          )}
        </div>

        <nav className="flex-1 p-3.5 space-y-1" aria-label="Navigasi Utama">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigateTab(item.id)}
                className={`w-full min-h-[44px] px-3.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                  active
                    ? 'bg-teal-50 text-[#0F766E]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" strokeWidth={active ? 2.2 : 1.9} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom Account + Language Quick Switch */}
        <div className="p-3.5 border-t border-slate-100 space-y-2.5">
          <button
            type="button"
            onClick={toggleLanguage}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-between cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#0F766E]" />
              <span>{t.languageLabel}</span>
            </span>
            <span className="font-mono text-[#0F766E]">{state.language.toUpperCase()}</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigateTab('profil')}
            className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
              {state.user.avatarDataUrl ? (
                <img
                  src={state.user.avatarDataUrl}
                  alt={state.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                userInitials
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-display font-bold text-slate-900 truncate">
                {state.user.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {t.studentRole} · Lv.{level}
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header (hidden on mobile during full sub-pages so the sub-page back header sits at the top) */}
        <header
          className={`sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 h-14 sm:h-16 ${
            isSubPage ? 'hidden lg:block' : ''
          }`}
        >
          <div className="max-w-5xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
            <div className="lg:hidden">
              {activeTab === 'dashboard' ? (
                <BrandLogo size="sm" />
              ) : (
                <span className="text-base font-display font-bold tracking-tight text-slate-900">
                  {navItems.find((item) => item.id === activeTab)?.label}
                </span>
              )}
            </div>
            <div className="hidden lg:flex items-center text-xs text-slate-500 font-medium">
              <span>{state.user.program}</span>
            </div>

            {activeTab === 'dashboard' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="lg:hidden min-h-[40px] px-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 inline-flex items-center gap-1 cursor-pointer"
                  aria-label="Toggle Language"
                >
                  <Globe className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{state.language.toUpperCase()}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOverlay({ type: 'notifications' })}
                  className="relative min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                  aria-label={t.notificationsTitle}
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0F766E] text-white text-[10px] font-mono font-bold flex items-center justify-center tabular-nums">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Body */}
        <main
          className={`flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 ${
            isSubPage ? 'pb-8' : 'pb-28 lg:pb-8'
          }`}
        >
          {overlay !== null ? (
            <InteractiveModals
              overlay={overlay}
              language={state.language}
              notifications={state.notifications}
              quizAttempts={state.quizAttempts}
              watchedVideoIds={state.watchedVideoIds}
              history={state.history}
              xp={state.xp}
              level={level}
              xpRemainingToNext={xpRemainingToNext}
              levelProgressPercent={levelProgressPercent}
              checkInStreakCount={state.checkInStreakCount}
              canClaimCheckInToday={canClaimCheckInToday}
              onClaimCheckIn={claimDailyCheckIn}
              onClose={() => setOverlay(null)}
              onMarkNotificationRead={markNotificationRead}
              onMarkAllNotificationsRead={markAllNotificationsRead}
              onNavigateTab={(tab) => handleNavigateTab(tab)}
              onSubmitQuiz={submitQuizAttempt}
              onCompleteVideo={completeVideo}
              onOpenHistoryItem={handleOpenHistoryItem}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  language={state.language}
                  userName={state.user.name}
                  userRole={state.user.role}
                  xp={state.xp}
                  level={level}
                  xpRemainingToNext={xpRemainingToNext}
                  levelProgressPercent={levelProgressPercent}
                  history={todayHistory}
                  hasAnyHistory={state.history.length > 0}
                  onOpenXpModal={() => setOverlay({ type: 'xp' })}
                  onNavigateTab={handleNavigateTab}
                  onOpenQuiz={(mode) => setOverlay({ type: 'quiz', mode })}
                  onOpenVideo={() => setOverlay({ type: 'video' })}
                  onOpenManual={handleOpenManual}
                  onOpenHistoryItem={handleOpenHistoryItem}
                  onOpenAllHistory={() => setOverlay({ type: 'history' })}
                />
              )}

              {activeTab === 'kelas' && (
                <KelasView
                  language={state.language}
                  attendanceByCourse={state.attendanceByCourse}
                  assignmentSubmissions={state.assignmentSubmissions}
                  onConfirmQrAttendance={submitQrAttendance}
                  onOpenCourseMaterials={(courseId) => {
                    setSelectedCourseId(courseId);
                    setDeepLinkChapterId(null);
                    setDeepLinkMateriSection('chapters');
                    setDeepLinkAssignmentId(null);
                    setTabSubPageActive(false);
                    setActiveTab('materi');
                  }}
                  onOpenCourseAssignments={(courseId) => {
                    setSelectedCourseId(courseId);
                    setDeepLinkChapterId(null);
                    setDeepLinkMateriSection('assignments');
                    setDeepLinkAssignmentId(null);
                    setTabSubPageActive(false);
                    setActiveTab('materi');
                  }}
                  onSubPageChange={setTabSubPageActive}
                />
              )}

              {activeTab === 'materi' && (
                <MateriView
                  language={state.language}
                  selectedCourseId={selectedCourseId}
                  onSelectCourse={setSelectedCourseId}
                  deepLinkChapterId={deepLinkChapterId}
                  onConsumeDeepLinkChapter={() => setDeepLinkChapterId(null)}
                  deepLinkSection={deepLinkMateriSection}
                  deepLinkAssignmentId={deepLinkAssignmentId}
                  onConsumeDeepLinkAssignment={() => {
                    setDeepLinkMateriSection(null);
                    setDeepLinkAssignmentId(null);
                  }}
                  completedChapterIds={state.completedChapterIds}
                  downloadedChapterIds={state.downloadedChapterIds}
                  assignmentSubmissions={state.assignmentSubmissions}
                  onCompleteChapter={completeChapter}
                  onDownloadChapter={downloadChapterMaterial}
                  onSubmitAssignment={submitAssignment}
                  onSubPageChange={setTabSubPageActive}
                />
              )}

              {activeTab === 'diskusi' && (
                <DiskusiView
                  language={state.language}
                  threads={state.threads}
                  userRole={state.user.role}
                  currentUserName={state.user.name}
                  currentUserAvatarUrl={state.user.avatarDataUrl}
                  deepLinkCourseId={deepLinkDiskusi?.courseId}
                  deepLinkThreadId={deepLinkDiskusi?.threadId}
                  onConsumeDeepLink={() => setDeepLinkDiskusi(null)}
                  onAddThread={addDiscussionThread}
                  onAddReply={addDiscussionReply}
                  onViewThread={incrementThreadView}
                  onSubPageChange={setTabSubPageActive}
                />
              )}

              {activeTab === 'profil' && (
                <ProfilView
                  language={state.language}
                  darkMode={state.darkMode}
                  user={state.user}
                  userInitials={userInitials}
                  notificationsEnabled={state.notificationsEnabled}
                  overallProgressPercent={overallProgressPercent}
                  completedChaptersCount={completedChaptersCount}
                  totalChapters={totalChapters}
                  completedTasksAndQuizzesCount={
                    state.quizAttempts.length + state.assignmentSubmissions.length
                  }
                  onUpdateProfile={updateProfile}
                  onNavigateTab={(tab) => handleNavigateTab(tab)}
                  onOpenAssignmentsProgress={() => {
                    setSelectedCourseId('pbo');
                    setDeepLinkChapterId(null);
                    setDeepLinkMateriSection('assignments');
                    setDeepLinkAssignmentId(null);
                    setTabSubPageActive(false);
                    setActiveTab('materi');
                  }}
                  onToggleLanguage={toggleLanguage}
                  onToggleDarkMode={toggleDarkMode}
                  onToggleNotifications={toggleNotificationsEnabled}
                  onOpenManual={handleOpenManual}
                  onLogout={logoutUser}
                  onResetProgress={resetProgress}
                  onNotify={(msg) => showToast(msg)}
                  onSubPageChange={setTabSubPageActive}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Floating Mobile Bottom 5-Tab Bar with Protruding Active Circle — Hidden in Full Sub-Pages */}
      {!isSubPage && (
        <nav
          aria-label="Navigasi Bawah"
          className="lg:hidden fixed bottom-3 inset-x-3 z-30 bg-white/95 dark:bg-[#131D20]/95 backdrop-blur-md border border-slate-200/90 dark:border-[#24363B] rounded-[26px] shadow-[0_8px_28px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_28px_rgba(0,0,0,0.45)] h-16 px-1.5 overflow-visible"
        >
          <div className="grid grid-cols-5 h-full max-w-lg mx-auto overflow-visible">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigateTab(item.id)}
                  className={`relative flex flex-col items-center justify-center min-h-[44px] transition-colors cursor-pointer overflow-visible ${
                    active
                      ? 'text-[#0F766E] dark:text-teal-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center transition-transform duration-150 ${
                      active
                        ? '-mt-4 w-9 h-9 rounded-full bg-[#0F766E] text-white ring-[3px] ring-white dark:ring-[#131D20] shadow-sm'
                        : 'w-8 h-6 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Icon
                      className={active ? 'w-4 h-4' : 'w-[18px] h-[18px]'}
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                  </span>
                  <span
                    className={`text-[10px] tracking-tight whitespace-nowrap leading-none ${
                      active
                        ? 'font-bold text-[#0F766E] dark:text-teal-400 mt-1'
                        : 'font-medium mt-1'
                    }`}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <span
                      className="w-5 h-[2px] rounded-full bg-[#0F766E] dark:bg-teal-400 mt-1"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {toast && <ToastBanner message={toast.message} />}
    </div>
  );
}

function ToastBanner({ message }: { message: string }) {
  return (
    <div className="fixed bottom-24 lg:bottom-6 right-4 left-4 sm:left-auto sm:max-w-sm z-50 pointer-events-none flex justify-center sm:justify-end">
      <div className="bg-slate-900 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-slate-800">
        {message}
      </div>
    </div>
  );
}
