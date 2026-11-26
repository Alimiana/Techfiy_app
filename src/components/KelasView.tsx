import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  History,
  QrCode,
  ScanLine,
  User,
} from 'lucide-react';
import { COURSES, INITIAL_ASSIGNMENTS } from '../data/curriculum';
import { TRANSLATIONS } from '../data/translations';
import { getTodayDateKey } from '../hooks/useTechifyStore';
import {
  AssignmentSubmission,
  AttendanceLogEntry,
  AttendanceStatus,
  Course,
  DayOfWeek,
  Language,
} from '../types/lms';

interface KelasViewProps {
  language: Language;
  attendanceByCourse: Record<string, AttendanceLogEntry[]>;
  assignmentSubmissions: AssignmentSubmission[];
  onConfirmQrAttendance: (courseId: string) => void;
  onOpenCourseMaterials: (courseId: string) => void;
  onOpenCourseAssignments: (courseId: string) => void;
  onSubPageChange?: (isSubPage: boolean) => void;
}

const WEEKDAYS: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

const DAY_INDEX_MAP: Record<DayOfWeek, number> = {
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
};

function parseMinutes(hhmm: string): number {
  const [hh, mm] = hhmm.split(':').map(Number);
  return (hh || 0) * 60 + (mm || 0);
}

function getCurrentTimeContext(): {
  todayDay: DayOfWeek | null;
  jsDay: number;
  nowMinutes: number;
} {
  const now = new Date();
  const jsDay = now.getDay();
  const map: Record<number, DayOfWeek> = {
    1: 'Senin',
    2: 'Selasa',
    3: 'Rabu',
    4: 'Kamis',
    5: 'Jumat',
  };
  return {
    todayDay: map[jsDay] || null,
    jsDay,
    nowMinutes: now.getHours() * 60 + now.getMinutes(),
  };
}

type SessionStatus = 'completed' | 'ongoing' | 'scheduled';

function getCourseSessionStatus(
  course: Course,
  jsDay: number,
  nowMinutes: number
): SessionStatus {
  if (jsDay === 0 || jsDay === 6) {
    return 'completed';
  }
  const courseDayIdx = DAY_INDEX_MAP[course.dayOfWeek];
  if (courseDayIdx < jsDay) return 'completed';
  if (courseDayIdx > jsDay) return 'scheduled';

  const startMins = parseMinutes(course.startTime);
  const endMins = parseMinutes(course.endTime);
  if (nowMinutes > endMins) return 'completed';
  if (nowMinutes >= startMins) return 'ongoing';
  return 'scheduled';
}

function summarizeAttendance(logs: AttendanceLogEntry[]) {
  let hadir = 0;
  let sakit = 0;
  let izin = 0;
  let alpha = 0;
  for (const log of logs) {
    if (log.status === 'hadir') hadir += 1;
    else if (log.status === 'sakit') sakit += 1;
    else if (log.status === 'izin') izin += 1;
    else if (log.status === 'alpha') alpha += 1;
  }
  const total = logs.length;
  const pct = total > 0 ? Math.round((hadir / total) * 100) : 0;
  return { hadir, sakit, izin, alpha, total, pct };
}

function StudentQrCameraScanner({
  course,
  language,
  alreadyCheckedToday,
  summary,
  onConfirm,
  onBack,
  onOpenMaterials,
}: {
  course: Course;
  language: Language;
  alreadyCheckedToday: boolean;
  summary: ReturnType<typeof summarizeAttendance>;
  onConfirm: () => void;
  onBack: () => void;
  onOpenMaterials: () => void;
}) {
  const t = TRANSLATIONS[language];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);
  const [cameraStatus, setCameraStatus] = useState<
    'requesting' | 'active' | 'denied' | 'unavailable'
  >('requesting');
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const attachStreamToVideo = useCallback((videoEl: HTMLVideoElement | null) => {
    videoRef.current = videoEl;
    if (videoEl && streamRef.current && videoEl.srcObject !== streamRef.current) {
      videoEl.srcObject = streamRef.current;
      videoEl.play().catch(() => {
        // Autoplay policy handled by muted + playsInline
      });
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setCameraStatus('unavailable');
      return;
    }

    setCameraStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {
          // Ignore autoplay promise rejection when muted
        }
      }
      setCameraStatus('active');
    } catch (err) {
      const name = err instanceof Error ? err.name : '';
      if (
        name === 'NotAllowedError' ||
        name === 'PermissionDeniedError' ||
        name === 'SecurityError'
      ) {
        setCameraStatus('denied');
      } else {
        setCameraStatus('unavailable');
      }
    }
  }, [stopCamera]);

  useEffect(() => {
    mountedRef.current = true;
    if (!alreadyCheckedToday) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      mountedRef.current = false;
      stopCamera();
    };
  }, [alreadyCheckedToday, startCamera, stopCamera]);

  const handleScanAndConfirm = () => {
    if (alreadyCheckedToday || isScanning) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      stopCamera();
      onConfirm();
    }, 350);
  };

  const statusLabel =
    cameraStatus === 'active'
      ? t.qrCameraActiveLabel
      : cameraStatus === 'requesting'
        ? t.qrCameraRequestingLabel
        : t.qrCameraFallbackLabel;

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => {
            stopCamera();
            onBack();
          }}
          className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer shrink-0"
          aria-label={t.backBtn}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl font-display font-bold text-slate-900 tracking-tight leading-snug">
            {t.qrPageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">
            {course.title}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 space-y-5 shadow-[0_2px_6px_rgba(15,23,42,0.03)]">
        {/* Course Session Info */}
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-mono font-semibold text-[#0F766E]">
              {course.code} · {course.credits} SKS
            </p>
            <h2 className="text-base sm:text-lg font-display font-bold text-slate-900 leading-snug">
              {course.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">{course.lecturer}</p>
            <p className="text-xs text-slate-500 tabular-nums">
              {t.dayNames[course.dayOfWeek]}, {course.startTime} - {course.endTime} • {course.room}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[11px] font-semibold text-slate-500">
              {t.attendanceLabel}
            </p>
            <p className="text-sm font-mono font-bold text-[#0F766E] tabular-nums">
              {summary.pct}% ({summary.hadir}/{summary.total})
            </p>
          </div>
        </div>

        {/* Dedicated Top Camera Bar + Separated Viewfinder Box (Zero Overlap) */}
        <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
          <div className="bg-slate-900 px-3.5 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-200">
              <Camera className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                {alreadyCheckedToday ? t.qrAlreadyCheckedBtn : statusLabel}
              </span>
            </span>

            {!alreadyCheckedToday && cameraStatus !== 'active' && (
              <button
                type="button"
                onClick={startCamera}
                disabled={cameraStatus === 'requesting'}
                className="min-h-[32px] px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white text-[11px] font-semibold cursor-pointer transition-colors"
              >
                {cameraStatus === 'denied' || cameraStatus === 'unavailable'
                  ? t.qrRetryCameraBtn
                  : t.qrEnableCameraBtn}
              </button>
            )}
          </div>

          <div className="relative aspect-[4/3] sm:aspect-video max-h-[320px] w-full flex items-center justify-center overflow-hidden">
            <video
              ref={attachStreamToVideo}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover ${
                cameraStatus === 'active' && !alreadyCheckedToday ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Simulated Viewfinder Backdrop when hardware camera unavailable or already checked */}
            {(cameraStatus !== 'active' || alreadyCheckedToday) && (
              <div
                className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950/90"
                aria-hidden="true"
              >
                <div
                  className="w-full h-full opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at center, rgba(20,184,166,0.35) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
              </div>
            )}

            {/* Centered Scanning Target Reticle Frame */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 py-4">
              {alreadyCheckedToday ? (
                <div className="w-44 h-44 rounded-2xl bg-emerald-950/75 border-2 border-emerald-400/80 flex flex-col items-center justify-center gap-2 text-center p-4 backdrop-blur-xs">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  <p className="text-xs font-semibold text-white leading-snug">
                    {t.qrAlreadyCheckedBtn}
                  </p>
                </div>
              ) : (
                <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                  {/* 4 Corner Viewfinder Brackets */}
                  <span className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-teal-400 rounded-tl-xl" />
                  <span className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-teal-400 rounded-tr-xl" />
                  <span className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-teal-400 rounded-bl-xl" />
                  <span className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-teal-400 rounded-br-xl" />

                  {/* Subtle inner scan frame */}
                  <div className="w-40 h-40 rounded-xl border border-white/15 bg-slate-900/35 flex flex-col items-center justify-center gap-2 backdrop-blur-[1px]">
                    <ScanLine
                      className={`w-10 h-10 text-teal-300 transition-transform duration-300 ${
                        isScanning ? 'scale-110' : ''
                      }`}
                    />
                    <span className="text-[11px] text-slate-200 font-medium text-center px-3 leading-snug">
                      {isScanning
                        ? language === 'id'
                          ? 'Memverifikasi QR...'
                          : 'Verifying QR...'
                        : t.qrCameraHint}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {!alreadyCheckedToday &&
          (cameraStatus === 'denied' || cameraStatus === 'unavailable') && (
            <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 px-3.5 py-2.5 text-xs text-amber-900 leading-relaxed">
              {cameraStatus === 'denied'
                ? t.qrCameraDeniedNote
                : t.qrCameraUnavailableNote}
            </div>
          )}

        <p className="text-xs text-slate-600 text-center leading-relaxed">
          {t.qrPageSubtitle}
        </p>

        {/* Optional Session Code Input */}
        {!alreadyCheckedToday && (
          <div>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder={t.qrManualCodePlaceholder}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={alreadyCheckedToday || isScanning}
            onClick={handleScanAndConfirm}
            className={`h-11 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
              alreadyCheckedToday
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                : 'bg-[#0F766E] hover:bg-[#147D73] text-white cursor-pointer disabled:opacity-70'
            }`}
          >
            {alreadyCheckedToday ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <QrCode className="w-4 h-4" />
            )}
            <span>
              {alreadyCheckedToday ? t.qrAlreadyCheckedBtn : t.qrConfirmBtn}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              onOpenMaterials();
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#0F766E]" />
            <span>{language === 'id' ? 'Buka Materi Bab' : 'Open Chapters'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function KelasView({
  language,
  attendanceByCourse,
  assignmentSubmissions,
  onConfirmQrAttendance,
  onOpenCourseMaterials,
  onOpenCourseAssignments,
  onSubPageChange,
}: KelasViewProps) {
  const t = TRANSLATIONS[language];
  const [selectedDay, setSelectedDay] = useState<'all' | DayOfWeek>('all');
  const [qrCourseId, setQrCourseId] = useState<string | null>(null);
  const [historyCourseId, setHistoryCourseId] = useState<string | null>(null);

  const qrCourse = qrCourseId ? COURSES.find((c) => c.id === qrCourseId) || null : null;
  const historyCourse = historyCourseId
    ? COURSES.find((c) => c.id === historyCourseId) || null
    : null;

  useEffect(() => {
    onSubPageChange?.(Boolean(qrCourse || historyCourse));
  }, [qrCourse, historyCourse, onSubPageChange]);

  const { todayDay, jsDay, nowMinutes } = getCurrentTimeContext();
  const todayKey = getTodayDateKey();

  // Full-Page Student QR Camera Scanner
  if (qrCourse) {
    const logs = attendanceByCourse[qrCourse.id] || qrCourse.initialAttendanceLogs;
    const summary = summarizeAttendance(logs);
    const alreadyCheckedToday = logs.some((entry) => entry.dateKey === todayKey);

    return (
      <StudentQrCameraScanner
        course={qrCourse}
        language={language}
        alreadyCheckedToday={alreadyCheckedToday}
        summary={summary}
        onConfirm={() => onConfirmQrAttendance(qrCourse.id)}
        onBack={() => setQrCourseId(null)}
        onOpenMaterials={() => {
          const id = qrCourse.id;
          setQrCourseId(null);
          onOpenCourseMaterials(id);
        }}
      />
    );
  }

  // Full-Page Riwayat Kehadiran
  if (historyCourse) {
    const logs = attendanceByCourse[historyCourse.id] || historyCourse.initialAttendanceLogs;
    const summary = summarizeAttendance(logs);
    const orderedLogs = [...logs].reverse();

    const statusBadgeClass: Record<AttendanceStatus, string> = {
      hadir: 'bg-teal-50 text-[#0F766E] border-teal-200',
      sakit: 'bg-amber-50 text-amber-700 border-amber-200',
      izin: 'bg-sky-50 text-sky-700 border-sky-200',
      alpha: 'bg-rose-50 text-rose-700 border-rose-200',
    };

    const statusLabelMap: Record<AttendanceStatus, string> = {
      hadir: t.presentLabel,
      sakit: t.sickLabel,
      izin: t.permitLabel,
      alpha: t.absentLabel,
    };

    return (
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => setHistoryCourseId(null)}
            className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer shrink-0"
            aria-label={t.backBtn}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-display font-bold text-slate-900 tracking-tight leading-snug">
              {t.attendanceHistoryTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">
              {historyCourse.title}
            </p>
          </div>
        </div>

        {/* Summary Attendance Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
            <span className="font-semibold text-slate-700">{t.attendanceLabel}</span>
            <span className="font-mono font-bold text-[#0F766E] tabular-nums">
              {t.presentRatioLabel(summary.pct, summary.hadir, summary.total)}
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-[#0F766E] rounded-full transition-all duration-300"
              style={{ width: `${summary.pct}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 py-2 px-2 text-center">
              <p className="text-[11px] text-slate-500">{t.presentLabel}</p>
              <p className="text-sm font-mono font-bold text-[#0F766E] tabular-nums">
                {summary.hadir}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 py-2 px-2 text-center">
              <p className="text-[11px] text-slate-500">{t.sickLabel}</p>
              <p className="text-sm font-mono font-bold text-amber-700 tabular-nums">
                {summary.sakit}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 py-2 px-2 text-center">
              <p className="text-[11px] text-slate-500">{t.permitLabel}</p>
              <p className="text-sm font-mono font-bold text-sky-700 tabular-nums">
                {summary.izin}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 py-2 px-2 text-center">
              <p className="text-[11px] text-slate-500">{t.absentLabel}</p>
              <p className="text-sm font-mono font-bold text-rose-700 tabular-nums">
                {summary.alpha}
              </p>
            </div>
          </div>
        </div>

        {/* Chronological Meeting Logs */}
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
          {orderedLogs.map((entry) => (
            <div
              key={entry.id}
              className="p-4 flex items-start justify-between gap-3"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-slate-900">
                    {language === 'id'
                      ? `Pertemuan ${entry.meetingNumber}`
                      : `Meeting ${entry.meetingNumber}`}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    {entry.dateLabel} · {entry.timeLabel}
                  </span>
                  {entry.method && (
                    <span className="text-[10px] font-mono font-semibold text-slate-500">
                      ({entry.method})
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                  {entry.topic}
                </p>
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border shrink-0 ${statusBadgeClass[entry.status]}`}
              >
                {statusLabelMap[entry.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Compute Today's Highlight
  const todayCourses = todayDay
    ? COURSES.filter((c) => c.dayOfWeek === todayDay).sort(
        (a, b) => parseMinutes(a.startTime) - parseMinutes(b.startTime)
      )
    : [];

  const ongoingCourse =
    todayCourses.find((c) => {
      const s = parseMinutes(c.startTime);
      const e = parseMinutes(c.endTime);
      return nowMinutes >= s && nowMinutes <= e;
    }) || null;

  const upcomingCourse =
    !ongoingCourse
      ? todayCourses.find((c) => nowMinutes < parseMinutes(c.startTime)) || null
      : null;

  const visibleDays: DayOfWeek[] =
    selectedDay === 'all' ? WEEKDAYS : [selectedDay];

  return (
    <div className="space-y-5">
      {/* Desktop Header */}
      <div className="hidden lg:flex lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            {t.classesTitle}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">{t.classesSubtitle}</p>
        </div>
      </div>

      {/* Horizontal Scrollable Day Filter Chips */}
      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1"
        role="tablist"
        aria-label={language === 'id' ? 'Filter hari kuliah' : 'Filter class day'}
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedDay === 'all'}
          onClick={() => setSelectedDay('all')}
          className={`min-h-[38px] px-4 rounded-xl border text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
            selectedDay === 'all'
              ? 'bg-[#0F766E] border-[#0F766E] text-white shadow-xs'
              : 'bg-white border-slate-200/90 text-slate-600 hover:border-[#0F766E]/40 hover:text-slate-900'
          }`}
        >
          {t.filterAll}
        </button>

        {WEEKDAYS.map((day) => {
          const active = selectedDay === day;
          return (
            <button
              key={day}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedDay(day)}
              className={`min-h-[38px] px-4 rounded-xl border text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                active
                  ? 'bg-[#0F766E] border-[#0F766E] text-white shadow-xs'
                  : 'bg-white border-slate-200/90 text-slate-600 hover:border-[#0F766E]/40 hover:text-slate-900'
              }`}
            >
              {t.dayNames[day]}
            </button>
          );
        })}
      </div>

      {/* Sorotan Hari Ini */}
      <section className="space-y-2.5">
        <h2 className="text-sm font-display font-bold text-slate-900">
          {t.todayHighlightTitle}
        </h2>

        <div className="bg-gradient-to-r from-teal-50/75 via-white to-white dark:from-[#122627] dark:via-[#131D20] dark:to-[#131D20] border border-teal-200/70 dark:border-teal-500/25 rounded-2xl p-4 flex items-center gap-3.5 shadow-[0_2px_6px_rgba(15,118,110,0.04)]">
          {ongoingCourse ? (
            <>
              <div className="w-11 h-11 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#0F766E]">
                  {t.ongoingClassTitle}
                </p>
                <p className="text-sm font-display font-bold text-slate-900 leading-snug mt-0.5">
                  {ongoingCourse.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                  {ongoingCourse.startTime} - {ongoingCourse.endTime} • {ongoingCourse.room}
                </p>
              </div>
            </>
          ) : upcomingCourse ? (
            <>
              <div className="w-11 h-11 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#0F766E]">
                  {t.upcomingClassTitle}
                </p>
                <p className="text-sm font-display font-bold text-slate-900 leading-snug mt-0.5">
                  {upcomingCourse.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                  {upcomingCourse.startTime} - {upcomingCourse.endTime} • {upcomingCourse.room}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-11 h-11 rounded-xl bg-white border border-teal-200 text-[#0F766E] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-display font-bold text-slate-900 leading-snug">
                  {t.allClassesDoneTitle}
                </p>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  {t.allClassesDoneDesc}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Day Grouped Class Cards */}
      <div className="space-y-6">
        {visibleDays.map((day) => {
          const dayCourses = COURSES.filter((c) => c.dayOfWeek === day).sort(
            (a, b) => parseMinutes(a.startTime) - parseMinutes(b.startTime)
          );
          const isToday = day === todayDay;

          return (
            <section key={day} className="space-y-3">
              {/* Day Section Header */}
              <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-200/70">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-display font-bold text-slate-900">
                    {t.dayNames[day]}
                  </h2>
                  {isToday && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-[#0F766E] border border-teal-200/80">
                      {t.todayBadge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  {t.classesCountLabel(dayCourses.length)}
                </span>
              </div>

              {dayCourses.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center text-xs sm:text-sm text-slate-500">
                  {t.noClassesOnDay}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {dayCourses.map((course) => {
                    const status = getCourseSessionStatus(course, jsDay, nowMinutes);
                    const logs =
                      attendanceByCourse[course.id] || course.initialAttendanceLogs;
                    const summary = summarizeAttendance(logs);

                    const courseAssignments = INITIAL_ASSIGNMENTS.filter(
                      (a) => a.courseId === course.id
                    );
                    const submittedCount = courseAssignments.filter((a) =>
                      assignmentSubmissions.some((s) => s.assignmentId === a.id)
                    ).length;

                    const statusConfig: Record<
                      SessionStatus,
                      { label: string; textClass: string }
                    > = {
                      completed: {
                        label: t.statusCompleted,
                        textClass: 'bg-slate-100 text-slate-700 border-slate-200',
                      },
                      ongoing: {
                        label: t.statusOngoing,
                        textClass: 'bg-teal-50 text-[#0F766E] border-teal-200',
                      },
                      scheduled: {
                        label: t.statusScheduled,
                        textClass: 'bg-amber-50 text-amber-700 border-amber-200',
                      },
                    };

                    return (
                      <article
                        key={course.id}
                        className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-[0_2px_6px_rgba(15,23,42,0.03)] flex flex-col justify-between"
                      >
                        {/* Top Course Header Surface */}
                        <div className="p-4 sm:p-5 bg-slate-50/45 border-b border-slate-100 space-y-2.5">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base font-display font-bold text-slate-900 leading-snug">
                              {course.title}
                            </h3>
                            <span className="text-xs font-mono font-semibold text-slate-600 shrink-0 tabular-nums pt-0.5">
                              {course.credits} SKS
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
                              <User className="w-4 h-4 text-slate-400 shrink-0" />
                              <span>{course.lecturer}</span>
                            </p>
                            <p className="text-xs text-slate-500 flex items-start gap-2 tabular-nums leading-snug">
                              <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              <span>
                                {course.startTime} - {course.endTime} • {course.room}
                              </span>
                            </p>
                          </div>

                          <div className="pt-0.5 flex items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${statusConfig[status].textClass}`}
                            >
                              {statusConfig[status].label}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {course.code}
                            </span>
                          </div>
                        </div>

                        {/* Attendance & Actions Surface */}
                        <div className="p-4 sm:p-5 space-y-3.5">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="font-semibold text-slate-700">
                                {t.attendanceLabel}
                              </span>
                              <span className="font-mono font-semibold text-[#0F766E] tabular-nums">
                                {t.presentRatioLabel(
                                  summary.pct,
                                  summary.hadir,
                                  summary.total
                                )}
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-[#0F766E] rounded-full transition-all duration-300"
                                style={{ width: `${summary.pct}%` }}
                              />
                            </div>
                          </div>

                          {/* 4 Horizontal Stat Boxes */}
                          <div className="grid grid-cols-4 gap-2">
                            <div className="rounded-xl bg-slate-50/90 border border-slate-100 py-2 px-1.5 text-center">
                              <p className="text-[11px] text-slate-500">{t.presentLabel}</p>
                              <p className="text-sm font-mono font-bold text-[#0F766E] tabular-nums mt-0.5">
                                {summary.hadir}
                              </p>
                            </div>
                            <div className="rounded-xl bg-slate-50/90 border border-slate-100 py-2 px-1.5 text-center">
                              <p className="text-[11px] text-slate-500">{t.sickLabel}</p>
                              <p className="text-sm font-mono font-bold text-amber-700 tabular-nums mt-0.5">
                                {summary.sakit}
                              </p>
                            </div>
                            <div className="rounded-xl bg-slate-50/90 border border-slate-100 py-2 px-1.5 text-center">
                              <p className="text-[11px] text-slate-500">{t.permitLabel}</p>
                              <p className="text-sm font-mono font-bold text-sky-700 tabular-nums mt-0.5">
                                {summary.izin}
                              </p>
                            </div>
                            <div className="rounded-xl bg-slate-50/90 border border-slate-100 py-2 px-1.5 text-center">
                              <p className="text-[11px] text-slate-500">{t.absentLabel}</p>
                              <p className="text-sm font-mono font-bold text-rose-700 tabular-nums mt-0.5">
                                {summary.alpha}
                              </p>
                            </div>
                          </div>

                          {/* Primary Row: Presensi QR & Riwayat */}
                          <div className="grid grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() => setQrCourseId(course.id)}
                              className="h-10 rounded-xl bg-[#0F766E] hover:bg-[#147D73] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>{t.qrAttendanceBtn}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setHistoryCourseId(course.id)}
                              className="h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <History className="w-3.5 h-3.5 text-[#0F766E]" />
                              <span>{t.attendanceHistoryBtn}</span>
                            </button>
                          </div>

                          {/* Shortcut Button: Tugas Mata Kuliah */}
                          <button
                            type="button"
                            onClick={() => onOpenCourseAssignments(course.id)}
                            className="w-full h-10 px-3.5 rounded-xl bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200/60 text-[#0F766E] text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer"
                          >
                            <span className="inline-flex items-center gap-2">
                              <ClipboardList className="w-3.5 h-3.5 shrink-0" />
                              <span>{t.assignmentBtn}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono tabular-nums text-teal-800">
                              <span>
                                {submittedCount}/{courseAssignments.length}{' '}
                                {language === 'id' ? 'terkumpul' : 'submitted'}
                              </span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
