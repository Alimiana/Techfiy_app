import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Code2,
  Cpu,
  Database,
  Download,
  FileUp,
  Globe,
  Layers,
  Link2,
  Palette,
  Send,
} from 'lucide-react';
import { COURSES, INITIAL_ASSIGNMENTS } from '../data/curriculum';
import { TRANSLATIONS } from '../data/translations';
import {
  AssignmentItem,
  AssignmentSubmission,
  ChapterItem,
  Course,
  Language,
} from '../types/lms';

interface MateriViewProps {
  language: Language;
  selectedCourseId: string | null;
  onSelectCourse: (courseId: string | null) => void;
  deepLinkChapterId?: string | null;
  onConsumeDeepLinkChapter?: () => void;
  deepLinkSection?: 'chapters' | 'assignments' | null;
  deepLinkAssignmentId?: string | null;
  onConsumeDeepLinkAssignment?: () => void;
  completedChapterIds: string[];
  downloadedChapterIds: string[];
  assignmentSubmissions: AssignmentSubmission[];
  onCompleteChapter: (courseId: string, chapterId: string, chapterTitle: string) => void;
  onDownloadChapter: (courseId: string, chapterId: string, chapterTitle: string) => void;
  onSubmitAssignment: (payload: {
    assignmentId: string;
    courseId: string;
    answerText: string;
    submissionLink: string;
    attachmentName: string;
  }) => void;
  onSubPageChange?: (isSubPage: boolean) => void;
}

const COURSE_ICONS: Record<string, typeof Code2> = {
  pbo: Code2,
  'basis-data': Database,
  'pemweb-mobile': Globe,
  algoritma: Cpu,
  'ui-ux': Palette,
  'pemodelan-pl': Layers,
};

const PASTEL_STYLES: Record<Course['tone'], string> = {
  teal: 'bg-teal-50 text-[#0F766E]',
  sky: 'bg-sky-50 text-sky-700',
  amber: 'bg-amber-50 text-amber-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  rose: 'bg-rose-50 text-rose-700',
  violet: 'bg-violet-50 text-violet-700',
};

export function MateriView({
  language,
  selectedCourseId,
  onSelectCourse,
  deepLinkChapterId,
  onConsumeDeepLinkChapter,
  deepLinkSection,
  deepLinkAssignmentId,
  onConsumeDeepLinkAssignment,
  completedChapterIds,
  downloadedChapterIds,
  assignmentSubmissions,
  onCompleteChapter,
  onDownloadChapter,
  onSubmitAssignment,
  onSubPageChange,
}: MateriViewProps) {
  const t = TRANSLATIONS[language];
  const [courseSection, setCourseSection] = useState<'chapters' | 'assignments'>('chapters');
  const [activeChapter, setActiveChapter] = useState<ChapterItem | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<AssignmentItem | null>(null);

  // Assignment submission form state
  const [answerText, setAnswerText] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [formNotice, setFormNotice] = useState<string | null>(null);

  const selectedCourse = COURSES.find((c) => c.id === selectedCourseId) || null;

  useEffect(() => {
    onSubPageChange?.(Boolean(activeChapter || activeAssignment));
  }, [activeChapter, activeAssignment, onSubPageChange]);

  useEffect(() => {
    if (!selectedCourse) {
      setActiveChapter(null);
      setActiveAssignment(null);
      setCourseSection('chapters');
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (!selectedCourse || !deepLinkChapterId) return;
    const matched = selectedCourse.chapters.find((ch) => ch.id === deepLinkChapterId);
    if (matched) {
      setCourseSection('chapters');
      setActiveAssignment(null);
      setActiveChapter(matched);
      onConsumeDeepLinkChapter?.();
    }
  }, [selectedCourse, deepLinkChapterId, onConsumeDeepLinkChapter]);

  useEffect(() => {
    if (!selectedCourse) return;
    if (deepLinkSection === 'assignments') {
      setCourseSection('assignments');
      setActiveChapter(null);
      if (deepLinkAssignmentId) {
        const matchedAssignment = INITIAL_ASSIGNMENTS.find(
          (a) => a.id === deepLinkAssignmentId && a.courseId === selectedCourse.id
        );
        if (matchedAssignment) {
          setActiveAssignment(matchedAssignment);
        }
      }
      onConsumeDeepLinkAssignment?.();
    }
  }, [selectedCourse, deepLinkSection, deepLinkAssignmentId, onConsumeDeepLinkAssignment]);

  // Populate assignment form when opening an assignment
  useEffect(() => {
    if (!activeAssignment) {
      setFormNotice(null);
      return;
    }
    const existing = assignmentSubmissions.find(
      (s) => s.assignmentId === activeAssignment.id
    );
    setAnswerText(existing?.answerText || '');
    setSubmissionLink(existing?.submissionLink || '');
    setAttachmentName(existing?.attachmentName || '');
    setFormNotice(null);
  }, [activeAssignment, assignmentSubmissions]);

  const handleOpenChapter = (course: Course, chapter: ChapterItem) => {
    setActiveChapter(chapter);
    onCompleteChapter(course.id, chapter.id, chapter.title);
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      setFormNotice(null);
    }
  };

  const handleAssignmentFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !activeAssignment) return;
    if (!answerText.trim() && !submissionLink.trim() && !attachmentName.trim()) {
      setFormNotice(
        language === 'id'
          ? 'Isi jawaban, tautan, atau pilih berkas lampiran terlebih dahulu.'
          : 'Please enter an answer, link, or attach a file before submitting.'
      );
      return;
    }
    setFormNotice(null);
    onSubmitAssignment({
      assignmentId: activeAssignment.id,
      courseId: selectedCourse.id,
      answerText,
      submissionLink,
      attachmentName,
    });
  };

  // Full-Page Assignment Detail & Submission
  if (selectedCourse && activeAssignment) {
    const existingSubmission = assignmentSubmissions.find(
      (s) => s.assignmentId === activeAssignment.id
    );
    const isSubmitted = Boolean(existingSubmission);
    const displayTitle =
      language === 'id' ? activeAssignment.title : activeAssignment.titleEn;
    const displayInstructions =
      language === 'id'
        ? activeAssignment.instructions
        : activeAssignment.instructionsEn;
    const displayDeadline =
      language === 'id' ? activeAssignment.deadline : activeAssignment.deadlineEn;

    return (
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => setActiveAssignment(null)}
            className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer shrink-0"
            aria-label={t.backBtn}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#0F766E]">
              {selectedCourse.title} · {activeAssignment.chapterLabel}
            </p>
            <h1 className="text-lg sm:text-2xl font-display font-bold text-slate-900 tracking-tight leading-snug mt-0.5">
              {displayTitle}
            </h1>
          </div>
        </div>

        {/* Assignment Metadata & Instructions Card */}
        <div className="bg-white border border-teal-900/12 rounded-xl p-4 sm:p-6 space-y-4 shadow-[0_2px_8px_rgba(15,118,110,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600 tabular-nums">
              <CalendarClock className="w-4 h-4 text-[#0F766E] shrink-0" />
              <span>
                {t.assignmentDeadlineLabel}:{' '}
                <strong className="text-slate-900">{displayDeadline}</strong>
              </span>
            </div>
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border inline-flex items-center gap-1.5 ${
                isSubmitted
                  ? 'bg-teal-50 text-[#0F766E] border-teal-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isSubmitted && <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>
                {isSubmitted ? t.assignmentSubmitted : t.assignmentNotSubmitted}
              </span>
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-slate-800">
              {t.assignmentInstructionsLabel}
            </h2>
            <div className="bg-[#F6F8F7] border border-slate-200/80 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {displayInstructions}
            </div>
          </div>

          {existingSubmission && (
            <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 flex items-center justify-between gap-2 text-xs text-[#0F766E]">
              <span className="font-semibold">
                {language === 'id'
                  ? `Terakhir dikumpulkan: ${existingSubmission.submittedAt}`
                  : `Last submitted: ${existingSubmission.submittedAt}`}
              </span>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            </div>
          )}
        </div>

        {/* Submission Form Card */}
        <form
          onSubmit={handleAssignmentFormSubmit}
          className="bg-white border border-teal-900/12 rounded-xl p-4 sm:p-6 space-y-4 shadow-[0_2px_8px_rgba(15,118,110,0.04)]"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.assignmentAnswerLabel}
            </label>
            <textarea
              rows={4}
              value={answerText}
              onChange={(e) => {
                setAnswerText(e.target.value);
                setFormNotice(null);
              }}
              placeholder={t.assignmentAnswerPlaceholder}
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.assignmentLinkLabel}
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="url"
                value={submissionLink}
                onChange={(e) => {
                  setSubmissionLink(e.target.value);
                  setFormNotice(null);
                }}
                placeholder={t.assignmentLinkPlaceholder}
                className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.assignmentFileLabel}
            </label>
            <label className="min-h-[48px] px-3.5 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 hover:bg-teal-50/40 hover:border-[#0F766E]/50 flex items-center justify-between gap-3 cursor-pointer transition-colors">
              <span className="inline-flex items-center gap-2.5 min-w-0">
                <FileUp className="w-4 h-4 text-[#0F766E] shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700 truncate">
                  {attachmentName || t.assignmentFileEmpty}
                </span>
              </span>
              <span className="text-xs font-semibold text-[#0F766E] shrink-0">
                {language === 'id' ? 'Pilih File' : 'Browse'}
              </span>
              <input
                type="file"
                onChange={handleFilePick}
                className="sr-only"
              />
            </label>
          </div>

          {formNotice && (
            <p className="text-xs font-medium text-rose-600">{formNotice}</p>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#0F766E] hover:bg-[#147D73] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>
              {isSubmitted ? t.updateAssignmentBtn : t.submitAssignmentBtn}
            </span>
          </button>
        </form>
      </div>
    );
  }

  // Full-Page Chapter Detail
  if (selectedCourse && activeChapter) {
    const isDownloaded = downloadedChapterIds.includes(activeChapter.id);

    return (
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => setActiveChapter(null)}
            className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer shrink-0"
            aria-label={t.backBtn}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#0F766E]">
              {selectedCourse.title} · {activeChapter.moduleLabel}
            </p>
            <h1 className="text-lg sm:text-2xl font-display font-bold text-slate-900 tracking-tight leading-snug mt-0.5">
              {activeChapter.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{activeChapter.duration}</p>
          </div>
        </div>

        <div className="bg-white border border-teal-900/12 rounded-xl p-4 sm:p-6 space-y-5 shadow-[0_2px_8px_rgba(15,118,110,0.04)]">
          <div className="bg-[#F6F8F7] border border-teal-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-[#0F766E] mb-1">
              {language === 'id' ? 'Ringkasan Materi' : 'Module Summary'}
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {activeChapter.summary}
            </p>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-slate-700">
              {language === 'id' ? 'Poin Utama Pembelajaran' : 'Key Learning Points'}
            </p>
            <ul className="space-y-2.5">
              {activeChapter.keyPoints.map((pt, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-md bg-teal-50 text-[#0F766E] text-xs font-mono font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {activeChapter.codeExample && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-700">
                {language === 'id' ? 'Contoh Implementasi' : 'Code Example'}
              </p>
              <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
                <code>{activeChapter.codeExample}</code>
              </pre>
            </div>
          )}

          {/* Download Module Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {isDownloaded ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {language === 'id'
                    ? 'Modul sudah terunduh ke perangkat Anda'
                    : 'Module downloaded to your device'}
                </span>
              </span>
            ) : (
              <span className="text-xs text-slate-500">
                {language === 'id'
                  ? 'Simpan ringkasan bab untuk dipelajari offline (+15 XP)'
                  : 'Save this chapter summary for offline study (+15 XP)'}
              </span>
            )}

            <button
              type="button"
              onClick={() =>
                onDownloadChapter(
                  selectedCourse.id,
                  activeChapter.id,
                  activeChapter.title
                )
              }
              className={`h-11 px-5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0 ${
                isDownloaded
                  ? 'bg-teal-50 hover:bg-teal-100 text-[#0F766E] border border-teal-200'
                  : 'bg-[#0F766E] hover:bg-[#147D73] text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>
                {isDownloaded ? t.redownloadMaterialBtn : t.downloadMaterialBtn}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Course Detail (Chapters + Tugas Tabs)
  if (selectedCourse) {
    const doneCount = selectedCourse.chapters.filter((ch) =>
      completedChapterIds.includes(ch.id)
    ).length;
    const courseAssignments = INITIAL_ASSIGNMENTS.filter(
      (a) => a.courseId === selectedCourse.id
    );
    const submittedAssignmentsCount = courseAssignments.filter((a) =>
      assignmentSubmissions.some((s) => s.assignmentId === a.id)
    ).length;

    return (
      <div className="space-y-5">
        {/* Back Header */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => onSelectCourse(null)}
            className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer shrink-0"
            aria-label={t.backBtn}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-mono font-semibold text-[#0F766E]">
              {selectedCourse.code} · {selectedCourse.lecturer}
            </p>
            <h1 className="text-lg sm:text-2xl font-display font-bold text-slate-900 tracking-tight leading-snug">
              {selectedCourse.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 tabular-nums">
              {t.materiSummaryCount(selectedCourse.chapters.length, doneCount)} ·{' '}
              {submittedAssignmentsCount}/{courseAssignments.length}{' '}
              {language === 'id' ? 'tugas terkumpul' : 'assignments submitted'}
            </p>
          </div>
        </div>

        {/* Segmented Tab Switch: Modul Bab | Tugas */}
        <div className="grid grid-cols-2 p-1 bg-slate-200/60 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setCourseSection('chapters')}
            className={`min-h-[40px] px-3 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              courseSection === 'chapters'
                ? 'bg-white text-[#0F766E] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>{t.chaptersTabLabel}</span>
            <span className="font-mono text-[11px] opacity-80">
              ({selectedCourse.chapters.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCourseSection('assignments')}
            className={`min-h-[40px] px-3 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              courseSection === 'assignments'
                ? 'bg-white text-[#0F766E] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4 shrink-0" />
            <span>{t.assignmentsTabLabel}</span>
            <span className="font-mono text-[11px] opacity-80">
              ({courseAssignments.length})
            </span>
          </button>
        </div>

        {courseSection === 'chapters' ? (
          <div className="space-y-3">
            {selectedCourse.chapters.map((chapter) => {
              const isRead = completedChapterIds.includes(chapter.id);
              const isDownloaded = downloadedChapterIds.includes(chapter.id);
              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => handleOpenChapter(selectedCourse, chapter)}
                  className="w-full text-left bg-white border border-teal-900/12 hover:border-[#0F766E]/50 rounded-xl p-4 transition-all flex items-center justify-between gap-3 cursor-pointer shadow-[0_2px_8px_rgba(15,118,110,0.03)]"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-sm tabular-nums ${
                        isRead
                          ? 'bg-[#0F766E] text-white'
                          : 'bg-teal-50 text-[#0F766E]'
                      }`}
                    >
                      {chapter.number}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-base font-display font-semibold text-slate-900 leading-snug">
                        {chapter.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {chapter.moduleLabel} · {chapter.duration}
                        {isRead ? ` · ${t.readStatusLabel}` : ''}
                        {isDownloaded ? ` · ${t.downloadedBadge}` : ''}
                      </p>
                    </div>
                  </div>

                  <span className="min-h-[40px] px-3 rounded-xl bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 shrink-0">
                    <BookOpen className="w-4 h-4 text-[#0F766E]" />
                    <span className="hidden sm:inline">
                      {language === 'id' ? 'Buka' : 'Open'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {courseAssignments.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
                {t.noAssignmentsLabel}
              </div>
            ) : (
              courseAssignments.map((assignment) => {
                const submission = assignmentSubmissions.find(
                  (s) => s.assignmentId === assignment.id
                );
                const isSubmitted = Boolean(submission);
                const displayTitle =
                  language === 'id' ? assignment.title : assignment.titleEn;
                const displaySummary =
                  language === 'id' ? assignment.summary : assignment.summaryEn;
                const displayDeadline =
                  language === 'id' ? assignment.deadline : assignment.deadlineEn;

                return (
                  <button
                    key={assignment.id}
                    type="button"
                    onClick={() => setActiveAssignment(assignment)}
                    className="w-full text-left bg-white border border-teal-900/12 hover:border-[#0F766E]/50 rounded-xl p-4 sm:p-5 transition-all cursor-pointer shadow-[0_2px_8px_rgba(15,118,110,0.03)] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-[#0F766E]">
                        {assignment.chapterLabel}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border shrink-0 ${
                          isSubmitted
                            ? 'bg-teal-50 text-[#0F766E] border-teal-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {isSubmitted ? t.assignmentSubmitted : t.assignmentNotSubmitted}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-sm sm:text-base font-display font-bold text-slate-900 leading-snug">
                        {displayTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {displaySummary}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <CalendarClock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {t.assignmentDeadlineLabel}: {displayDeadline}
                        </span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden lg:block">
        <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
          {t.materiTitle}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {COURSES.map((course) => {
          const Icon = COURSE_ICONS[course.id] || BookOpen;
          const total = course.chapters.length;
          const done = course.chapters.filter((ch) =>
            completedChapterIds.includes(ch.id)
          ).length;
          const pct = Math.round((done / total) * 100);
          const courseAssignments = INITIAL_ASSIGNMENTS.filter(
            (a) => a.courseId === course.id
          );
          const submittedCount = courseAssignments.filter((a) =>
            assignmentSubmissions.some((s) => s.assignmentId === a.id)
          ).length;

          return (
            <button
              key={course.id}
              type="button"
              onClick={() => onSelectCourse(course.id)}
              className="text-left bg-white border border-teal-900/12 hover:border-[#0F766E]/50 rounded-xl p-4 sm:p-5 transition-all shadow-[0_2px_8px_rgba(15,118,110,0.04)] hover:shadow-sm active:scale-[0.99] cursor-pointer flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-xl ${PASTEL_STYLES[course.tone]} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-6 h-6" strokeWidth={1.9} />
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-display font-bold text-slate-900 leading-snug">
                      {course.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                      {t.materiSummaryCount(total, done)} · {submittedCount}/
                      {courseAssignments.length}{' '}
                      {language === 'id' ? 'tugas' : 'tasks'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                </div>

                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#0F766E] rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
