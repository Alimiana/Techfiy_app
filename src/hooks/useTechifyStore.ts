import { useEffect, useState, useCallback } from 'react';
import {
  ActivityEntry,
  AssignmentSubmission,
  AttendanceLogEntry,
  DiscussionReply,
  DiscussionThread,
  Language,
  QuizAttempt,
  TechifyState,
  UserProfile,
  UserRole,
} from '../types/lms';
import {
  COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_THREADS,
} from '../data/curriculum';

const STORAGE_KEY = 'techify_lms_state_v1';

export const CHECK_IN_REWARDS = [10, 15, 20, 25, 30, 40, 50] as const;

export const LEVEL_THRESHOLDS: readonly { level: number; minXp: number }[] = [
  { level: 1, minXp: 0 },
  { level: 2, minXp: 200 },
  { level: 3, minXp: 450 },
  { level: 4, minXp: 750 },
  { level: 5, minXp: 1100 },
];

function computeLevelInfo(xp: number) {
  let current = LEVEL_THRESHOLDS[0];
  let nextThreshold: number | null = LEVEL_THRESHOLDS[1].minXp;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i].minXp) {
      current = LEVEL_THRESHOLDS[i];
      nextThreshold =
        i + 1 < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[i + 1].minXp : null;
    }
  }

  if (nextThreshold === null) {
    // Beyond Level 5 (1100 XP): +400 XP per subsequent level
    const extraLevels = Math.floor((xp - 1100) / 400);
    const level = 5 + extraLevels;
    const floorXp = 1100 + extraLevels * 400;
    const ceilXp = floorXp + 400;
    const remaining = ceilXp - xp;
    const pct = Math.round(((xp - floorXp) / 400) * 100);
    return {
      level,
      xpRemainingToNext: remaining,
      levelProgressPercent: pct,
      nextLevelXp: ceilXp,
    };
  }

  const span = nextThreshold - current.minXp;
  const gainedInLevel = xp - current.minXp;
  return {
    level: current.level,
    xpRemainingToNext: nextThreshold - xp,
    levelProgressPercent: Math.round((gainedInLevel / span) * 100),
    nextLevelXp: nextThreshold,
  };
}

export function getTodayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const INITIAL_ATTENDANCE_BY_COURSE: Record<string, AttendanceLogEntry[]> =
  Object.fromEntries(COURSES.map((c) => [c.id, c.initialAttendanceLogs]));

const DEFAULT_STATE: TechifyState = {
  language: 'id',
  darkMode: false,
  notificationsEnabled: true,
  user: {
    name: 'Alimiana',
    email: 'alimiana@gmail.com',
    identityType: 'NIM · Mahasiswa',
    identityNumber: '25050974149',
    program: 'Pendidikan Teknologi Informasi',
    faculty: 'Fakultas Teknik',
    cohort: '2025',
    semesterLabel: 'Gasal 2026/2027 · Semester 3',
    advisor: 'Dr. Andi Saputra, M.Kom.',
    phone: '+62 812-3456-7890',
    address: 'Surabaya, Jawa Timur',
    role: 'mahasiswa',
    isAuthenticated: false,
  },
  xp: 0,
  completedChapterIds: [],
  downloadedChapterIds: [],
  watchedVideoIds: [],
  quizAttempts: [],
  threads: INITIAL_THREADS,
  history: [],
  notifications: INITIAL_NOTIFICATIONS,
  savedScheduleIds: [],
  attendanceByCourse: INITIAL_ATTENDANCE_BY_COURSE,
  assignmentSubmissions: [],
  dailyDateKey: getTodayDateKey(),
  completedDailyTargets: [],
  claimedFeatureKeys: [],
  checkInStreakCount: 0,
  lastCheckInDateKey: null,
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AL';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function formatNowTime(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `Hari ini, ${hh}.${mm}`;
}

function normalizeDailyBucket(prev: TechifyState): TechifyState {
  const today = getTodayDateKey();
  if (prev.dailyDateKey === today) return prev;
  return {
    ...prev,
    dailyDateKey: today,
    completedDailyTargets: [],
    claimedFeatureKeys: [],
  };
}

export function useTechifyStore() {
  const [state, setState] = useState<TechifyState>(() => {
    const today = getTodayDateKey();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<TechifyState>;
        const isSameDay = parsed.dailyDateKey === today;
        const fallbackDateKey = parsed.dailyDateKey || today;
        const normalizedHistory = (parsed.history || []).map((entry) => ({
          ...entry,
          dateKey: entry.dateKey || fallbackDateKey,
        }));
        const mergedAttendance: Record<string, AttendanceLogEntry[]> = {
          ...INITIAL_ATTENDANCE_BY_COURSE,
        };
        if (parsed.attendanceByCourse) {
          for (const course of COURSES) {
            const savedLogs = parsed.attendanceByCourse[course.id];
            if (Array.isArray(savedLogs) && savedLogs.length > 0) {
              mergedAttendance[course.id] = savedLogs;
            }
          }
        }
        return {
          ...DEFAULT_STATE,
          ...parsed,
          user: { ...DEFAULT_STATE.user, ...(parsed.user || {}) },
          downloadedChapterIds: parsed.downloadedChapterIds || [],
          threads: parsed.threads && parsed.threads.length > 0 ? parsed.threads : INITIAL_THREADS,
          history: normalizedHistory,
          notifications:
            parsed.notifications && parsed.notifications.length > 0
              ? parsed.notifications
              : INITIAL_NOTIFICATIONS,
          attendanceByCourse: mergedAttendance,
          assignmentSubmissions: parsed.assignmentSubmissions || [],
          dailyDateKey: today,
          completedDailyTargets: isSameDay ? parsed.completedDailyTargets || [] : [],
          claimedFeatureKeys: isSameDay ? parsed.claimedFeatureKeys || [] : [],
          checkInStreakCount: parsed.checkInStreakCount ?? 0,
          lastCheckInDateKey: parsed.lastCheckInDateKey ?? null,
        };
      }
    } catch {
      // Ignore corrupted storage
    }
    return DEFAULT_STATE;
  });

  const [toast, setToast] = useState<{ id: number; message: string; tone?: 'teal' | 'amber' } | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', state.darkMode);
    root.style.colorScheme = state.darkMode ? 'dark' : 'light';
  }, [state.darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const showToast = useCallback((message: string, tone: 'teal' | 'amber' = 'teal') => {
    const id = Date.now();
    setToast({ id, message, tone });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3200);
  }, []);

  const setLanguage = useCallback((language: Language) => {
    setState((prev) => ({ ...prev, language }));
  }, []);

  const toggleLanguage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      language: prev.language === 'id' ? 'en' : 'id',
    }));
  }, []);

  const loginUser = useCallback(
    (payload: { name?: string; email: string; identityType?: string; identityNumber?: string }) => {
      const emailPrefix = payload.email.split('@')[0] || 'Alimiana';
      const cleanedName =
        payload.name?.trim() ||
        (/^\d+$/.test(emailPrefix)
          ? 'Alimiana'
          : emailPrefix.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));

      setState((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          name: cleanedName,
          email: payload.email,
          identityType: payload.identityType || prev.user.identityType || 'NIM · Mahasiswa',
          identityNumber: payload.identityNumber?.trim() || prev.user.identityNumber || '25050974149',
          isAuthenticated: true,
        },
      }));
    },
    []
  );

  const logoutUser = useCallback(() => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, isAuthenticated: false },
    }));
  }, []);

  const updateProfile = useCallback(
    (
      updates: Partial<
        Pick<
          UserProfile,
          | 'name'
          | 'email'
          | 'identityNumber'
          | 'program'
          | 'identityType'
          | 'phone'
          | 'address'
          | 'avatarDataUrl'
        >
      >
    ) => {
      setState((prev) => ({
        ...prev,
        user: { ...prev.user, ...updates },
      }));
      showToast(state.language === 'id' ? 'Profil berhasil diperbarui' : 'Profile updated successfully');
    },
    [showToast, state.language]
  );

  const switchRolePreview = useCallback(
    (role: UserRole) => {
      setState((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          role,
          identityType: role === 'dosen' ? 'NIDN · Dosen' : 'NIM · Mahasiswa',
        },
      }));
      showToast(
        role === 'dosen'
          ? state.language === 'id'
            ? 'Mode pratinjau Dosen aktif'
            : 'Lecturer preview mode enabled'
          : state.language === 'id'
            ? 'Mode Mahasiswa aktif'
            : 'Student mode enabled'
      );
    },
    [showToast, state.language]
  );

  const toggleNotificationsEnabled = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled,
    }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  // 7-day Daily XP Check-in (Shopee-coin style) — anti-spam locked once per day
  const claimDailyCheckIn = useCallback(() => {
    const today = getTodayDateKey();
    if (state.lastCheckInDateKey === today) {
      return;
    }

    const currentCount = state.checkInStreakCount >= 7 ? 0 : state.checkInStreakCount;
    const rewardXp = CHECK_IN_REWARDS[currentCount];
    const dayNumber = currentCount + 1;

    setState((prev) => {
      if (prev.lastCheckInDateKey === today) return prev;
      const baseCount = prev.checkInStreakCount >= 7 ? 0 : prev.checkInStreakCount;
      const xpEarned = CHECK_IN_REWARDS[baseCount];
      const dayNum = baseCount + 1;
      const entry: ActivityEntry = {
        id: `act-checkin-${Date.now()}`,
        type: 'checkin',
        activityLabel: prev.language === 'id' ? 'Check-in Harian' : 'Daily Check-in',
        title:
          prev.language === 'id'
            ? `Check-in XP Harian (Hari ${dayNum})`
            : `Daily XP Check-in (Day ${dayNum})`,
        subtitle: prev.language === 'id' ? 'Bonus kehadiran harian' : 'Daily streak bonus',
        dateKey: today,
        xpEarned,
        timestamp: formatNowTime(),
      };
      return {
        ...prev,
        xp: prev.xp + xpEarned,
        checkInStreakCount: dayNum,
        lastCheckInDateKey: today,
        history: [entry, ...prev.history].slice(0, 100),
      };
    });

    showToast(
      state.language === 'id'
        ? `+${rewardXp} XP · Check-in Hari ${dayNumber} berhasil diklaim`
        : `+${rewardXp} XP · Day ${dayNumber} check-in claimed`
    );
  }, [showToast, state.checkInStreakCount, state.language, state.lastCheckInDateKey]);

  // Automatically triggered when a chapter module is opened/read (anti-spam: once per chapterId)
  const completeChapter = useCallback(
    (courseId: string, chapterId: string, chapterTitle: string) => {
      if (state.completedChapterIds.includes(chapterId)) {
        return;
      }
      const course = COURSES.find((c) => c.id === courseId);
      const xpReward = 25;

      setState((prev) => {
        if (prev.completedChapterIds.includes(chapterId)) {
          return prev;
        }
        const entry: ActivityEntry = {
          id: `act-${Date.now()}`,
          type: 'materi',
          activityLabel: prev.language === 'id' ? 'Modul Ajar' : 'Module',
          title: chapterTitle,
          subtitle: course?.title || 'Materi',
          courseId,
          courseTitle: course?.title,
          chapterId,
          dateKey: getTodayDateKey(),
          xpEarned: xpReward,
          timestamp: formatNowTime(),
        };
        return {
          ...prev,
          xp: prev.xp + xpReward,
          completedChapterIds: [...prev.completedChapterIds, chapterId],
          history: [entry, ...prev.history].slice(0, 100),
        };
      });

      showToast(
        state.language === 'id'
          ? `+${xpReward} XP · Modul bab dibaca`
          : `+${xpReward} XP · Module read`
      );
    },
    [showToast, state.completedChapterIds, state.language]
  );

  // Automatically triggered when a study video is watched (anti-spam: once per chapterId)
  const completeVideo = useCallback(
    (courseId: string, chapterId: string, chapterTitle: string) => {
      if (state.watchedVideoIds.includes(chapterId)) {
        return;
      }
      const course = COURSES.find((c) => c.id === courseId);
      const xpReward = 30;

      setState((prev) => {
        if (prev.watchedVideoIds.includes(chapterId)) {
          return prev;
        }
        const entry: ActivityEntry = {
          id: `act-${Date.now()}`,
          type: 'video',
          activityLabel: prev.language === 'id' ? 'Video Belajar' : 'Study Video',
          title: chapterTitle,
          subtitle: course?.title || 'Video Belajar',
          courseId,
          courseTitle: course?.title,
          chapterId,
          dateKey: getTodayDateKey(),
          xpEarned: xpReward,
          timestamp: formatNowTime(),
        };
        return {
          ...prev,
          xp: prev.xp + xpReward,
          watchedVideoIds: [...prev.watchedVideoIds, chapterId],
          history: [entry, ...prev.history].slice(0, 100),
        };
      });

      showToast(
        state.language === 'id'
          ? `+${xpReward} XP · Video Belajar dibuka di YouTube`
          : `+${xpReward} XP · Study video opened on YouTube`
      );
    },
    [showToast, state.language, state.watchedVideoIds]
  );

  // Trigger real module file download + automatic anti-spam XP (+15 XP once per chapterId)
  const downloadChapterMaterial = useCallback(
    (courseId: string, chapterId: string, chapterTitle: string) => {
      const course = COURSES.find((c) => c.id === courseId);
      const chapter = course?.chapters.find((ch) => ch.id === chapterId);

      if (course && chapter) {
        const lines = [
          `TECHIFY — MODUL AJAR`,
          `Mata Kuliah : ${course.title} (${course.code})`,
          `Dosen       : ${course.lecturer}`,
          `Modul       : ${chapter.moduleLabel} — ${chapter.title}`,
          ``,
          `RINGKASAN MATERI:`,
          chapter.summary,
          ``,
          `POIN UTAMA PEMBELAJARAN:`,
          ...chapter.keyPoints.map((pt, i) => `${i + 1}. ${pt}`),
        ];
        if (chapter.codeExample) {
          lines.push('', 'CONTOH IMPLEMENTASI:', chapter.codeExample);
        }
        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        const safeName = `${course.code}_${chapter.id}`.toLowerCase().replace(/[^a-z0-9_-]+/g, '_');
        anchor.href = url;
        anchor.download = `${safeName}.txt`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      if (state.downloadedChapterIds.includes(chapterId)) {
        showToast(
          state.language === 'id'
            ? 'Materi berhasil diunduh ulang'
            : 'Module re-downloaded'
        );
        return;
      }

      const xpReward = 15;
      setState((prev) => {
        if (prev.downloadedChapterIds.includes(chapterId)) {
          return prev;
        }
        const entry: ActivityEntry = {
          id: `act-${Date.now()}`,
          type: 'materi',
          activityLabel: prev.language === 'id' ? 'Unduh Materi' : 'Download Module',
          title: chapterTitle,
          subtitle: course?.title || 'Materi',
          courseId,
          courseTitle: course?.title,
          chapterId,
          dateKey: getTodayDateKey(),
          xpEarned: xpReward,
          timestamp: formatNowTime(),
        };
        return {
          ...prev,
          xp: prev.xp + xpReward,
          downloadedChapterIds: [...prev.downloadedChapterIds, chapterId],
          history: [entry, ...prev.history].slice(0, 100),
        };
      });

      showToast(
        state.language === 'id'
          ? `+${xpReward} XP · Materi berhasil diunduh`
          : `+${xpReward} XP · Module downloaded`
      );
    },
    [showToast, state.downloadedChapterIds, state.language]
  );

  // Quiz submission (anti-spam: awards XP strictly on first completion of courseId + mode)
  const submitQuizAttempt = useCallback(
    (courseId: string, mode: 'pretest' | 'posttest', score: number, total: number) => {
      const course = COURSES.find((c) => c.id === courseId);
      const alreadyCompleted = state.quizAttempts.some(
        (a) => a.courseId === courseId && a.mode === mode
      );
      const xpReward = alreadyCompleted ? 0 : mode === 'pretest' ? 40 : 60;

      const attempt: QuizAttempt = {
        courseId,
        mode,
        score,
        total,
        completedAt: formatNowTime(),
      };

      setState((prev) => {
        const exists = prev.quizAttempts.some(
          (a) => a.courseId === courseId && a.mode === mode
        );
        const earned = exists ? 0 : mode === 'pretest' ? 40 : 60;
        const entry: ActivityEntry = {
          id: `act-${Date.now()}`,
          type: mode,
          activityLabel: mode === 'pretest' ? 'Pretest' : 'Posttest',
          title:
            prev.language === 'id'
              ? `Hasil ${mode === 'pretest' ? 'Pretest' : 'Posttest'} · Skor ${score}/${total}`
              : `${mode === 'pretest' ? 'Pretest' : 'Posttest'} Result · Score ${score}/${total}`,
          subtitle: course?.title || (mode === 'pretest' ? 'Pretest' : 'Posttest'),
          courseId,
          courseTitle: course?.title,
          dateKey: getTodayDateKey(),
          xpEarned: earned,
          timestamp: formatNowTime(),
        };
        return {
          ...prev,
          xp: prev.xp + earned,
          quizAttempts: [
            ...prev.quizAttempts.filter((a) => !(a.courseId === courseId && a.mode === mode)),
            attempt,
          ],
          history: [entry, ...prev.history].slice(0, 100),
        };
      });

      if (xpReward > 0) {
        showToast(
          `+${xpReward} XP · ${mode === 'pretest' ? 'Pretest' : 'Posttest'} (${score}/${total})`
        );
      } else {
        showToast(
          state.language === 'id'
            ? `Skor diperbarui (${score}/${total})`
            : `Score updated (${score}/${total})`
        );
      }
    },
    [showToast, state.language, state.quizAttempts]
  );

  // Automatic XP when opening Jadwal Pelajaran or Manual Book (anti-spam: once per feature per day)
  const recordFeatureVisit = useCallback(
    (feature: 'jadwal' | 'manual') => {
      const today = getTodayDateKey();
      const key = `${today}:${feature}`;
      const bucket = normalizeDailyBucket(state);
      if (bucket.claimedFeatureKeys.includes(key)) {
        return;
      }

      const xpReward = 10;

      setState((prev) => {
        const fresh = normalizeDailyBucket(prev);
        if (fresh.claimedFeatureKeys.includes(key)) {
          return fresh;
        }
        const entry: ActivityEntry = {
          id: `act-${Date.now()}`,
          type: feature,
          activityLabel:
            feature === 'jadwal'
              ? fresh.language === 'id'
                ? 'Jadwal Pelajaran'
                : 'Class Schedule'
              : 'Manual Book',
          title:
            feature === 'jadwal'
              ? fresh.language === 'id'
                ? 'Membuka Jadwal Pelajaran'
                : 'Opened Class Schedule'
              : fresh.language === 'id'
                ? 'Membuka Manual Book'
                : 'Opened Manual Book',
          subtitle:
            feature === 'jadwal'
              ? fresh.language === 'id'
                ? 'Jadwal Kelas'
                : 'Weekly Timetable'
              : fresh.language === 'id'
                ? 'Panduan Penggunaan'
                : 'Usage Guide',
          dateKey: today,
          xpEarned: xpReward,
          timestamp: formatNowTime(),
        };
        return {
          ...fresh,
          xp: fresh.xp + xpReward,
          claimedFeatureKeys: [...fresh.claimedFeatureKeys, key],
          history: [entry, ...fresh.history].slice(0, 100),
        };
      });

      showToast(
        state.language === 'id'
          ? `+${xpReward} XP · ${feature === 'jadwal' ? 'Jadwal Pelajaran dibuka' : 'Manual Book dibuka'}`
          : `+${xpReward} XP · ${feature === 'jadwal' ? 'Schedule opened' : 'Manual Book opened'}`
      );
    },
    [showToast, state]
  );

  const addDiscussionThread = useCallback(
    (payload: { courseId: string; chapterLabel: string; title: string; body: string }) => {
      const course = COURSES.find((c) => c.id === payload.courseId);
      const newThread: DiscussionThread = {
        id: `disc-${Date.now()}`,
        courseId: payload.courseId,
        courseTitle: course?.title || 'Umum',
        chapterLabel: payload.chapterLabel || 'Diskusi Umum',
        title: payload.title.trim(),
        body: payload.body.trim(),
        authorName: state.user.name,
        authorInitials: getInitials(state.user.name),
        authorRole: state.user.role,
        createdAt: 'Baru saja',
        timestampMs: Date.now(),
        views: 1,
        replies: [],
      };
      setState((prev) => {
        const entry: ActivityEntry = {
          id: `act-${Date.now()}`,
          type: 'diskusi',
          activityLabel: prev.language === 'id' ? 'Diskusi (Topik Baru)' : 'Discussion (New Topic)',
          title: payload.title.trim(),
          subtitle: course?.title || 'Diskusi',
          courseId: payload.courseId,
          courseTitle: course?.title,
          threadId: newThread.id,
          dateKey: getTodayDateKey(),
          xpEarned: 15,
          timestamp: formatNowTime(),
        };
        return {
          ...prev,
          xp: prev.xp + 15,
          threads: [newThread, ...prev.threads],
          history: [entry, ...prev.history].slice(0, 100),
        };
      });
      showToast('+15 XP · Topik diskusi diterbitkan');
      return newThread.id;
    },
    [showToast, state.user.name, state.user.role]
  );

  const addDiscussionReply = useCallback(
    (threadId: string, body: string) => {
      const today = getTodayDateKey();
      const spamKey = `${today}:reply:${threadId}`;
      const bucket = normalizeDailyBucket(state);
      const alreadyRewarded = bucket.claimedFeatureKeys.includes(spamKey);
      const xpReward = alreadyRewarded ? 0 : 10;

      const thread = state.threads.find((th) => th.id === threadId);
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const reply: DiscussionReply = {
        id: `rep-${Date.now()}`,
        authorName: state.user.name,
        authorInitials: getInitials(state.user.name),
        authorRole: state.user.role,
        body: body.trim(),
        createdAt: `${hh}.${mm}`,
      };
      setState((prev) => {
        const fresh = normalizeDailyBucket(prev);
        const claimed = fresh.claimedFeatureKeys.includes(spamKey);
        const earned = claimed ? 0 : 10;
        const entry: ActivityEntry = {
          id: `act-${Date.now()}`,
          type: 'diskusi',
          activityLabel: fresh.language === 'id' ? 'Diskusi (Balasan)' : 'Discussion (Reply)',
          title: thread?.title || 'Diskusi',
          subtitle: thread?.courseTitle || 'Diskusi',
          courseId: thread?.courseId,
          courseTitle: thread?.courseTitle,
          threadId,
          dateKey: today,
          xpEarned: earned,
          timestamp: formatNowTime(),
        };
        return {
          ...fresh,
          xp: fresh.xp + earned,
          claimedFeatureKeys: claimed
            ? fresh.claimedFeatureKeys
            : [...fresh.claimedFeatureKeys, spamKey],
          threads: fresh.threads.map((t) =>
            t.id === threadId ? { ...t, replies: [...t.replies, reply] } : t
          ),
          history: [entry, ...fresh.history].slice(0, 100),
        };
      });
      if (xpReward > 0) {
        showToast(
          state.language === 'id'
            ? `+${xpReward} XP · Balasan terkirim`
            : `+${xpReward} XP · Reply sent`
        );
      } else {
        showToast(state.language === 'id' ? 'Balasan terkirim' : 'Reply sent');
      }
    },
    [showToast, state]
  );

  const incrementThreadView = useCallback((threadId: string) => {
    setState((prev) => ({
      ...prev,
      threads: prev.threads.map((t) => (t.id === threadId ? { ...t, views: t.views + 1 } : t)),
    }));
  }, []);

  const toggleSavedSchedule = useCallback(
    (courseId: string) => {
      const course = COURSES.find((c) => c.id === courseId);
      const exists = state.savedScheduleIds.includes(courseId);
      setState((prev) => ({
        ...prev,
        savedScheduleIds: exists
          ? prev.savedScheduleIds.filter((id) => id !== courseId)
          : [...prev.savedScheduleIds, courseId],
      }));
      showToast(
        exists
          ? `Pengingat ${course?.scheduleTitle || course?.title} dinonaktifkan`
          : `Pengingat jadwal ${course?.scheduleTitle || course?.title} aktif`
      );
    },
    [showToast, state.savedScheduleIds]
  );

  const submitQrAttendance = useCallback(
    (courseId: string) => {
      const course = COURSES.find((c) => c.id === courseId);
      if (!course) return;
      const todayKey = getTodayDateKey();
      const existingLogs = state.attendanceByCourse[courseId] || course.initialAttendanceLogs;

      if (existingLogs.some((entry) => entry.dateKey === todayKey)) {
        showToast(
          state.language === 'id'
            ? 'Presensi hari ini sudah tercatat'
            : 'Today’s attendance is already recorded'
        );
        return;
      }

      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const dateLabel = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
      const xpReward = 10;

      setState((prev) => {
        const currentLogs = prev.attendanceByCourse[courseId] || course.initialAttendanceLogs;
        if (currentLogs.some((entry) => entry.dateKey === todayKey)) {
          return prev;
        }
        const nextMeeting = currentLogs.length + 1;
        const chapter = course.chapters[(nextMeeting - 1) % course.chapters.length];
        const cleanTopic = chapter.title.replace(/^Bab\s+\d+\s*-\s*/i, '');
        const newLog: AttendanceLogEntry = {
          id: `${courseId}-att-qr-${Date.now()}`,
          meetingNumber: nextMeeting,
          dateLabel,
          dateKey: todayKey,
          timeLabel: `${course.startTime} - ${course.endTime}`,
          topic: `${chapter.moduleLabel}: ${cleanTopic}`,
          status: 'hadir',
          method: 'QR',
        };
        const historyEntry: ActivityEntry = {
          id: `act-qr-${Date.now()}`,
          type: 'jadwal',
          activityLabel: prev.language === 'id' ? 'Presensi QR' : 'QR Check-in',
          title:
            prev.language === 'id'
              ? `Presensi QR · Pertemuan ${nextMeeting}`
              : `QR Check-in · Meeting ${nextMeeting}`,
          subtitle: course.title,
          courseId: course.id,
          courseTitle: course.title,
          dateKey: todayKey,
          xpEarned: xpReward,
          timestamp: formatNowTime(),
        };
        return {
          ...prev,
          xp: prev.xp + xpReward,
          attendanceByCourse: {
            ...prev.attendanceByCourse,
            [courseId]: [...currentLogs, newLog],
          },
          history: [historyEntry, ...prev.history].slice(0, 100),
        };
      });

      showToast(
        state.language === 'id'
          ? `+${xpReward} XP · Presensi QR ${course.title} tercatat`
          : `+${xpReward} XP · QR check-in recorded for ${course.title}`
      );
    },
    [showToast, state.attendanceByCourse, state.language]
  );

  const submitAssignment = useCallback(
    (payload: {
      assignmentId: string;
      courseId: string;
      answerText: string;
      submissionLink: string;
      attachmentName: string;
    }) => {
      const assignment = INITIAL_ASSIGNMENTS.find((a) => a.id === payload.assignmentId);
      const course = COURSES.find((c) => c.id === payload.courseId);
      if (!assignment || !course) return;

      const alreadySubmitted = state.assignmentSubmissions.some(
        (s) => s.assignmentId === payload.assignmentId
      );
      const xpReward = alreadySubmitted ? 0 : 35;

      const nextSubmission: AssignmentSubmission = {
        assignmentId: payload.assignmentId,
        courseId: payload.courseId,
        answerText: payload.answerText.trim(),
        submissionLink: payload.submissionLink.trim(),
        attachmentName: payload.attachmentName.trim(),
        submittedAt: formatNowTime(),
      };

      setState((prev) => {
        const exists = prev.assignmentSubmissions.some(
          (s) => s.assignmentId === payload.assignmentId
        );
        const earned = exists ? 0 : 35;
        const entry: ActivityEntry = {
          id: `act-tugas-${Date.now()}`,
          type: 'tugas',
          activityLabel: prev.language === 'id' ? 'Tugas' : 'Assignment',
          title: prev.language === 'id' ? assignment.title : assignment.titleEn,
          subtitle: course.title,
          courseId: course.id,
          courseTitle: course.title,
          assignmentId: assignment.id,
          dateKey: getTodayDateKey(),
          xpEarned: earned,
          timestamp: formatNowTime(),
        };
        return {
          ...prev,
          xp: prev.xp + earned,
          assignmentSubmissions: [
            ...prev.assignmentSubmissions.filter(
              (s) => s.assignmentId !== payload.assignmentId
            ),
            nextSubmission,
          ],
          history: [entry, ...prev.history].slice(0, 100),
        };
      });

      if (xpReward > 0) {
        showToast(
          state.language === 'id'
            ? `+${xpReward} XP · Tugas berhasil dikirim`
            : `+${xpReward} XP · Assignment submitted`
        );
      } else {
        showToast(
          state.language === 'id'
            ? 'Pengumpulan tugas berhasil diperbarui'
            : 'Assignment submission updated'
        );
      }
    },
    [showToast, state.assignmentSubmissions, state.language]
  );

  const resetProgress = useCallback(() => {
    setState((prev) => ({
      ...DEFAULT_STATE,
      dailyDateKey: getTodayDateKey(),
      language: prev.language,
      user: { ...prev.user, isAuthenticated: true },
    }));
    showToast('Progres belajar direset ke kondisi awal');
  }, [showToast]);

  const { level, xpRemainingToNext, levelProgressPercent, nextLevelXp } = computeLevelInfo(
    state.xp
  );
  const unreadNotificationsCount = state.notifications.filter((n) => !n.read).length;
  const canClaimCheckInToday = state.lastCheckInDateKey !== getTodayDateKey();

  const todayKey = getTodayDateKey();
  const todayHistory = state.history.filter(
    (entry) => entry.dateKey === todayKey
  );

  const totalChapters = COURSES.reduce((acc, c) => acc + c.chapters.length, 0);
  const completedChaptersCount = state.completedChapterIds.length;
  const overallProgressPercent =
    totalChapters > 0 ? Math.round((completedChaptersCount / totalChapters) * 100) : 0;

  return {
    state,
    todayHistory,
    toast,
    level,
    xpRemainingToNext,
    levelProgressPercent,
    nextLevelXp,
    canClaimCheckInToday,
    unreadNotificationsCount,
    totalChapters,
    completedChaptersCount,
    overallProgressPercent,
    userInitials: getInitials(state.user.name),
    setLanguage,
    toggleLanguage,
    toggleDarkMode,
    loginUser,
    logoutUser,
    updateProfile,
    switchRolePreview,
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
    toggleSavedSchedule,
    submitQrAttendance,
    submitAssignment,
    resetProgress,
    showToast,
  };
}
