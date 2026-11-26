import { Language } from '../types/lms';

export const TRANSLATIONS: Record<
  Language,
  {
    brand: string;
    authTitle: string;
    authSubtitle: string;
    loginTab: string;
    registerTab: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    identityTypeLabel: string;
    identityNumberLabel: string;
    identityNumberPlaceholder: string;
    loginAction: string;
    registerAction: string;
    orDivider: string;
    continueGoogle: string;
    noAccountPrompt: string;
    hasAccountPrompt: string;
    agreeTermsPrefix: string;
    termsLink: string;
    andText: string;
    privacyLink: string;
    passwordMatchOk: string;
    passwordMatchFail: string;
    passwordMinChars: string;
    navDashboard: string;
    navKelas: string;
    navMateri: string;
    navDiskusi: string;
    navProfil: string;
    greetingPrefix: string;
    greetingSubtitle: string;
    levelLabel: string;
    xpToNext: (remaining: number, nextLevel: number) => string;
    dailyTargetsTitle: string;
    dailyTargetsCount: (done: number, total: number) => string;
    dailyTargetsHint: string;
    xpModalTitle: string;
    checkInTitle: string;
    checkInSubtitle: string;
    claimTodayXpBtn: string;
    claimedTodayXpBtn: string;
    dayLabel: (day: number) => string;
    levelRulesTitle: string;
    xpSourcesTitle: string;
    menuPretest: string;
    menuPretestSub: string;
    menuMateri: string;
    menuMateriSub: string;
    menuVideo: string;
    menuVideoSub: string;
    menuPosttest: string;
    menuPosttestSub: string;
    menuJadwal: string;
    menuJadwalSub: string;
    menuManual: string;
    menuManualSub: string;
    historyTitle: string;
    historyEmpty: string;
    viewAllHistory: string;
    allHistoryTitle: string;
    generalActivityGroup: string;
    activitiesCountLabel: (count: number) => string;
    classesTitle: string;
    classesSubtitle: string;
    viewScheduleBtn: string;
    scheduleTitle: string;
    scheduleSubtitle: string;
    backBtn: string;
    todayHighlightTitle: string;
    allClassesDoneTitle: string;
    allClassesDoneDesc: string;
    ongoingClassTitle: string;
    upcomingClassTitle: string;
    todayBadge: string;
    classesCountLabel: (count: number) => string;
    statusCompleted: string;
    statusOngoing: string;
    statusScheduled: string;
    attendanceLabel: string;
    presentLabel: string;
    sickLabel: string;
    permitLabel: string;
    absentLabel: string;
    presentRatioLabel: (pct: number, present: number, total: number) => string;
    qrAttendanceBtn: string;
    attendanceHistoryBtn: string;
    qrPageTitle: string;
    qrPageSubtitle: string;
    qrCameraHint: string;
    qrEnableCameraBtn: string;
    qrRetryCameraBtn: string;
    qrCameraActiveLabel: string;
    qrCameraRequestingLabel: string;
    qrCameraFallbackLabel: string;
    qrCameraDeniedNote: string;
    qrCameraUnavailableNote: string;
    qrConfirmBtn: string;
    qrAlreadyCheckedBtn: string;
    qrManualCodePlaceholder: string;
    attendanceHistoryTitle: string;
    noClassesOnDay: string;
    dayNames: Record<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat', string>;
    materiTitle: string;
    materiSubtitle: string;
    materiSummaryCount: (total: number, done: number) => string;
    chaptersTabLabel: string;
    assignmentsTabLabel: string;
    assignmentBtn: string;
    assignmentsTitle: string;
    assignmentNotSubmitted: string;
    assignmentSubmitted: string;
    assignmentDeadlineLabel: string;
    assignmentInstructionsLabel: string;
    assignmentAnswerLabel: string;
    assignmentAnswerPlaceholder: string;
    assignmentLinkLabel: string;
    assignmentLinkPlaceholder: string;
    assignmentFileLabel: string;
    assignmentFileEmpty: string;
    submitAssignmentBtn: string;
    updateAssignmentBtn: string;
    noAssignmentsLabel: string;
    markDone: string;
    completedLabel: string;
    readStatusLabel: string;
    downloadMaterialBtn: string;
    redownloadMaterialBtn: string;
    downloadedBadge: string;
    videoPageSubtitle: string;
    watchOnYoutube: string;
    watchedLabel: string;
    diskusiTitle: string;
    searchDiskusiPlaceholder: string;
    filterAll: string;
    sortNewest: string;
    sortOldest: string;
    sortPopular: string;
    newTopicBtn: string;
    publishTopicBtn: string;
    participantsLabel: string;
    youLabel: string;
    repliesLabel: string;
    viewsLabel: string;
    profilTitle: string;
    editProfileTitle: string;
    changePhotoLabel: string;
    uploadPhotoBtn: string;
    resetPhotoBtn: string;
    chooseAvatarLabel: string;
    learningProgressTitle: string;
    activeClassesMetric: string;
    completedMaterialsMetric: string;
    completedTasksMetric: string;
    academicDataTitle: string;
    personalInfoTitle: string;
    studyProgramLabel: string;
    facultyLabel: string;
    cohortLabel: string;
    semesterFieldLabel: string;
    advisorLabel: string;
    academicStatusLabel: string;
    activeStatusValue: string;
    phoneLabel: string;
    addressLabel: string;
    accountPreferencesTitle: string;
    accountSecurity: string;
    languageLabel: string;
    darkModeLabel: string;
    notificationsLabel: string;
    helpInfoTitle: string;
    manualBookItem: string;
    helpCenterItem: string;
    aboutTechifyItem: string;
    logoutItem: string;
    notificationsTitle: string;
    markAllRead: string;
    studentRole: string;
    lecturerRole: string;
  }
> = {
  id: {
    brand: 'Techify',
    authTitle: 'Kuasai materi IT',
    authSubtitle: 'Belajar lebih terarah. Progres dan kuis tersimpan otomatis.',
    loginTab: 'Masuk',
    registerTab: 'Daftar',
    emailLabel: 'Email',
    emailPlaceholder: 'nama@gmail.com',
    passwordLabel: 'Kata sandi',
    passwordPlaceholder: 'Masukkan kata sandi',
    confirmPasswordLabel: 'Konfirmasi kata sandi',
    confirmPasswordPlaceholder: 'Ulangi kata sandi',
    fullNameLabel: 'Nama lengkap',
    fullNamePlaceholder: 'Nama kamu',
    identityTypeLabel: 'Jenis identitas',
    identityNumberLabel: 'Nomor identitas',
    identityNumberPlaceholder: 'Contoh: 25050974149',
    loginAction: 'Masuk',
    registerAction: 'Buat Akun',
    orDivider: 'atau',
    continueGoogle: 'Lanjutkan dengan Google',
    noAccountPrompt: 'Belum punya akun?',
    hasAccountPrompt: 'Sudah punya akun?',
    agreeTermsPrefix: 'Saya menyetujui',
    termsLink: 'Syarat & Ketentuan',
    andText: 'dan',
    privacyLink: 'Kebijakan Privasi',
    passwordMatchOk: 'Kata sandi cocok dan memenuhi syarat',
    passwordMatchFail: 'Password tidak sama',
    passwordMinChars: 'Minimal 6 karakter',
    navDashboard: 'Dashboard',
    navKelas: 'Kelas',
    navMateri: 'Materi',
    navDiskusi: 'Diskusi',
    navProfil: 'Profil',
    greetingPrefix: 'Halo,',
    greetingSubtitle: 'Selamat datang, mau belajar apa hari ini?',
    levelLabel: 'Level',
    xpToNext: (remaining, nextLevel) => `${remaining} XP lagi ke level ${nextLevel}`,
    dailyTargetsTitle: 'Target Harian',
    dailyTargetsCount: (done, total) => `${done}/${total} target selesai`,
    dailyTargetsHint: 'Ketuk untuk lihat target harian',
    xpModalTitle: 'Detail XP & Level',
    checkInTitle: 'Check-in XP Harian',
    checkInSubtitle: 'Klaim bonus XP beruntun setiap hari selama 7 hari',
    claimTodayXpBtn: 'Klaim XP Hari Ini',
    claimedTodayXpBtn: 'Sudah Diklaim Hari Ini',
    dayLabel: (day) => `Hari ${day}`,
    levelRulesTitle: 'Ketentuan Naik Level',
    xpSourcesTitle: 'Sumber Poin XP Belajar',
    menuPretest: 'Pretest',
    menuPretestSub: 'Uji Awal Pemahaman',
    menuMateri: 'Materi',
    menuMateriSub: 'Modul Ajar',
    menuVideo: 'Video Belajar',
    menuVideoSub: 'Tonton Materi Visual',
    menuPosttest: 'Posttest',
    menuPosttestSub: 'Uji Akhir Pemahaman',
    menuJadwal: 'Jadwal Pelajaran',
    menuJadwalSub: 'Jadwal Kelas',
    menuManual: 'Manual Book',
    menuManualSub: 'Panduan Penggunaan',
    historyTitle: 'Riwayat',
    historyEmpty: 'Belum ada aktivitas hari ini.',
    viewAllHistory: 'Lihat Semua',
    allHistoryTitle: 'Semua Riwayat Aktivitas',
    generalActivityGroup: 'Aktivitas Umum',
    activitiesCountLabel: (count) => `${count} aktivitas`,
    classesTitle: 'Kelas',
    classesSubtitle: 'Jadwal kuliah dan rekap kehadiran semester aktif',
    viewScheduleBtn: 'Jadwal Pelajaran',
    scheduleTitle: 'Jadwal Pelajaran',
    scheduleSubtitle: 'Ketuk jadwal untuk melihat detail kelas dan tautan materi',
    backBtn: 'Kembali',
    todayHighlightTitle: 'Sorotan hari ini',
    allClassesDoneTitle: 'Semua Kelas Selesai',
    allClassesDoneDesc: 'Tidak ada jadwal tersisa untuk hari ini.',
    ongoingClassTitle: 'Kelas Sedang Berlangsung',
    upcomingClassTitle: 'Kelas Berikutnya Hari Ini',
    todayBadge: 'Hari ini',
    classesCountLabel: (count) => `${count} kelas`,
    statusCompleted: 'Selesai',
    statusOngoing: 'Berlangsung',
    statusScheduled: 'Terjadwal',
    attendanceLabel: 'Kehadiran',
    presentLabel: 'Hadir',
    sickLabel: 'Sakit',
    permitLabel: 'Izin',
    absentLabel: 'Alpha',
    presentRatioLabel: (pct, present, total) => `Hadir ${pct}% (${present}/${total})`,
    qrAttendanceBtn: 'Presensi QR',
    attendanceHistoryBtn: 'Riwayat',
    qrPageTitle: 'Pemindai QR Presensi',
    qrPageSubtitle: 'Arahkan kamera ke kode QR yang ditampilkan dosen di kelas untuk mencatat kehadiran hari ini',
    qrCameraHint: 'Posisikan kode QR dosen di dalam kotak bingkai',
    qrEnableCameraBtn: 'Aktifkan Kamera',
    qrRetryCameraBtn: 'Coba Kamera Lagi',
    qrCameraActiveLabel: 'Kamera Aktif · Siap Memindai',
    qrCameraRequestingLabel: 'Mengakses kamera...',
    qrCameraFallbackLabel: 'Mode Simulasi Pemindai QR',
    qrCameraDeniedNote: 'Izin kamera ditolak atau diblokir oleh browser/sandbox preview. Anda tetap dapat menggunakan tombol konfirmasi di bawah untuk simulasi presensi.',
    qrCameraUnavailableNote: 'Kamera perangkat tidak terdeteksi di lingkungan ini. Mode simulasi scan aktif agar presensi tetap dapat diuji.',
    qrConfirmBtn: 'Pindai & Konfirmasi Hadir',
    qrAlreadyCheckedBtn: 'Presensi Hari Ini Tercatat',
    qrManualCodePlaceholder: 'Atau masukkan kode sesi dari dosen (opsional)',
    attendanceHistoryTitle: 'Riwayat Kehadiran',
    noClassesOnDay: 'Tidak ada kelas terjadwal pada hari ini.',
    dayNames: {
      Senin: 'Senin',
      Selasa: 'Selasa',
      Rabu: 'Rabu',
      Kamis: 'Kamis',
      Jumat: 'Jumat',
    },
    materiTitle: 'Materi',
    materiSubtitle: 'Pilih mata pelajaran untuk melihat modul bab dan tugas',
    materiSummaryCount: (total, done) => `${total} materi, ${done} selesai`,
    chaptersTabLabel: 'Modul Bab',
    assignmentsTabLabel: 'Tugas',
    assignmentBtn: 'Tugas',
    assignmentsTitle: 'Tugas Mata Kuliah',
    assignmentNotSubmitted: 'Belum Dikumpulkan',
    assignmentSubmitted: 'Terkumpul',
    assignmentDeadlineLabel: 'Tenggat waktu',
    assignmentInstructionsLabel: 'Detail Instruksi Tugas',
    assignmentAnswerLabel: 'Jawaban / Catatan Pengumpulan',
    assignmentAnswerPlaceholder: 'Tulis ringkasan jawaban, hasil pengerjaan, atau catatan untuk dosen...',
    assignmentLinkLabel: 'Tautan Tugas (Opsional)',
    assignmentLinkPlaceholder: 'https://drive.google.com/... atau https://github.com/...',
    assignmentFileLabel: 'Lampiran Berkas (Opsional)',
    assignmentFileEmpty: 'Belum ada berkas dipilih (PDF, ZIP, DOCX, atau gambar)',
    submitAssignmentBtn: 'Kirim Tugas',
    updateAssignmentBtn: 'Perbarui Pengumpulan',
    noAssignmentsLabel: 'Belum ada tugas untuk mata kuliah ini.',
    markDone: 'Tandai Selesai',
    completedLabel: 'Selesai',
    readStatusLabel: 'Sudah dibaca',
    downloadMaterialBtn: 'Unduh Materi',
    redownloadMaterialBtn: 'Unduh Ulang Materi',
    downloadedBadge: 'Terunduh',
    videoPageSubtitle: 'Ketuk video bab untuk membuka materi pembelajaran di YouTube',
    watchOnYoutube: 'Buka di YouTube',
    watchedLabel: 'Sudah ditonton',
    diskusiTitle: 'Diskusi',
    searchDiskusiPlaceholder: 'Cari diskusi...',
    filterAll: 'Semua',
    sortNewest: '↑↓ Terbaru',
    sortOldest: '↑↓ Terlama',
    sortPopular: '↑↓ Terpopuler',
    newTopicBtn: 'Topik Baru',
    publishTopicBtn: 'Terbitkan Topik',
    participantsLabel: 'peserta',
    youLabel: 'Anda',
    repliesLabel: 'balasan',
    viewsLabel: 'dilihat',
    profilTitle: 'Profil',
    editProfileTitle: 'Edit Profil',
    changePhotoLabel: 'Foto Profil',
    uploadPhotoBtn: 'Unggah dari Perangkat',
    resetPhotoBtn: 'Pakai Inisial',
    chooseAvatarLabel: 'Atau pilih avatar',
    learningProgressTitle: 'Progres belajar',
    activeClassesMetric: 'Kelas aktif',
    completedMaterialsMetric: 'Materi selesai',
    completedTasksMetric: 'Tugas & kuis',
    academicDataTitle: 'Data Akademik',
    personalInfoTitle: 'Informasi Pribadi',
    studyProgramLabel: 'Program Studi',
    facultyLabel: 'Fakultas',
    cohortLabel: 'Angkatan',
    semesterFieldLabel: 'Semester Aktif',
    advisorLabel: 'Dosen Wali',
    academicStatusLabel: 'Status Akademik',
    activeStatusValue: 'Aktif',
    phoneLabel: 'Nomor Telepon',
    addressLabel: 'Domisili',
    accountPreferencesTitle: 'Akun & preferensi',
    accountSecurity: 'Keamanan Akun',
    languageLabel: 'Bahasa',
    darkModeLabel: 'Mode Gelap',
    notificationsLabel: 'Notifikasi',
    helpInfoTitle: 'Bantuan & informasi',
    manualBookItem: 'Manual Book',
    helpCenterItem: 'Pusat Bantuan',
    aboutTechifyItem: 'Tentang Techify',
    logoutItem: 'Keluar Akun',
    notificationsTitle: 'Notifikasi',
    markAllRead: 'Tandai semua dibaca',
    studentRole: 'Mahasiswa',
    lecturerRole: 'Dosen',
  },
  en: {
    brand: 'Techify',
    authTitle: 'Master IT concepts',
    authSubtitle: 'Learn with clear direction. Progress and quizzes save automatically.',
    loginTab: 'Sign In',
    registerTab: 'Register',
    emailLabel: 'Email',
    emailPlaceholder: 'nama@gmail.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    confirmPasswordLabel: 'Confirm password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    fullNameLabel: 'Full name',
    fullNamePlaceholder: 'Your name',
    identityTypeLabel: 'Identity type',
    identityNumberLabel: 'Identity number',
    identityNumberPlaceholder: 'e.g. 25050974149',
    loginAction: 'Sign In',
    registerAction: 'Create Account',
    orDivider: 'or',
    continueGoogle: 'Continue with Google',
    noAccountPrompt: "Don't have an account?",
    hasAccountPrompt: 'Already have an account?',
    agreeTermsPrefix: 'I agree to the',
    termsLink: 'Terms & Conditions',
    andText: 'and',
    privacyLink: 'Privacy Policy',
    passwordMatchOk: 'Passwords match and meet requirements',
    passwordMatchFail: 'Passwords do not match yet',
    passwordMinChars: 'Minimum 6 characters',
    navDashboard: 'Dashboard',
    navKelas: 'Classes',
    navMateri: 'Materials',
    navDiskusi: 'Discuss',
    navProfil: 'Profile',
    greetingPrefix: 'Hello,',
    greetingSubtitle: 'Welcome back, what would you like to learn today?',
    levelLabel: 'Level',
    xpToNext: (remaining, nextLevel) => `${remaining} XP more to level ${nextLevel}`,
    dailyTargetsTitle: 'Daily Targets',
    dailyTargetsCount: (done, total) => `${done}/${total} targets completed`,
    dailyTargetsHint: 'Tap to view daily targets',
    xpModalTitle: 'XP & Level Details',
    checkInTitle: 'Daily XP Check-in',
    checkInSubtitle: 'Claim consecutive daily XP bonuses across a 7-day streak',
    claimTodayXpBtn: "Claim Today's XP",
    claimedTodayXpBtn: 'Claimed Today',
    dayLabel: (day) => `Day ${day}`,
    levelRulesTitle: 'Level Progression Rules',
    xpSourcesTitle: 'Learning Activity XP Sources',
    menuPretest: 'Pretest',
    menuPretestSub: 'Initial Assessment',
    menuMateri: 'Materials',
    menuMateriSub: 'Learning Modules',
    menuVideo: 'Study Videos',
    menuVideoSub: 'Watch Visual Lessons',
    menuPosttest: 'Posttest',
    menuPosttestSub: 'Final Assessment',
    menuJadwal: 'Class Schedule',
    menuJadwalSub: 'Weekly Timetable',
    menuManual: 'Manual Book',
    menuManualSub: 'Usage Guide',
    historyTitle: 'Activity History',
    historyEmpty: 'No activity recorded today.',
    viewAllHistory: 'View All',
    allHistoryTitle: 'All Activity History',
    generalActivityGroup: 'General Activity',
    activitiesCountLabel: (count) => `${count} ${count === 1 ? 'activity' : 'activities'}`,
    classesTitle: 'Classes',
    classesSubtitle: 'Active class schedule and semester attendance tracker',
    viewScheduleBtn: 'Class Schedule',
    scheduleTitle: 'Class Schedule',
    scheduleSubtitle: 'Select a schedule card to view room details and jump to materials',
    backBtn: 'Back',
    todayHighlightTitle: "Today's Highlight",
    allClassesDoneTitle: 'All Classes Completed',
    allClassesDoneDesc: 'No remaining classes scheduled for today.',
    ongoingClassTitle: 'Class In Progress',
    upcomingClassTitle: 'Next Class Today',
    todayBadge: 'Today',
    classesCountLabel: (count) => `${count} ${count === 1 ? 'class' : 'classes'}`,
    statusCompleted: 'Completed',
    statusOngoing: 'Ongoing',
    statusScheduled: 'Scheduled',
    attendanceLabel: 'Attendance',
    presentLabel: 'Present',
    sickLabel: 'Sick',
    permitLabel: 'Permit',
    absentLabel: 'Absent',
    presentRatioLabel: (pct, present, total) => `Present ${pct}% (${present}/${total})`,
    qrAttendanceBtn: 'QR Check-in',
    attendanceHistoryBtn: 'History',
    qrPageTitle: 'QR Attendance Scanner',
    qrPageSubtitle: 'Point your camera at the lecturer’s QR code displayed in class to record today’s attendance',
    qrCameraHint: 'Align the lecturer’s QR code inside the scan frame',
    qrEnableCameraBtn: 'Enable Camera',
    qrRetryCameraBtn: 'Retry Camera',
    qrCameraActiveLabel: 'Camera Active · Ready to Scan',
    qrCameraRequestingLabel: 'Starting camera...',
    qrCameraFallbackLabel: 'QR Scanner Simulation Mode',
    qrCameraDeniedNote: 'Camera permission was denied or blocked by the browser/preview sandbox. You can still use the confirm button below to test attendance.',
    qrCameraUnavailableNote: 'Device camera is unavailable in this environment. Simulation mode is active so attendance check-in can still be tested.',
    qrConfirmBtn: 'Scan & Confirm Attendance',
    qrAlreadyCheckedBtn: 'Checked In Today',
    qrManualCodePlaceholder: 'Or enter session code from lecturer (optional)',
    attendanceHistoryTitle: 'Attendance History',
    noClassesOnDay: 'No classes scheduled on this day.',
    dayNames: {
      Senin: 'Monday',
      Selasa: 'Tuesday',
      Rabu: 'Wednesday',
      Kamis: 'Thursday',
      Jumat: 'Friday',
    },
    materiTitle: 'Materials',
    materiSubtitle: 'Select a subject to view learning chapters and assignments',
    materiSummaryCount: (total, done) => `${total} modules, ${done} completed`,
    chaptersTabLabel: 'Chapters',
    assignmentsTabLabel: 'Assignments',
    assignmentBtn: 'Assignments',
    assignmentsTitle: 'Course Assignments',
    assignmentNotSubmitted: 'Not Submitted',
    assignmentSubmitted: 'Submitted',
    assignmentDeadlineLabel: 'Deadline',
    assignmentInstructionsLabel: 'Assignment Instructions',
    assignmentAnswerLabel: 'Answer / Submission Notes',
    assignmentAnswerPlaceholder: 'Write your answer summary, notes, or explanation for the lecturer...',
    assignmentLinkLabel: 'Submission Link (Optional)',
    assignmentLinkPlaceholder: 'https://drive.google.com/... or https://github.com/...',
    assignmentFileLabel: 'File Attachment (Optional)',
    assignmentFileEmpty: 'No file selected (PDF, ZIP, DOCX, or image)',
    submitAssignmentBtn: 'Submit Assignment',
    updateAssignmentBtn: 'Update Submission',
    noAssignmentsLabel: 'No assignments posted for this course yet.',
    markDone: 'Mark Complete',
    completedLabel: 'Completed',
    readStatusLabel: 'Read',
    downloadMaterialBtn: 'Download Module',
    redownloadMaterialBtn: 'Download Module Again',
    downloadedBadge: 'Downloaded',
    videoPageSubtitle: 'Tap any chapter video to open the visual lesson on YouTube',
    watchOnYoutube: 'Open on YouTube',
    watchedLabel: 'Watched',
    diskusiTitle: 'Discussion',
    searchDiskusiPlaceholder: 'Search discussions...',
    filterAll: 'All',
    sortNewest: '↑↓ Newest',
    sortOldest: '↑↓ Oldest',
    sortPopular: '↑↓ Popular',
    newTopicBtn: 'New Topic',
    publishTopicBtn: 'Publish Topic',
    participantsLabel: 'participants',
    youLabel: 'You',
    repliesLabel: 'replies',
    viewsLabel: 'views',
    profilTitle: 'Profile',
    editProfileTitle: 'Edit Profile',
    changePhotoLabel: 'Profile Photo',
    uploadPhotoBtn: 'Upload from Device',
    resetPhotoBtn: 'Use Initials',
    chooseAvatarLabel: 'Or choose an avatar',
    learningProgressTitle: 'Learning progress',
    activeClassesMetric: 'Active classes',
    completedMaterialsMetric: 'Modules done',
    completedTasksMetric: 'Tasks & quizzes',
    academicDataTitle: 'Academic Data',
    personalInfoTitle: 'Personal Information',
    studyProgramLabel: 'Study Program',
    facultyLabel: 'Faculty',
    cohortLabel: 'Cohort',
    semesterFieldLabel: 'Active Semester',
    advisorLabel: 'Academic Advisor',
    academicStatusLabel: 'Academic Status',
    activeStatusValue: 'Active',
    phoneLabel: 'Phone Number',
    addressLabel: 'City / Address',
    accountPreferencesTitle: 'Account & preferences',
    accountSecurity: 'Account Security',
    languageLabel: 'Language',
    darkModeLabel: 'Dark Mode',
    notificationsLabel: 'Notifications',
    helpInfoTitle: 'Help & information',
    manualBookItem: 'Manual Book',
    helpCenterItem: 'Help Center',
    aboutTechifyItem: 'About Techify',
    logoutItem: 'Sign Out',
    notificationsTitle: 'Notifications',
    markAllRead: 'Mark all read',
    studentRole: 'Student',
    lecturerRole: 'Lecturer',
  },
};
