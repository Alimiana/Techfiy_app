import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Language } from '../types/lms';
import { TRANSLATIONS } from '../data/translations';

interface AuthScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onAuthenticated: (payload: {
    name?: string;
    email: string;
    identityType?: string;
    identityNumber?: string;
  }) => void;
  onNotify: (msg: string) => void;
}

function GoogleColorLogo() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}

export function AuthScreen({
  language,
  onToggleLanguage,
  onAuthenticated,
  onNotify,
}: AuthScreenProps) {
  const t = TRANSLATIONS[language];
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login state (empty by default so "nama@gmail.com" placeholder is clearly visible)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  // Register state
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [identityType, setIdentityType] = useState('NIM · Mahasiswa');
  const [identityNumber, setIdentityNumber] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [isLoading, setIsLoading] = useState<'submit' | 'google' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const hasMinChars = regPassword.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(regPassword);
  const hasNumber = /\d/.test(regPassword);
  const doPasswordsMatch =
    regPassword.length > 0 && confirmPassword.length > 0 && regPassword === confirmPassword;

  const isSimpleValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!isSimpleValidEmail(loginEmail)) {
      setErrorMsg(
        language === 'id'
          ? 'Masukkan alamat email yang valid (contoh: nama@gmail.com).'
          : 'Please enter a valid email address (e.g. nama@gmail.com).'
      );
      return;
    }
    if (loginPassword.length < 6) {
      setErrorMsg(
        language === 'id' ? 'Kata sandi minimal 6 karakter.' : 'Password must be at least 6 characters.'
      );
      return;
    }
    setIsLoading('submit');
    setTimeout(() => {
      setIsLoading(null);
      onNotify(language === 'id' ? 'Berhasil masuk ke Techify' : 'Signed in to Techify');
      onAuthenticated({ email: loginEmail.trim() });
    }, 550);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (fullName.trim().length < 2) {
      setErrorMsg(
        language === 'id' ? 'Nama lengkap wajib diisi.' : 'Full name is required.'
      );
      return;
    }
    if (!isSimpleValidEmail(regEmail)) {
      setErrorMsg(
        language === 'id'
          ? 'Masukkan alamat email yang valid (contoh: nama@gmail.com).'
          : 'Please enter a valid email address (e.g. nama@gmail.com).'
      );
      return;
    }
    if (identityNumber.trim().length < 4) {
      setErrorMsg(
        language === 'id' ? 'Nomor identitas minimal 4 digit.' : 'Identity number must be at least 4 characters.'
      );
      return;
    }
    if (!hasMinChars) {
      setErrorMsg(
        language === 'id' ? 'Kata sandi minimal 6 karakter.' : 'Password must be at least 6 characters.'
      );
      return;
    }
    if (!doPasswordsMatch) {
      setErrorMsg(
        language === 'id' ? 'Konfirmasi kata sandi tidak cocok.' : 'Confirm password does not match.'
      );
      return;
    }
    if (!agreedTerms) {
      setErrorMsg(
        language === 'id'
          ? 'Setujui Syarat & Ketentuan serta Kebijakan Privasi untuk melanjutkan.'
          : 'Please agree to the Terms & Conditions and Privacy Policy to continue.'
      );
      return;
    }
    setIsLoading('submit');
    setTimeout(() => {
      setIsLoading(null);
      onNotify(
        language === 'id' ? 'Akun berhasil dibuat. Selamat belajar!' : 'Account created. Welcome to Techify!'
      );
      onAuthenticated({
        name: fullName.trim(),
        email: regEmail.trim(),
        identityType,
        identityNumber: identityNumber.trim(),
      });
    }, 600);
  };

  const handleGoogleContinue = () => {
    setErrorMsg(null);
    setIsLoading('google');
    setTimeout(() => {
      setIsLoading(null);
      onNotify(
        language === 'id' ? 'Masuk dengan akun Google berhasil' : 'Signed in with Google account'
      );
      onAuthenticated({
        name: 'Alimiana',
        email: 'alimiana@gmail.com',
        identityType: 'NIM · Mahasiswa',
        identityNumber: '25050974149',
      });
    }, 550);
  };

  return (
    <div className="min-h-screen bg-[#F4FAF9] flex flex-col">
      {/* Colored Header Band matching reference layout in Techify Teal */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0F766E] to-[#147D73] text-white pt-4 pb-14 sm:pt-5 sm:pb-16">
        {/* Subtle decorative circles inspired by reference */}
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-12 w-64 h-64 rounded-full border border-white/10 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-8 right-6 w-40 h-40 rounded-full bg-white/5 pointer-events-none"
        />

        <div className="relative max-w-xl mx-auto px-4 sm:px-6 space-y-5">
          {/* Top Brand + Language Toggle */}
          <div className="flex items-center justify-between gap-4">
            <BrandLogo size="md" variant="inverted" />

            <button
              type="button"
              onClick={onToggleLanguage}
              className="min-h-[40px] px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              aria-label="Toggle Language"
            >
              <Globe className="w-4 h-4" />
              <span>{language.toUpperCase()}</span>
            </button>
          </div>

          {/* Title & Subtitle (no LMS kicker) */}
          <div className="space-y-1.5 pb-1">
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white text-balance">
              {t.authTitle}
            </h1>
            <p className="text-sm text-teal-50/90 leading-relaxed max-w-lg">
              {t.authSubtitle}
            </p>
          </div>
        </div>
      </header>

      {/* Curved Top Background Sheet overlapping the teal header */}
      <div className="flex-1 bg-[#F4FAF9] rounded-t-[32px] -mt-7 pt-5 pb-10 relative z-10">
        <main className="w-full max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm">
          {/* Segmented Tabs */}
          <div
            role="tablist"
            className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`min-h-[42px] rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.loginTab}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`min-h-[42px] rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.registerTab}
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full h-12 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showLoginPwd ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full h-12 pl-10 pr-11 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPwd((v) => !v)}
                    className="w-10 h-10 flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 cursor-pointer"
                    aria-label={showLoginPwd ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showLoginPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading !== null}
                className="w-full h-12 rounded-xl bg-[#0F766E] hover:bg-[#147D73] active:scale-[0.99] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {isLoading === 'submit' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{t.loginAction}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium text-slate-400">{t.orDivider}</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleContinue}
                disabled={isLoading !== null}
                className="w-full h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 text-sm font-semibold inline-flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-60 shadow-2xs"
              >
                {isLoading === 'google' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#0F766E]" />
                ) : (
                  <GoogleColorLogo />
                )}
                <span>{t.continueGoogle}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.fullNameLabel}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    className="w-full h-12 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full h-12 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.identityTypeLabel}
                  </label>
                  <select
                    value={identityType}
                    onChange={(e) => setIdentityType(e.target.value)}
                    className="w-full h-12 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                  >
                    <option value="NIM · Mahasiswa">NIM · Mahasiswa</option>
                    <option value="NISN · Pelajar">NISN · Pelajar</option>
                    <option value="NIDN · Dosen">NIDN · Dosen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.identityNumberLabel}
                  </label>
                  <input
                    type="text"
                    value={identityNumber}
                    onChange={(e) => setIdentityNumber(e.target.value)}
                    placeholder={t.identityNumberPlaceholder}
                    className="w-full h-12 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-mono tabular-nums placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showRegPwd ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full h-12 pl-10 pr-11 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPwd((v) => !v)}
                    className="w-10 h-10 flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 cursor-pointer"
                    aria-label={showRegPwd ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showRegPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showConfirmPwd ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t.confirmPasswordPlaceholder}
                    className={`w-full h-12 pl-10 pr-11 rounded-xl border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      confirmPassword.length > 0 && !doPasswordsMatch
                        ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500'
                        : 'border-slate-200 focus:ring-[#0F766E]/20 focus:border-[#0F766E]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd((v) => !v)}
                    className="w-10 h-10 flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 cursor-pointer"
                    aria-label={showConfirmPwd ? 'Sembunyikan konfirmasi' : 'Tampilkan konfirmasi'}
                  >
                    {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Validation Indicators */}
              {(regPassword.length > 0 || confirmPassword.length > 0) && (
                <div className="space-y-1.5 pt-0.5 text-xs">
                  {confirmPassword.length > 0 && (
                    <div
                      className={`flex items-center gap-1.5 font-medium ${
                        doPasswordsMatch ? 'text-teal-700' : 'text-rose-600'
                      }`}
                    >
                      {doPasswordsMatch ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>{doPasswordsMatch ? t.passwordMatchOk : t.passwordMatchFail}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                    <span className={hasMinChars ? 'text-[#0F766E] font-medium' : 'text-slate-400'}>
                      • {t.passwordMinChars}
                    </span>
                    <span className={hasLetter ? 'text-[#0F766E] font-medium' : 'text-slate-400'}>
                      • {language === 'id' ? 'Huruf' : 'Letters'}
                    </span>
                    <span className={hasNumber ? 'text-[#0F766E] font-medium' : 'text-slate-400'}>
                      • {language === 'id' ? 'Angka' : 'Numbers'}
                    </span>
                  </div>
                </div>
              )}

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E]"
                />
                <span className="leading-relaxed">
                  {t.agreeTermsPrefix}{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setLegalModal('terms');
                    }}
                    className="font-semibold text-[#0F766E] underline cursor-pointer"
                  >
                    {t.termsLink}
                  </button>{' '}
                  {t.andText}{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setLegalModal('privacy');
                    }}
                    className="font-semibold text-[#0F766E] underline cursor-pointer"
                  >
                    {t.privacyLink}
                  </button>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading !== null}
                className="w-full h-12 rounded-xl bg-[#0F766E] hover:bg-[#147D73] active:scale-[0.99] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {isLoading === 'submit' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{t.registerAction}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 py-0.5">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium text-slate-400">{t.orDivider}</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleContinue}
                disabled={isLoading !== null}
                className="w-full h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 text-sm font-semibold inline-flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-60 shadow-2xs"
              >
                {isLoading === 'google' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#0F766E]" />
                ) : (
                  <GoogleColorLogo />
                )}
                <span>{t.continueGoogle}</span>
              </button>
            </form>
          )}
        </div>

        {/* Outside the card box: "Sudah punya akun? Masuk" / "Belum punya akun? Daftar" */}
        <p className="text-center text-sm text-slate-600 mt-5">
          {mode === 'login' ? t.noAccountPrompt : t.hasAccountPrompt}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setErrorMsg(null);
            }}
            className="font-bold text-[#0F766E] hover:underline cursor-pointer"
          >
            {mode === 'login' ? t.registerTab : t.loginTab}
          </button>
        </p>
        </main>
      </div>

      {/* Legal Info Modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-bold text-slate-900">
                {legalModal === 'terms' ? t.termsLink : t.privacyLink}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-slate-600 space-y-2.5 leading-relaxed">
              {legalModal === 'terms' ? (
                <>
                  <p>
                    {language === 'id'
                      ? 'Akun Techify digunakan untuk aktivitas pembelajaran teknologi informasi, pengerjaan kuis evaluasi, akses modul belajar, serta diskusi kelas yang santun.'
                      : 'Your Techify account is designed for IT learning activities, assessments, module study, and respectful class discussions.'}
                  </p>
                  <p>
                    {language === 'id'
                      ? 'Pelajar, mahasiswa, dan dosen bertanggung jawab menjaga kerahasiaan kata sandi serta integritas akademik saat menyelesaikan Pretest dan Posttest.'
                      : 'Students and lecturers are responsible for safeguarding credentials and maintaining academic integrity during Pretests and Posttests.'}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    {language === 'id'
                      ? 'Techify menyimpan identitas akun, progres modul, poin XP, dan preferensi bahasa secara aman di penyimpanan lokal browser Anda.'
                      : 'Techify stores your account identity, module progress, XP points, and language preferences securely in your local browser storage.'}
                  </p>
                  <p>
                    {language === 'id'
                      ? 'Data tidak dibagikan kepada pihak ketiga di luar kebutuhan pembelajaran.'
                      : 'Your data is never shared with third parties outside learning needs.'}
                  </p>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setLegalModal(null)}
              className="w-full h-10 rounded-xl bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#147D73] cursor-pointer"
            >
              {language === 'id' ? 'Tutup' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
