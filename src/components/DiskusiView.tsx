import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpDown,
  Eye,
  MessageSquare,
  Plus,
  Search,
  Send,
} from 'lucide-react';
import { COURSES } from '../data/curriculum';
import { TRANSLATIONS } from '../data/translations';
import { DiscussionThread, Language, UserRole } from '../types/lms';

interface DiskusiViewProps {
  language: Language;
  threads: DiscussionThread[];
  userRole: UserRole;
  currentUserName: string;
  currentUserAvatarUrl?: string;
  openNewTopicSignal?: boolean;
  onConsumeNewTopicSignal?: () => void;
  deepLinkCourseId?: string | null;
  deepLinkThreadId?: string | null;
  onConsumeDeepLink?: () => void;
  onAddThread: (payload: {
    courseId: string;
    chapterLabel: string;
    title: string;
    body: string;
  }) => string;
  onAddReply: (threadId: string, body: string) => void;
  onViewThread: (threadId: string) => void;
  onSubPageChange?: (isSubPage: boolean) => void;
}

type SortOrder = 'newest' | 'oldest' | 'popular';

export function DiskusiView({
  language,
  threads,
  userRole,
  currentUserName,
  currentUserAvatarUrl,
  openNewTopicSignal,
  onConsumeNewTopicSignal,
  deepLinkCourseId,
  deepLinkThreadId,
  onConsumeDeepLink,
  onAddThread,
  onAddReply,
  onViewThread,
  onSubPageChange,
}: DiskusiViewProps) {
  const t = TRANSLATIONS[language];
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // New Topic modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newCourseId, setNewCourseId] = useState(COURSES[0].id);
  const [newChapterLabel, setNewChapterLabel] = useState('Bab 1 · Konsep Dasar');
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  React.useEffect(() => {
    if (openNewTopicSignal) {
      setIsNewModalOpen(true);
      onConsumeNewTopicSignal?.();
    }
  }, [openNewTopicSignal, onConsumeNewTopicSignal]);

  React.useEffect(() => {
    if (!deepLinkCourseId && !deepLinkThreadId) return;
    if (deepLinkCourseId) {
      setSelectedCourseFilter(deepLinkCourseId);
    }
    if (deepLinkThreadId) {
      setActiveThreadId(deepLinkThreadId);
    }
    onConsumeDeepLink?.();
  }, [deepLinkCourseId, deepLinkThreadId, onConsumeDeepLink]);

  const cycleSort = () => {
    setSortOrder((prev) =>
      prev === 'newest' ? 'oldest' : prev === 'oldest' ? 'popular' : 'newest'
    );
  };

  const sortLabel =
    sortOrder === 'newest'
      ? t.sortNewest
      : sortOrder === 'oldest'
        ? t.sortOldest
        : t.sortPopular;

  const filteredThreads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = threads.filter((item) => {
      const matchesCourse =
        selectedCourseFilter === 'all' || item.courseId === selectedCourseFilter;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.body.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q) ||
        item.authorName.toLowerCase().includes(q);
      return matchesCourse && matchesQuery;
    });

    return [...list].sort((a, b) => {
      if (sortOrder === 'newest') return b.timestampMs - a.timestampMs;
      if (sortOrder === 'oldest') return a.timestampMs - b.timestampMs;
      return b.replies.length + b.views - (a.replies.length + a.views);
    });
  }, [threads, searchQuery, selectedCourseFilter, sortOrder]);

  const activeThread = threads.find((th) => th.id === activeThreadId) || null;
  const activeReplyCount = activeThread?.replies.length ?? 0;

  React.useEffect(() => {
    onSubPageChange?.(Boolean(activeThread) || isNewModalOpen);
  }, [activeThread, isNewModalOpen, onSubPageChange]);

  React.useEffect(() => {
    if (activeThread) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [activeThread, activeReplyCount]);

  const handleOpenThread = (thread: DiscussionThread) => {
    setActiveThreadId(thread.id);
    onViewThread(thread.id);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !replyText.trim()) return;
    onAddReply(activeThread.id, replyText);
    setReplyText('');
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    const createdId = onAddThread({
      courseId: newCourseId,
      chapterLabel: newChapterLabel,
      title: newTitle,
      body: newBody,
    });
    setNewTitle('');
    setNewBody('');
    setIsNewModalOpen(false);
    setActiveThreadId(createdId);
  };

  // Full-Page New Topic Form
  if (isNewModalOpen) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsNewModalOpen(false)}
            className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer shrink-0"
            aria-label={t.backBtn}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
              {t.newTopicBtn}
            </h1>
            {userRole === 'dosen' && (
              <span className="px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200 text-[#0F766E] text-[10px] font-bold">
                DOSEN
              </span>
            )}
          </div>
        </div>

        <form
          onSubmit={handleCreateTopic}
          className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'id' ? 'Mata Kuliah' : 'Course'}
            </label>
            <select
              value={newCourseId}
              onChange={(e) => setNewCourseId(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            >
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'id' ? 'Topik / Bab' : 'Chapter / Topic'}
            </label>
            <input
              type="text"
              value={newChapterLabel}
              onChange={(e) => setNewChapterLabel(e.target.value)}
              placeholder="Contoh: Bab 2 · Konstruktor"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'id' ? 'Judul Diskusi' : 'Discussion Title'}
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={
                language === 'id'
                  ? 'Tulis pertanyaan atau topik diskusi yang jelas'
                  : 'Write a clear question or topic title'
              }
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'id' ? 'Isi Diskusi' : 'Details'}
            </label>
            <textarea
              required
              rows={5}
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder={
                language === 'id'
                  ? 'Jelaskan konteks, kendala, atau pendapat Anda...'
                  : 'Describe context, challenge, or thoughts...'
              }
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#0F766E] hover:bg-[#147D73] text-white text-sm font-semibold cursor-pointer"
          >
            {t.publishTopicBtn}
          </button>
        </form>
      </div>
    );
  }

  // Full-Page WhatsApp-Style Group Chat View
  if (activeThread) {
    const participantNames = new Set<string>([
      activeThread.authorName,
      ...activeThread.replies.map((r) => r.authorName),
    ]);
    const participantsCount = participantNames.size;

    const chatMessages = [
      {
        id: `${activeThread.id}-root`,
        authorName: activeThread.authorName,
        authorInitials: activeThread.authorInitials,
        authorRole: activeThread.authorRole,
        body: activeThread.body,
        createdAt: activeThread.createdAt,
      },
      ...activeThread.replies,
    ];

    return (
      <div className="flex flex-col min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-6rem)] space-y-3">
        {/* Chat Group Header */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 flex items-center gap-3 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveThreadId(null)}
            className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer shrink-0"
            aria-label={t.backBtn}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-semibold text-[#0F766E] leading-snug">
              {activeThread.courseTitle} · {activeThread.chapterLabel}
            </p>
            <h1 className="text-base sm:text-lg font-display font-bold text-slate-900 tracking-tight leading-snug mt-0.5">
              {activeThread.title}
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
              {participantsCount} {t.participantsLabel} · {activeThread.replies.length}{' '}
              {t.repliesLabel}
            </p>
          </div>
        </div>

        {/* Group Chat Bubble Canvas */}
        <div className="flex-1 bg-[#EFF6F5] dark:bg-[#0D1719] border border-teal-900/10 dark:border-[#1E2E33] rounded-2xl p-3.5 sm:p-4 space-y-3 overflow-y-auto max-h-[62vh] min-h-[340px]">
          {chatMessages.map((msg) => {
            const isMe =
              msg.authorName.trim().toLowerCase() === currentUserName.trim().toLowerCase();

            if (isMe) {
              return (
                <div key={msg.id} className="flex items-end justify-end gap-2">
                  <div className="max-w-[85%] sm:max-w-[75%] bg-[#D9F2EE] dark:bg-[#113B37] border border-[#0F766E]/15 dark:border-teal-500/25 text-slate-900 dark:text-slate-100 rounded-2xl rounded-br-xs px-3.5 py-2.5 shadow-2xs space-y-1">
                    <div className="flex items-center justify-end gap-1.5">
                      {msg.authorRole === 'dosen' && (
                        <span className="px-1.5 py-0.5 rounded bg-[#0F766E] text-white text-[9px] font-bold tracking-wide">
                          DOSEN
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-[#0F766E] dark:text-teal-300">
                        {t.youLabel}
                      </span>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                      {msg.body}
                    </p>
                    <p className="text-[10px] text-teal-800/70 dark:text-teal-200/70 text-right tabular-nums">
                      {msg.createdAt}
                    </p>
                  </div>
                  {currentUserAvatarUrl ? (
                    <img
                      src={currentUserAvatarUrl}
                      alt={currentUserName}
                      className="w-7 h-7 rounded-full object-cover border border-teal-200 dark:border-teal-700 shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {msg.authorInitials}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex items-end justify-start gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    msg.authorRole === 'dosen'
                      ? 'bg-[#0F766E] text-white'
                      : 'bg-white dark:bg-[#162327] border border-slate-200 dark:border-[#25373D] text-[#0F766E] dark:text-teal-300'
                  }`}
                >
                  {msg.authorInitials}
                </div>
                <div className="max-w-[82%] sm:max-w-[74%] bg-white dark:bg-[#152226] border border-slate-200/90 dark:border-[#24353A] text-slate-900 dark:text-slate-100 rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-2xs space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#0F766E]">
                      {msg.authorName}
                    </span>
                    {msg.authorRole === 'dosen' && (
                      <span className="px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200 text-[#0F766E] text-[9px] font-bold tracking-wide">
                        DOSEN
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {msg.body}
                  </p>
                  <p className="text-[10px] text-slate-400 text-right tabular-nums">
                    {msg.createdAt}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Chat Input Composer */}
        <form
          onSubmit={handleSubmitReply}
          className="bg-white border border-slate-200 rounded-2xl p-2.5 flex items-center gap-2 shadow-xs"
        >
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={
              userRole === 'dosen'
                ? language === 'id'
                  ? 'Ketik balasan sebagai Dosen...'
                  : 'Type a reply as Lecturer...'
                : language === 'id'
                  ? 'Ketik pesan diskusi...'
                  : 'Type a message...'
            }
            className="flex-1 h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            aria-label={language === 'id' ? 'Kirim' : 'Send'}
            className="h-11 px-3.5 sm:px-4 rounded-xl bg-[#0F766E] hover:bg-[#147D73] text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'id' ? 'Kirim' : 'Send'}</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="hidden lg:block text-2xl font-display font-bold text-slate-900 tracking-tight">
            {t.diskusiTitle}
          </h1>
          <span className="text-xs font-mono font-semibold text-[#0F766E] tabular-nums">
            {filteredThreads.length}{' '}
            <span className="font-sans font-medium text-slate-500">
              {language === 'id' ? 'topik' : 'topics'}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cycleSort}
            className="min-h-[40px] px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{sortLabel.replace('↑↓ ', '')}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="min-h-[40px] px-3.5 rounded-xl bg-[#0F766E] hover:bg-[#147D73] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            aria-label={t.newTopicBtn}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t.newTopicBtn}</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchDiskusiPlaceholder}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
        />
      </div>

      {/* Filter Chips */}
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

      {/* Thread List */}
      {filteredThreads.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
          <MessageSquare className="w-7 h-7 text-slate-400 mx-auto" />
          <p className="text-sm font-medium text-slate-700">
            {language === 'id'
              ? 'Belum ada diskusi yang cocok dengan pencarian.'
              : 'No discussions match your filter.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-xl divide-y divide-slate-100 overflow-hidden shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
          {filteredThreads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => handleOpenThread(thread)}
              className="w-full text-left p-4 sm:p-5 hover:bg-[#F4FAF9]/60 transition-colors cursor-pointer space-y-3 block"
            >
              <div className="flex items-start justify-between gap-2 text-xs text-slate-500">
                <span className="font-medium text-[#0F766E] leading-snug">
                  {thread.courseTitle} · {thread.chapterLabel}
                </span>
                <span className="shrink-0 tabular-nums">{thread.createdAt}</span>
              </div>

              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-display font-bold text-slate-900 leading-snug">
                  {thread.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {thread.body}
                </p>
              </div>

              <div className="pt-1 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      thread.authorRole === 'dosen'
                        ? 'bg-[#0F766E] text-white'
                        : 'bg-teal-50 text-[#0F766E]'
                    }`}
                  >
                    {thread.authorInitials}
                  </div>
                  <span className="text-xs font-medium text-slate-800">
                    {thread.authorName}
                  </span>
                  {thread.authorRole === 'dosen' && (
                    <span className="px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200 text-[#0F766E] text-[10px] font-bold tracking-wide shrink-0">
                      DOSEN
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0 tabular-nums">
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {thread.replies.length} {t.repliesLabel}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {thread.views}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
