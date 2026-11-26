import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  ClipboardList,
  FileText,
  MessageSquare,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { ActivityEntry } from '../types/lms';

const TYPE_STYLE: Record<
  ActivityEntry['type'],
  { icon: typeof BookOpen; bg: string }
> = {
  pretest: { icon: ClipboardCheck, bg: 'bg-teal-50 text-[#0F766E]' },
  materi: { icon: BookOpen, bg: 'bg-sky-50 text-sky-700' },
  video: { icon: PlayCircle, bg: 'bg-amber-50 text-amber-700' },
  posttest: { icon: CheckSquare, bg: 'bg-emerald-50 text-emerald-700' },
  diskusi: { icon: MessageSquare, bg: 'bg-teal-50 text-[#0F766E]' },
  jadwal: { icon: CalendarDays, bg: 'bg-violet-50 text-violet-700' },
  manual: { icon: FileText, bg: 'bg-rose-50 text-rose-700' },
  checkin: { icon: Sparkles, bg: 'bg-amber-50 text-amber-700' },
  tugas: { icon: ClipboardList, bg: 'bg-emerald-50 text-emerald-700' },
};

export function ActivityIcon({ type }: { type: ActivityEntry['type'] }) {
  const { icon: Icon, bg } = TYPE_STYLE[type] || TYPE_STYLE.materi;
  return (
    <div
      className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}
    >
      <Icon className="w-4 h-4" strokeWidth={2} />
    </div>
  );
}
