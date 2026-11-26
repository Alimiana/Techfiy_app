import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FileText,
  PlayCircle,
  Trophy,
} from 'lucide-react';
import { ActivityEntry, Language, MainTab, UserRole } from '../types/lms';
import { TRANSLATIONS } from '../data/translations';
import {
  getActivityDisplayLabel,
  groupHistoryBySubject,
} from '../utils/historyHelpers';
import { ActivityIcon } from './ActivityIcon';

interface DashboardViewProps {
  language: Language;
  userName: string;
  userRole: UserRole;
  xp: number;
  level: number;
  xpRemainingToNext: number;
  levelProgressPercent: number;
  history: ActivityEntry[];
  hasAnyHistory: boolean;
  onOpenXpModal: () => void;
  onNavigateTab: (tab: MainTab, opts?: { openSchedule?: boolean }) => void;
  onOpenQuiz: (mode: 'pretest' | 'posttest') => void;
  onOpenVideo: () => void;
  onOpenManual: () => void;
  onOpenHistoryItem: (item: ActivityEntry) => void;
  onOpenAllHistory: () => void;
}

export function DashboardView({
  language,
  userName,
  userRole,
  xp,
  level,
  xpRemainingToNext,
  levelProgressPercent,
  history,
  hasAnyHistory,
  onOpenXpModal,
  onNavigateTab,
  onOpenQuiz,
  onOpenVideo,
  onOpenManual,
  onOpenHistoryItem,
  onOpenAllHistory,
}: DashboardViewProps) {
  const t = TRANSLATIONS[language];
  const groupedHistory = groupHistoryBySubject(history, t.generalActivityGroup);

  const menuItems = [
    {
      id: 'pretest',
      label: t.menuPretest,
      subtitle: t.menuPretestSub,
      icon: ClipboardCheck,
      tone: 'bg-teal-50 text-[#0F766E]',
      onClick: () => onOpenQuiz('pretest'),
    },
    {
      id: 'materi',
      label: t.menuMateri,
      subtitle: t.menuMateriSub,
      icon: BookOpen,
      tone: 'bg-sky-50 text-sky-700',
      onClick: () => onNavigateTab('materi'),
    },
    {
      id: 'video',
      label: t.menuVideo,
      subtitle: t.menuVideoSub,
      icon: PlayCircle,
      tone: 'bg-amber-50 text-amber-700',
      onClick: onOpenVideo,
    },
    {
      id: 'posttest',
      label: t.menuPosttest,
      subtitle: t.menuPosttestSub,
      icon: CheckSquare,
      tone: 'bg-emerald-50 text-emerald-700',
      onClick: () => onOpenQuiz('posttest'),
    },
    {
      id: 'jadwal',
      label: t.menuJadwal,
      subtitle: t.menuJadwalSub,
      icon: CalendarDays,
      tone: 'bg-violet-50 text-violet-700',
      onClick: () => onNavigateTab('kelas', { openSchedule: true }),
    },
    {
      id: 'manual',
      label: t.menuManual,
      subtitle: t.menuManualSub,
      icon: FileText,
      tone: 'bg-rose-50 text-rose-700',
      onClick: onOpenManual,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
            {t.greetingPrefix} {userName}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">{t.greetingSubtitle}</p>
        </div>
        {userRole === 'dosen' && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-50 text-[#0F766E] border border-teal-200">
            {language === 'id' ? 'Pratinjau Dosen Aktif' : 'Lecturer Preview Active'}
          </span>
        )}
      </div>

      {/* Clean Hero Teal Level & XP Card — Clickable to open XP Detail Modal */}
      <button
        type="button"
        onClick={onOpenXpModal}
        className="w-full text-left rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#147D73] hover:brightness-105 active:scale-[0.995] transition-all text-white p-5 sm:p-6 shadow-sm cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-teal-100">
              {t.levelLabel} {level}
            </p>
            <div className="text-2xl sm:text-3xl font-display font-bold tabular-nums tracking-tight">
              {xp} XP
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-amber-200" strokeWidth={2} />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white dark:bg-white transition-all duration-300"
              style={{ width: `${Math.max(4, levelProgressPercent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-teal-50">
            <span className="tabular-nums">{t.xpToNext(xpRemainingToNext, level + 1)}</span>
            <span className="font-mono tabular-nums">{levelProgressPercent}%</span>
          </div>
        </div>
      </button>

      {/* 2x3 Interactive Menu Grid — Full text without truncation/ellipsis */}
      <section aria-label="Menu Pembelajaran">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className="group text-left bg-white border border-slate-200 hover:border-[#0F766E]/50 rounded-2xl p-4 transition-all hover:shadow-sm active:scale-[0.99] cursor-pointer flex flex-col justify-between min-h-[116px]"
              >
                <div className={`w-10 h-10 rounded-xl ${item.tone} flex items-center justify-center mb-3 shrink-0`}>
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm sm:text-base font-display font-semibold text-slate-900 group-hover:text-[#0F766E] transition-colors leading-snug">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Riwayat Section (Today Only, Grouped by Subject, Interactive Deep-link) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-display font-bold text-slate-900">{t.historyTitle}</h2>
            {history.length > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-[#F4FAF9] border border-teal-200/70 text-[11px] font-mono font-semibold text-[#0F766E] tabular-nums">
                {history.length}
              </span>
            )}
          </div>
          {(hasAnyHistory || history.length > 0) && (
            <button
              type="button"
              onClick={onOpenAllHistory}
              className="text-xs font-semibold text-[#0F766E] hover:text-[#147D73] hover:underline inline-flex items-center gap-0.5 cursor-pointer py-1"
            >
              <span>{t.viewAllHistory}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Clock className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500">{t.historyEmpty}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedHistory.map((group) => (
              <div key={group.groupTitle} className="space-y-1.5">
                {/* Group Header */}
                <div className="flex items-center justify-between gap-2 px-1">
                  <h3 className="text-xs font-display font-bold text-slate-700 tracking-tight">
                    {group.groupTitle}
                  </h3>
                  <span className="text-[11px] font-medium text-slate-500 tabular-nums shrink-0">
                    {t.activitiesCountLabel(group.items.length)}
                  </span>
                </div>

                {/* Clickable Activity Rows */}
                <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden bg-slate-50/30">
                  {group.items.map((item) => {
                    const typeLabel = getActivityDisplayLabel(item, language);
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
                              <span className="text-slate-400 mx-1">·</span>
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
        )}
      </section>
    </div>
  );
}

