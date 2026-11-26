import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronRight,
  Globe,
  GraduationCap,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  Moon,
  Pencil,
  RotateCcw,
  Shield,
  Upload,
} from 'lucide-react';
import { COURSES } from '../data/curriculum';
import { TRANSLATIONS } from '../data/translations';
import { Language, MainTab, UserProfile } from '../types/lms';

const PRESET_AVATARS: { id: string; label: string; dataUrl: string }[] = [
  {
    id: 'teal-scholar',
    label: 'Teal Scholar',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#0F766E"/><circle cx="60" cy="44" r="22" fill="#CCFBF1"/><path d="M22 108c4-22 20-34 38-34s34 12 38 34" fill="#99F6E4"/></svg>`
      ),
  },
  {
    id: 'mint-coder',
    label: 'Mint Coder',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#134E4A"/><circle cx="60" cy="46" r="20" fill="#FDE68A"/><path d="M24 110c6-24 18-34 36-34s30 10 36 34" fill="#2DD4BF"/></svg>`
      ),
  },
  {
    id: 'slate-minimal',
    label: 'Slate Minimal',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#1E293B"/><circle cx="60" cy="45" r="21" fill="#E2E8F0"/><path d="M22 108c5-22 19-33 38-33s33 11 38 33" fill="#14B8A6"/></svg>`
      ),
  },
  {
    id: 'emerald-bright',
    label: 'Emerald',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#047857"/><circle cx="60" cy="44" r="21" fill="#ECFDF5"/><path d="M22 108c5-22 19-34 38-34s33 12 38 34" fill="#6EE7B7"/></svg>`
      ),
  },
];

function resizeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read_error'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('image_error'));
      img.onload = () => {
        const size = 240;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('canvas_error'));
          return;
        }
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

interface ProfilViewProps {
  language: Language;
  darkMode: boolean;
  user: UserProfile;
  userInitials: string;
  notificationsEnabled: boolean;
  overallProgressPercent: number;
  completedChaptersCount: number;
  totalChapters: number;
  completedTasksAndQuizzesCount: number;
  onUpdateProfile: (
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
  ) => void;
  onNavigateTab: (tab: MainTab) => void;
  onOpenAssignmentsProgress: () => void;
  onToggleLanguage: () => void;
  onToggleDarkMode: () => void;
  onToggleNotifications: () => void;
  onOpenManual: () => void;
  onLogout: () => void;
  onResetProgress: () => void;
  onNotify: (msg: string) => void;
  onSubPageChange?: (isSubPage: boolean) => void;
}

export function ProfilView({
  language,
  darkMode,
  user,
  userInitials,
  notificationsEnabled,
  overallProgressPercent,
  completedChaptersCount,
  totalChapters,
  completedTasksAndQuizzesCount,
  onUpdateProfile,
  onNavigateTab,
  onOpenAssignmentsProgress,
  onToggleLanguage,
  onToggleDarkMode,
  onToggleNotifications,
  onOpenManual,
  onLogout,
  onResetProgress,
  onNotify,
  onSubPageChange,
}: ProfilViewProps) {
  const t = TRANSLATIONS[language];
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editIdentity, setEditIdentity] = useState(user.identityNumber);
  const [editProgram, setEditProgram] = useState(user.program);
  const [editPhone, setEditPhone] = useState(user.phone || '+62 812-3456-7890');
  const [editAddress, setEditAddress] = useState(
    user.address || 'Surabaya, Jawa Timur'
  );
  const [draftAvatarUrl, setDraftAvatarUrl] = useState(user.avatarDataUrl || '');

  const [infoModal, setInfoModal] = useState<'security' | 'help' | 'about' | null>(null);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');

  useEffect(() => {
    onSubPageChange?.(isEditing || infoModal !== null);
  }, [isEditing, infoModal, onSubPageChange]);

  const handleOpenEdit = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditIdentity(user.identityNumber);
    setEditProgram(user.program);
    setEditPhone(user.phone || '+62 812-3456-7890');
    setEditAddress(user.address || 'Surabaya, Jawa Timur');
    setDraftAvatarUrl(user.avatarDataUrl || '');
    setIsEditing(true);
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeImageFile(file);
      setDraftAvatarUrl(resized);
    } catch {
      onNotify(
        language === 'id'
          ? 'Gagal memproses gambar. Coba berkas lain.'
          : 'Failed to process image. Try another file.'
      );
    }
    e.target.value = '';
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editIdentity.trim() || !editEmail.trim()) return;
    onUpdateProfile({
      name: editName.trim(),
      email: editEmail.trim(),
      identityNumber: editIdentity.trim(),
      program: editProgram.trim() || 'Pendidikan Teknologi Informasi',
      phone: editPhone.trim() || '+62 812-3456-7890',
      address: editAddress.trim() || 'Surabaya, Jawa Timur',
      avatarDataUrl: draftAvatarUrl || undefined,
    });
    setIsEditing(false);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd.length < 6) {
      onNotify(
        language === 'id'
          ? 'Kata sandi baru minimal 6 karakter'
          : 'New password must be at least 6 chars'
      );
      return;
    }
    setOldPwd('');
    setNewPwd('');
    setInfoModal(null);
    onNotify(
      language === 'id' ? 'Kata sandi akun berhasil diperbarui' : 'Account password updated'
    );
  };

  // Full-Page Edit Profile (includes Live Photo Picker & Personal Information)
  if (isEditing) {
    const previewInitials = (() => {
      const parts = editName.trim().split(/\s+/).filter(Boolean);
      if (parts.length === 0) return userInitials;
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return (parts[0][0] + parts[1][0]).toUpperCase();
    })();

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer shrink-0"
            aria-label={t.backBtn}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
            {t.editProfileTitle}
          </h1>
        </div>

        <form
          onSubmit={handleSaveEdit}
          className="bg-white border border-teal-900/10 rounded-2xl p-4 sm:p-6 space-y-5 shadow-[0_2px_8px_rgba(15,118,110,0.04)]"
        >
          {/* Live Profile Photo Editor */}
          <div className="pb-5 border-b border-slate-100 space-y-3.5">
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              {t.changePhotoLabel}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative w-20 h-20 rounded-full ring-4 ring-teal-50 bg-[#0F766E] text-white flex items-center justify-center text-2xl font-display font-bold overflow-hidden shrink-0">
                {draftAvatarUrl ? (
                  <img
                    src={draftAvatarUrl}
                    alt={editName || user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{previewInitials}</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="min-h-[40px] px-3.5 rounded-xl bg-[#0F766E] hover:bg-[#147D73] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{t.uploadPhotoBtn}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadPhoto}
                    className="sr-only"
                  />
                </label>

                {draftAvatarUrl && (
                  <button
                    type="button"
                    onClick={() => setDraftAvatarUrl('')}
                    className="min-h-[40px] px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    {t.resetPhotoBtn}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-medium text-slate-500">
                {t.chooseAvatarLabel}
              </p>
              <div className="flex items-center gap-2.5 flex-wrap">
                {PRESET_AVATARS.map((preset) => {
                  const selected = draftAvatarUrl === preset.dataUrl;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setDraftAvatarUrl(preset.dataUrl)}
                      aria-label={preset.label}
                      className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-transform cursor-pointer ${
                        selected
                          ? 'border-[#0F766E] ring-2 ring-teal-200 scale-105'
                          : 'border-slate-200 hover:border-teal-400'
                      }`}
                    >
                      <img
                        src={preset.dataUrl}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Informasi Pribadi Group */}
          <div className="space-y-3.5">
            <h2 className="text-xs font-bold text-[#0F766E] uppercase tracking-wide">
              {t.personalInfoTitle}
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.fullNameLabel}
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.emailLabel}
              </label>
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.phoneLabel}
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.addressLabel}
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                />
              </div>
            </div>
          </div>

          {/* Data Akademik Group */}
          <div className="pt-2 border-t border-slate-100 space-y-3.5">
            <h2 className="text-xs font-bold text-[#0F766E] uppercase tracking-wide">
              {t.academicDataTitle}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIM
                </label>
                <input
                  type="text"
                  required
                  value={editIdentity}
                  onChange={(e) => setEditIdentity(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.studyProgramLabel}
                </label>
                <input
                  type="text"
                  value={editProgram}
                  onChange={(e) => setEditProgram(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#0F766E] hover:bg-[#147D73] text-white text-sm font-semibold cursor-pointer"
          >
            {language === 'id' ? 'Simpan Perubahan' : 'Save Changes'}
          </button>
        </form>
      </div>
    );
  }

  // Full-Page Security / Help / About
  if (infoModal) {
    const infoTitle =
      infoModal === 'security'
        ? t.accountSecurity
        : infoModal === 'help'
          ? t.helpCenterItem
          : t.aboutTechifyItem;

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setInfoModal(null)}
            className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer shrink-0"
            aria-label={t.backBtn}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
            {infoTitle}
          </h1>
        </div>

        <div className="bg-white border border-teal-900/10 rounded-2xl p-4 sm:p-6 shadow-[0_2px_8px_rgba(15,118,110,0.04)]">
          {infoModal === 'security' && (
            <form onSubmit={handleSaveSecurity} className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-100 text-xs text-teal-900 flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0" />
                <span>
                  {language === 'id'
                    ? `Email terdaftar: ${user.email}`
                    : `Registered email: ${user.email}`}
                </span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'id' ? 'Kata Sandi Saat Ini' : 'Current Password'}
                </label>
                <input
                  type="password"
                  value={oldPwd}
                  onChange={(e) => setOldPwd(e.target.value)}
                  placeholder="••••••"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'id' ? 'Kata Sandi Baru' : 'New Password'}
                </label>
                <input
                  type="password"
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder={t.passwordMinChars}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#0F766E] hover:bg-[#147D73] text-white text-sm font-semibold cursor-pointer"
              >
                {language === 'id' ? 'Perbarui Kata Sandi' : 'Update Password'}
              </button>
            </form>
          )}

          {infoModal === 'help' && (
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                {language === 'id'
                  ? 'Jika menemui kendala akses kelas atau jadwal kuliah, hubungi admin jurusan Pendidikan Teknologi Informasi atau buka forum Diskusi pada mata kuliah terkait.'
                  : 'If you encounter class access or schedule issues, contact the Information Technology Education department admin or open the course Discussion forum.'}
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <p className="font-semibold text-slate-800">
                  {language === 'id' ? 'Layanan Bantuan Akademik' : 'Academic Helpdesk'}
                </p>
                <p>Email: helpdesk@techify.ac.id</p>
                <p>
                  {language === 'id'
                    ? 'Jam Layanan: Senin–Jumat, 08.00–16.00 WIB'
                    : 'Hours: Monday–Friday, 08:00–16:00 WIB'}
                </p>
              </div>
            </div>
          )}

          {infoModal === 'about' && (
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                {language === 'id'
                  ? 'Techify adalah Learning Management System terpadu yang dirancang untuk membantu mahasiswa Pendidikan Teknologi Informasi mengelola materi kuliah, tugas, presensi kelas, video pembelajaran, kuis evaluasi, dan diskusi akademik secara terstruktur.'
                  : 'Techify is an integrated Learning Management System built to help IT Education students manage chapters, assignments, class attendance, video lessons, assessments, and academic discussions seamlessly.'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const academicRows = [
    { label: t.studyProgramLabel, value: user.program },
    { label: t.facultyLabel, value: user.faculty || 'Fakultas Teknik' },
    { label: 'NIM', value: user.identityNumber, mono: true },
    { label: t.cohortLabel, value: user.cohort || '2025', mono: true },
    {
      label: t.semesterFieldLabel,
      value: user.semesterLabel || 'Gasal 2026/2027 · Semester 3',
    },
    { label: t.advisorLabel, value: user.advisor || 'Dr. Andi Saputra, M.Kom.' },
  ];

  return (
    <div className="space-y-5">
      <h1 className="hidden lg:block text-2xl font-display font-bold text-slate-900 tracking-tight">
        {t.profilTitle}
      </h1>

      {/* Unique TECHFIY Academic Identity Card (Clean Horizontal Layout, Circular Photo, No Banner Overlap) */}
      <section className="bg-white border border-teal-900/12 rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-[0_2px_10px_rgba(15,118,110,0.05)]">
        <div
          className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-teal-50/80 dark:bg-teal-500/10 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute right-8 -bottom-14 w-28 h-28 rounded-full bg-emerald-50/70 dark:bg-emerald-500/10 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={handleOpenEdit}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-teal-50 dark:ring-teal-900/40 bg-[#0F766E] text-white flex items-center justify-center text-xl sm:text-2xl font-display font-bold shadow-xs shrink-0 overflow-hidden cursor-pointer group"
              aria-label={t.changePhotoLabel}
            >
              {user.avatarDataUrl ? (
                <img
                  src={user.avatarDataUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{userInitials}</span>
              )}
              <span className="absolute inset-x-0 bottom-0 h-5 bg-slate-900/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-3 h-3" />
              </span>
            </button>

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 leading-tight">
                  {user.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-[#0F766E] border border-teal-200/80 text-[11px] font-semibold">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{t.studentRole}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-slate-600 tabular-nums">
                NIM {user.identityNumber}
              </p>
              <p className="text-xs sm:text-sm font-medium text-[#0F766E] leading-snug">
                {user.program}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenEdit}
            className="min-h-[40px] px-4 rounded-xl border border-teal-200 bg-teal-50/60 hover:bg-teal-100/70 text-[#0F766E] text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-center shrink-0 transition-colors"
            aria-label={t.editProfileTitle}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>{t.editProfileTitle}</span>
          </button>
        </div>
      </section>

      {/* Clickable Progres Belajar Card */}
      <section className="bg-white border border-teal-900/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-[0_2px_8px_rgba(15,118,110,0.04)]">
        <button
          type="button"
          onClick={() => onNavigateTab('materi')}
          className="w-full flex items-center justify-between gap-2 text-left cursor-pointer group"
        >
          <h3 className="text-sm sm:text-base font-display font-bold text-slate-900 group-hover:text-[#0F766E] transition-colors">
            {t.learningProgressTitle}
          </h3>
          <span className="inline-flex items-center gap-1 text-sm font-mono font-bold text-[#0F766E] tabular-nums">
            <span>{overallProgressPercent}%</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0F766E] transition-colors" />
          </span>
        </button>

        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-[#0F766E] rounded-full transition-all duration-300"
            style={{ width: `${Math.max(2, overallProgressPercent)}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => onNavigateTab('kelas')}
            className="bg-[#F3F8F7] hover:bg-teal-50/90 border border-teal-100/90 hover:border-teal-300 rounded-xl p-3 text-center transition-colors cursor-pointer group"
          >
            <p className="text-lg font-display font-bold text-slate-900 tabular-nums">
              {COURSES.length}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 inline-flex items-center justify-center gap-0.5">
              <span>{t.activeClassesMetric}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-[#0F766E]" />
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('materi')}
            className="bg-[#F3F8F7] hover:bg-teal-50/90 border border-teal-100/90 hover:border-teal-300 rounded-xl p-3 text-center transition-colors cursor-pointer group"
          >
            <p className="text-lg font-display font-bold text-slate-900 tabular-nums">
              {completedChaptersCount}
              <span className="text-xs font-normal text-slate-500">/{totalChapters}</span>
            </p>
            <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 inline-flex items-center justify-center gap-0.5">
              <span>{t.completedMaterialsMetric}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-[#0F766E]" />
            </p>
          </button>

          <button
            type="button"
            onClick={onOpenAssignmentsProgress}
            className="bg-[#F3F8F7] hover:bg-teal-50/90 border border-teal-100/90 hover:border-teal-300 rounded-xl p-3 text-center transition-colors cursor-pointer group"
          >
            <p className="text-lg font-display font-bold text-slate-900 tabular-nums">
              {completedTasksAndQuizzesCount}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 inline-flex items-center justify-center gap-0.5">
              <span>{t.completedTasksMetric}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-[#0F766E]" />
            </p>
          </button>
        </div>
      </section>

      {/* Data Akademik */}
      <section className="bg-white border border-teal-900/10 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,118,110,0.04)]">
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
          <h3 className="text-sm font-display font-bold text-slate-900">
            {t.academicDataTitle}
          </h3>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.activeStatusValue}</span>
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {academicRows.map((row) => (
            <div
              key={row.label}
              className="px-4 sm:px-5 py-3 flex items-center justify-between gap-4 text-xs sm:text-sm"
            >
              <span className="text-slate-500 shrink-0">{row.label}</span>
              <span
                className={`text-right font-semibold text-slate-900 ${
                  row.mono ? 'font-mono tabular-nums' : ''
                }`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Akun & Preferensi */}
      <section className="bg-white border border-teal-900/10 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,118,110,0.04)]">
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100">
          <h3 className="text-sm font-display font-bold text-slate-900">
            {t.accountPreferencesTitle}
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          <button
            type="button"
            onClick={() => setInfoModal('security')}
            className="w-full min-h-[56px] px-4 sm:px-5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-800">{t.accountSecurity}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <button
            type="button"
            onClick={onToggleLanguage}
            className="w-full min-h-[56px] px-4 sm:px-5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-800">{t.languageLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#0F766E]">
                {language === 'id' ? 'Indonesia (ID)' : 'English (EN)'}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          </button>

          <div className="w-full min-h-[56px] px-4 sm:px-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Moon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-800">{t.darkModeLabel}</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={darkMode}
              onClick={onToggleDarkMode}
              className={`w-12 h-7 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
                darkMode ? 'bg-[#0F766E]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label={t.darkModeLabel}
            >
              <span
                className={`block w-6 h-6 rounded-full bg-white dark:bg-white shadow-xs transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="w-full min-h-[56px] px-4 sm:px-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-800">{t.notificationsLabel}</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notificationsEnabled}
              onClick={onToggleNotifications}
              className={`w-12 h-7 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
                notificationsEnabled ? 'bg-[#0F766E]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label={t.notificationsLabel}
            >
              <span
                className={`block w-6 h-6 rounded-full bg-white dark:bg-white shadow-xs transition-transform ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Bantuan & Informasi */}
      <section className="bg-white border border-teal-900/10 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,118,110,0.04)]">
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100">
          <h3 className="text-sm font-display font-bold text-slate-900">
            {t.helpInfoTitle}
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          <button
            type="button"
            onClick={onOpenManual}
            className="w-full min-h-[54px] px-4 sm:px-5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-800">{t.manualBookItem}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => setInfoModal('help')}
            className="w-full min-h-[54px] px-4 sm:px-5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-800">{t.helpCenterItem}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => setInfoModal('about')}
            className="w-full min-h-[54px] px-4 sm:px-5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-800">{t.aboutTechifyItem}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={onResetProgress}
            className="w-full min-h-[54px] px-4 sm:px-5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                {language === 'id' ? 'Reset Progres Demo' : 'Reset Demo Progress'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full min-h-[54px] px-4 sm:px-5 flex items-center justify-between gap-3 hover:bg-rose-50/70 transition-colors cursor-pointer text-left text-rose-700"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-semibold">{t.logoutItem}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </section>
    </div>
  );
}
