import { ActivityEntry, Language } from '../types/lms';

export interface SubjectHistoryGroup {
  groupTitle: string;
  items: ActivityEntry[];
}

export function groupHistoryBySubject(
  items: ActivityEntry[],
  generalGroupLabel: string
): SubjectHistoryGroup[] {
  const map = new Map<string, ActivityEntry[]>();
  for (const item of items) {
    const key = item.courseTitle?.trim() || generalGroupLabel;
    const existing = map.get(key);
    if (existing) {
      existing.push(item);
    } else {
      map.set(key, [item]);
    }
  }
  return Array.from(map.entries()).map(([groupTitle, groupItems]) => ({
    groupTitle,
    items: groupItems,
  }));
}

export function formatHistoryDateLabel(
  dateKey: string,
  todayKey: string,
  language: Language
): string {
  if (!dateKey || dateKey === todayKey) {
    return language === 'id' ? 'Hari Ini' : 'Today';
  }
  const parts = dateKey.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return dateKey;
  }
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(dateObj);
}

export function getActivityDisplayLabel(
  item: ActivityEntry,
  language: Language
): string {
  if (item.activityLabel) return item.activityLabel;
  switch (item.type) {
    case 'materi':
      return language === 'id' ? 'Modul Ajar' : 'Module';
    case 'video':
      return language === 'id' ? 'Video Belajar' : 'Study Video';
    case 'pretest':
      return 'Pretest';
    case 'posttest':
      return 'Posttest';
    case 'diskusi':
      return language === 'id' ? 'Diskusi' : 'Discussion';
    case 'jadwal':
      return language === 'id' ? 'Jadwal Pelajaran' : 'Class Schedule';
    case 'manual':
      return 'Manual Book';
    case 'checkin':
      return language === 'id' ? 'Check-in Harian' : 'Daily Check-in';
    case 'tugas':
      return language === 'id' ? 'Tugas' : 'Assignment';
    default:
      return language === 'id' ? 'Aktivitas' : 'Activity';
  }
}
