import {
  AssignmentItem,
  AttendanceLogEntry,
  AttendanceStatus,
  ChapterItem,
  Course,
  CourseQuizSet,
  DayOfWeek,
  DiscussionThread,
  NotificationItem,
} from '../types/lms';

type RawChapter = Omit<ChapterItem, 'youtubeUrl'>;
type RawCourse = Omit<Course, 'chapters' | 'initialAttendanceLogs'> & {
  chapters: RawChapter[];
  attendancePattern: AttendanceStatus[];
};

const RAW_COURSES: RawCourse[] = [
  {
    id: 'pbo',
    code: 'PTI-201',
    title: 'Pemrograman Berorientasi Objek',
    scheduleTitle: 'Pemrograman Berorientasi Objek',
    lecturer: 'Dr. Andi Saputra',
    dayOfWeek: 'Senin',
    startTime: '08:00',
    endTime: '10:30',
    scheduleDayTime: 'Senin, 08.00–10.30',
    room: 'Lab Komputer A2 · Gedung Tekno',
    mode: 'Tatap Muka & Praktikum',
    credits: 3,
    tone: 'teal',
    attendancePattern: [
      'hadir', 'hadir', 'hadir', 'hadir', 'sakit', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'izin', 'hadir', 'hadir', 'hadir',
    ],
    description:
      'Mempelajari paradigma pemrograman berbasis objek mencakup kelas, objek, enkapsulasi, pewarisan, hingga polimorfisme dalam pengembangan perangkat lunak modern.',
    chapters: [
      {
        id: 'pbo-1',
        number: 1,
        title: 'Bab 1 - Konsep Dasar PBO',
        moduleLabel: 'Modul Bab 1',
        duration: '20 mnt baca',
        videoDuration: '12:40',
        summary:
          'Pemrograman Berorientasi Objek (PBO) memodelkan sistem perangkat lunak sebagai kumpulan objek yang saling berinteraksi. Setiap objek memiliki keadaan (state) dan perilaku (behavior).',
        keyPoints: [
          'Perbedaan paradigma prosedural dan paradigma berorientasi objek.',
          'Definisi Class sebagai cetak biru (blueprint) dan Object sebagai instansiasi nyata.',
          'Empat pilar utama PBO: Enkapsulasi, Pewarisan, Polimorfisme, dan Abstraksi.',
        ],
        codeExample: `class Mahasiswa {
  String nama;
  String nim;

  void sapa() {
    System.out.println("Halo, saya " + nama);
  }
}`,
      },
      {
        id: 'pbo-2',
        number: 2,
        title: 'Bab 2 - Atribut, Method, dan Konstruktor',
        moduleLabel: 'Modul Bab 2',
        duration: '25 mnt baca',
        videoDuration: '15:15',
        summary:
          'Atribut menyimpan data internal objek, method mendefinisikan aksi yang dapat dilakukan objek, sedangkan konstruktor menginisialisasi objek saat pertama kali dibuat.',
        keyPoints: [
          'Deklarasi field/atribut instans dan variabel statis kelas.',
          'Overloading method dan konstruktor dengan parameter berbeda.',
          'Penggunaan kata kunci this untuk membedakan atribut kelas dan parameter.',
        ],
        codeExample: `class MataKuliah {
  String kode;
  int sks;

  MataKuliah(String kode, int sks) {
    this.kode = kode;
    this.sks = sks;
  }
}`,
      },
      {
        id: 'pbo-3',
        number: 3,
        title: 'Bab 3 - Enkapsulasi',
        moduleLabel: 'Modul Bab 3',
        duration: '22 mnt baca',
        videoDuration: '14:05',
        summary:
          'Enkapsulasi membungkus data dan method dalam satu unit serta membatasi akses langsung menggunakan access modifier agar integritas data tetap terjaga.',
        keyPoints: [
          'Tingkat akses public, private, dan protected.',
          'Implementasi Getter dan Setter dengan validasi nilai masukan.',
          'Menjaga invariant objek agar data tidak berubah sembarangan.',
        ],
        codeExample: `class NilaiMahasiswa {
  private double skor;

  public void setSkor(double skor) {
    if (skor >= 0 && skor <= 100) {
      this.skor = skor;
    }
  }
  public double getSkor() { return skor; }
}`,
      },
      {
        id: 'pbo-4',
        number: 4,
        title: 'Bab 4 - Pewarisan (Inheritance)',
        moduleLabel: 'Modul Bab 4',
        duration: '28 mnt baca',
        videoDuration: '16:30',
        summary:
          'Pewarisan memungkinkan sebuah kelas anak (subclass) mewarisi atribut dan perilaku dari kelas induk (superclass) untuk mengurangi duplikasi kode.',
        keyPoints: [
          'Hubungan IS-A antara superclass dan subclass dengan extends.',
          'Pemanggilan konstruktor induk melalui kata kunci super().',
          'Method overriding untuk menyesuaikan perilaku kelas turunan.',
        ],
        codeExample: `class Pengguna {
  String nama;
}
class Mahasiswa extends Pengguna {
  String nim;
}`,
      },
      {
        id: 'pbo-5',
        number: 5,
        title: 'Bab 5 - Polimorfisme dan Abstraksi',
        moduleLabel: 'Modul Bab 5',
        duration: '30 mnt baca',
        videoDuration: '18:20',
        summary:
          'Polimorfisme memungkinkan satu antarmuka digunakan oleh berbagai tipe objek, sementara abstraksi menyembunyikan kompleksitas implementasi melalui abstract class dan interface.',
        keyPoints: [
          'Dynamic dispatch dan runtime polymorphism pada hierarki kelas.',
          'Perbedaan abstract class dan interface dalam desain kontrak API.',
          'Penerapan prinsip Open-Closed melalui abstraksi yang bersih.',
        ],
        codeExample: `interface Penilaian {
  double hitungNilaiAkhir();
}
class Kuis implements Penilaian {
  public double hitungNilaiAkhir() { return 92.5; }
}`,
      },
    ],
  },
  {
    id: 'basis-data',
    code: 'PTI-204',
    title: 'Basis Data',
    scheduleTitle: 'Basis Data',
    lecturer: 'Ir. Rina Wijaya',
    dayOfWeek: 'Senin',
    startTime: '13:00',
    endTime: '15:30',
    scheduleDayTime: 'Senin, 13.00–15.30',
    room: 'Ruang Kuliah B301',
    mode: 'Tatap Muka',
    credits: 3,
    tone: 'sky',
    attendancePattern: [
      'hadir', 'hadir', 'hadir', 'izin', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir',
    ],
    description:
      'Merancang skema relasional yang ternormalisasi, menulis kueri SQL analitis, serta memahami transaksi dan indeks untuk performa sistem basis data.',
    chapters: [
      {
        id: 'bd-1',
        number: 1,
        title: 'Bab 1 - Pengantar Sistem Basis Data',
        moduleLabel: 'Modul Bab 1',
        duration: '18 mnt baca',
        videoDuration: '11:20',
        summary:
          'Mengenal peran DBMS, arsitektur tiga skema, serta keunggulan basis data relasional dibanding penyimpanan berkas datar.',
        keyPoints: [
          'Komponen utama DBMS dan independensi data logis maupun fisik.',
          'Model data relasional: relasi, tupel, atribut, dan domain.',
          'Peran Primary Key dan Foreign Key dalam menjaga integritas referensial.',
        ],
      },
      {
        id: 'bd-2',
        number: 2,
        title: 'Bab 2 - Entity Relationship Diagram (ERD)',
        moduleLabel: 'Modul Bab 2',
        duration: '24 mnt baca',
        videoDuration: '14:50',
        summary:
          'Memodelkan kebutuhan bisnis menjadi entitas, atribut, serta kardinalitas relasi sebelum ditransformasikan menjadi tabel SQL.',
        keyPoints: [
          'Identifikasi entitas kuat, entitas lemah, dan atribut komposit.',
          'Pemetaan relasi 1:1, 1:N, dan M:N beserta tabel asosiatif.',
          'Transformasi diagram ERD menjadi skema relasional.',
        ],
      },
      {
        id: 'bd-3',
        number: 3,
        title: 'Bab 3 - Normalisasi Data (1NF–BCNF)',
        moduleLabel: 'Modul Bab 3',
        duration: '26 mnt baca',
        videoDuration: '16:10',
        summary:
          'Menghilangkan anomali penyisipan, pembaruan, dan penghapusan dengan menerapkan tahapan normalisasi secara sistematis.',
        keyPoints: [
          'Ketergantungan fungsional (functional dependency) dan kunci kandidat.',
          'Syarat bentuk normal 1NF, 2NF, 3NF, dan Boyce-Codd Normal Form.',
          'Kapan denormalisasi diperlukan untuk optimasi baca.',
        ],
      },
      {
        id: 'bd-4',
        number: 4,
        title: 'Bab 4 - Kueri SQL Lanjutan & Join',
        moduleLabel: 'Modul Bab 4',
        duration: '28 mnt baca',
        videoDuration: '17:05',
        summary:
          'Mengolah data multi-tabel secara efisien menggunakan INNER JOIN, LEFT JOIN, agregasi GROUP BY, serta subquery.',
        keyPoints: [
          'Perbedaan INNER, LEFT, RIGHT, dan FULL OUTER JOIN.',
          'Agregasi COUNT, SUM, AVG dengan klausa GROUP BY dan HAVING.',
          'Common Table Expressions (CTE) untuk keterbacaan kueri.',
        ],
        codeExample: `SELECT m.nama, COUNT(k.id) AS total_kelas
FROM mahasiswa m
LEFT JOIN krs k ON k.mahasiswa_id = m.id
GROUP BY m.nama;`,
      },
      {
        id: 'bd-5',
        number: 5,
        title: 'Bab 5 - Transaksi, ACID, dan Indeks',
        moduleLabel: 'Modul Bab 5',
        duration: '25 mnt baca',
        videoDuration: '15:40',
        summary:
          'Menjamin konsistensi data pada akses konkuren melalui properti ACID dan mempercepat pencarian baris dengan B-Tree index.',
        keyPoints: [
          'Empat jaminan transaksi: Atomicity, Consistency, Isolation, Durability.',
          'Tingkat isolasi transaksi dan pencegahan deadlock.',
          'Cara kerja B-Tree index dan analisis query plan.',
        ],
      },
    ],
  },
  {
    id: 'pemweb-mobile',
    code: 'PTI-302',
    title: 'Pemrograman Web dan Perangkat Bergerak',
    scheduleTitle: 'Pemrograman Web dan Perangkat Bergerak',
    lecturer: 'Budi Hartono, M.T.',
    dayOfWeek: 'Selasa',
    startTime: '08:00',
    endTime: '10:30',
    scheduleDayTime: 'Selasa, 08.00–10.30',
    room: 'Lab Rekayasa Web C1',
    mode: 'Hybrid · Praktikum',
    credits: 3,
    tone: 'amber',
    attendancePattern: [
      'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'alpha', 'hadir', 'hadir', 'hadir', 'hadir', 'sakit', 'hadir', 'hadir', 'hadir',
    ],
    description:
      'Membangun antarmuka web modern yang responsif, mengonsumsi REST API secara asinkron, dan merancang aplikasi mobile lintas platform.',
    chapters: [
      {
        id: 'pw-1',
        number: 1,
        title: 'Bab 1 - Arsitektur Web Modern & HTML Semantik',
        moduleLabel: 'Modul Bab 1',
        duration: '20 mnt baca',
        videoDuration: '13:10',
        summary:
          'Memahami siklus permintaan HTTP, struktur DOM semantik untuk aksesibilitas, serta prinsip desain mobile-first.',
        keyPoints: [
          'Elemen semantik header, nav, main, section, dan footer.',
          'Viewport meta tag dan teknik layout responsif Flexbox & CSS Grid.',
          'Optimasi performa rendering awal di browser.',
        ],
      },
      {
        id: 'pw-2',
        number: 2,
        title: 'Bab 2 - Komponen React & Manajemen State',
        moduleLabel: 'Modul Bab 2',
        duration: '26 mnt baca',
        videoDuration: '16:45',
        summary:
          'Menyusun antarmuka modular berbasis komponen fungsional dengan hooks useState, useEffect, dan aliran data searah.',
        keyPoints: [
          'Pemecahan UI menjadi komponen kecil yang reusable.',
          'Pengelolaan state lokal vs state terangkat (lifted state).',
          'Siklus efek samping dan pembersihan listener di useEffect.',
        ],
      },
      {
        id: 'pw-3',
        number: 3,
        title: 'Bab 3 - Integrasi REST API & Asynchronous JS',
        moduleLabel: 'Modul Bab 3',
        duration: '24 mnt baca',
        videoDuration: '14:30',
        summary:
          'Mengambil dan mengirim data JSON menggunakan fetch, async/await, serta menangani status loading dan error dengan rapi.',
        keyPoints: [
          'Metode HTTP GET, POST, PUT, PATCH, dan DELETE.',
          'Penanganan Promise dan blok try/catch pada operasi jaringan.',
          'Pola optimistic UI dan cache lokal.',
        ],
      },
      {
        id: 'pw-4',
        number: 4,
        title: 'Bab 4 - Dasar Pengembangan Perangkat Bergerak',
        moduleLabel: 'Modul Bab 4',
        duration: '25 mnt baca',
        videoDuration: '15:55',
        summary:
          'Mengenal ergonomi layar sentuh, navigasi tab bawah, ukuran target sentuh minimal 44px, dan adaptasi layar ponsel.',
        keyPoints: [
          'Thumb-zone ergonomics dan navigasi bottom bar.',
          'Pengelolaan gestur sentuh, scroll halus, dan safe-area inset.',
          'Perbandingan aplikasi Web PWA dan native cross-platform.',
        ],
      },
      {
        id: 'pw-5',
        number: 5,
        title: 'Bab 5 - Penyimpanan Lokal & Publikasi Aplikasi',
        moduleLabel: 'Modul Bab 5',
        duration: '22 mnt baca',
        videoDuration: '13:50',
        summary:
          'Menyimpan preferensi pengguna secara persisten di browser/perangkat dan menyiapkan build produksi yang aman.',
        keyPoints: [
          'Penggunaan localStorage dan IndexedDB untuk mode offline.',
          'Bundling aset statis dengan Vite dan variabel lingkungan.',
          'Checklist pengujian lintas perangkat sebelum rilis.',
        ],
      },
    ],
  },
  {
    id: 'algoritma',
    code: 'PTI-102',
    title: 'Pemrograman Dasar & Algoritma',
    scheduleTitle: 'Pemrograman Dasar dan Algoritma',
    lecturer: 'Siti Nurhaliza, M.Kom.',
    dayOfWeek: 'Rabu',
    startTime: '10:00',
    endTime: '12:30',
    scheduleDayTime: 'Rabu, 10.00–12.30',
    room: 'Ruang Kuliah A104',
    mode: 'Tatap Muka',
    credits: 3,
    tone: 'emerald',
    attendancePattern: [
      'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'izin', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir',
    ],
    description:
      'Mengasah logika pemecahan masalah melalui perancangan algoritma terstruktur, struktur data dasar, serta analisis kompleksitas waktu.',
    chapters: [
      {
        id: 'alg-1',
        number: 1,
        title: 'Bab 1 - Berpikir Komputasional & Flowchart',
        moduleLabel: 'Modul Bab 1',
        duration: '18 mnt baca',
        videoDuration: '10:50',
        summary:
          'Memecah persoalan kompleks menjadi langkah-langkah logis yang terdefinisi jelas melalui pseudocode dan diagram alir.',
        keyPoints: [
          'Dekomposisi masalah, pengenalan pola, dan abstraksi.',
          'Notasi standar pseudocode dan simbol flowchart.',
          'Penelusuran manual (tracing) variabel baris demi baris.',
        ],
      },
      {
        id: 'alg-2',
        number: 2,
        title: 'Bab 2 - Percabangan & Perulangan Terstruktur',
        moduleLabel: 'Modul Bab 2',
        duration: '22 mnt baca',
        videoDuration: '13:40',
        summary:
          'Mengendalikan alur eksekusi program menggunakan kondisi logika majemuk dan iterasi for, while, serta nested loop.',
        keyPoints: [
          'Evaluasi ekspresi boolean dan operator logika AND/OR/NOT.',
          'Memilih jenis perulangan yang tepat sesuai kondisi berhenti.',
          'Menghindari infinite loop dan kesalahan batas indeks.',
        ],
      },
      {
        id: 'alg-3',
        number: 3,
        title: 'Bab 3 - Array, String, dan Fungsi Rekursif',
        moduleLabel: 'Modul Bab 3',
        duration: '26 mnt baca',
        videoDuration: '15:25',
        summary:
          'Mengelola kumpulan data berindeks dan membangun fungsi modular termasuk pemanggilan diri sendiri (rekursi).',
        keyPoints: [
          'Operasi traversal, penyisipan, dan pencarian elemen pada array.',
          'Base case dan recursive step agar rekursi berhenti dengan aman.',
          'Perbandingan efisiensi iterasi vs rekursi.',
        ],
      },
      {
        id: 'alg-4',
        number: 4,
        title: 'Bab 4 - Algoritma Pencarian & Pengurutan',
        moduleLabel: 'Modul Bab 4',
        duration: '28 mnt baca',
        videoDuration: '17:15',
        summary:
          'Mempelajari Linear Search, Binary Search, Bubble Sort, Insertion Sort, serta pengenalan Merge Sort.',
        keyPoints: [
          'Prasyarat data terurut pada Binary Search.',
          'Perbandingan jumlah pertukaran dan pergeseran pada algoritma sort.',
          'Visualisasi langkah pembagian array pada Merge Sort.',
        ],
      },
      {
        id: 'alg-5',
        number: 5,
        title: 'Bab 5 - Analisis Kompleksitas Big-O',
        moduleLabel: 'Modul Bab 5',
        duration: '24 mnt baca',
        videoDuration: '14:40',
        summary:
          'Mengukur pertumbuhan waktu eksekusi dan penggunaan memori seiring bertambahnya ukuran masukan data.',
        keyPoints: [
          'Notasi O(1), O(log n), O(n), O(n log n), dan O(n²).',
          'Analisis skenario terbaik, rata-rata, dan terburuk.',
          'Memilih struktur data yang tepat untuk optimasi waktu.',
        ],
      },
    ],
  },
  {
    id: 'ui-ux',
    code: 'PTI-210',
    title: 'Desain Industri & UI/UX',
    scheduleTitle: 'Desain Interaksi dan UI/UX',
    lecturer: 'Dimas Prakoso, M.Ds.',
    dayOfWeek: 'Kamis',
    startTime: '08:00',
    endTime: '10:30',
    scheduleDayTime: 'Kamis, 08.00–10.30',
    room: 'Studio Desain Digital D2',
    mode: 'Studio & Kritik Desain',
    credits: 2,
    tone: 'rose',
    attendancePattern: [
      'hadir', 'hadir', 'sakit', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir',
    ],
    description:
      'Merancang pengalaman pengguna yang empatik berbasis riset, arsitektur informasi yang jernih, serta sistem antarmuka visual yang konsisten.',
    chapters: [
      {
        id: 'ux-1',
        number: 1,
        title: 'Bab 1 - Prinsip Design Thinking & Riset Pengguna',
        moduleLabel: 'Modul Bab 1',
        duration: '20 mnt baca',
        videoDuration: '12:15',
        summary:
          'Memahami lima tahap Design Thinking dari empati hingga pengujian untuk memastikan produk menjawab kebutuhan nyata pengguna.',
        keyPoints: [
          'Wawancara pengguna, penyusunan persona, dan empathy map.',
          'Merumuskan problem statement yang fokus pada manusia.',
          'Menghindari bias asumsi desainer saat observasi.',
        ],
      },
      {
        id: 'ux-2',
        number: 2,
        title: 'Bab 2 - Arsitektur Informasi & User Flow',
        moduleLabel: 'Modul Bab 2',
        duration: '22 mnt baca',
        videoDuration: '13:30',
        summary:
          'Menyusun struktur navigasi dan alur tugas pengguna agar informasi penting mudah ditemukan tanpa kebingungan.',
        keyPoints: [
          'Teknik card sorting untuk pengelompokan menu aplikasi.',
          'Pemetaan user flow mulai dari titik masuk hingga tujuan akhir.',
          'Mengurangi beban kognitif dengan hierarki konten yang jelas.',
        ],
      },
      {
        id: 'ux-3',
        number: 3,
        title: 'Bab 3 - Wireframing & Tata Letak Grid',
        moduleLabel: 'Modul Bab 3',
        duration: '24 mnt baca',
        videoDuration: '15:00',
        summary:
          'Menerjemahkan alur menjadi kerangka tata letak low-fidelity menggunakan sistem grid 8pt dan proporsi ruang kosong yang seimbang.',
        keyPoints: [
          'Aturan jarak 4px/8px grid untuk konsistensi visual.',
          'Prinsip kedekatan (proximity) dan pengelompokan kartu.',
          'Menjaga ruang bernapas agar layar tidak terasa penuh sesak.',
        ],
      },
      {
        id: 'ux-4',
        number: 4,
        title: 'Bab 4 - Tipografi, Warna & Aksesibilitas',
        moduleLabel: 'Modul Bab 4',
        duration: '25 mnt baca',
        videoDuration: '15:45',
        summary:
          'Membangun skala tipografi yang mudah dipindai serta palet warna 60-30-10 yang memenuhi standar kontras WCAG AA.',
        keyPoints: [
          'Rasio kontras teks minimal 4.5:1 pada latar terang.',
          'Memadukan huruf judul berkarakter dengan huruf baca yang netral.',
          'Tidak hanya mengandalkan warna untuk menandai status.',
        ],
      },
      {
        id: 'ux-5',
        number: 5,
        title: 'Bab 5 - Prototipe Interaktif & Usability Testing',
        moduleLabel: 'Modul Bab 5',
        duration: '23 mnt baca',
        videoDuration: '14:20',
        summary:
          'Menguji prototipe langsung ke pengguna nyata menggunakan skenario tugas untuk menemukan hambatan interaksi sejak dini.',
        keyPoints: [
          'Menyusun skenario uji tugas tanpa mengarahkan jawaban responden.',
          'Mengukur tingkat keberhasilan tugas dan waktu penyelesaian.',
          'Iterasi perbaikan desain berdasarkan temuan observasi.',
        ],
      },
    ],
  },
  {
    id: 'pemodelan-pl',
    code: 'PTI-305',
    title: 'Pemodelan Perangkat Lunak',
    scheduleTitle: 'Pemodelan Perangkat Lunak',
    lecturer: 'Dr. Maya Lestari',
    dayOfWeek: 'Jumat',
    startTime: '13:00',
    endTime: '15:30',
    scheduleDayTime: 'Jumat, 13.00–15.30',
    room: 'Ruang Seminar E102',
    mode: 'Tatap Muka',
    credits: 3,
    tone: 'violet',
    attendancePattern: [
      'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'izin', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir', 'hadir',
    ],
    description:
      'Mempelajari analisis kebutuhan sistem, pemodelan berorientasi objek dengan UML (Use Case, Class, Sequence, Activity), serta arsitektur perangkat lunak.',
    chapters: [
      {
        id: 'ppl-1',
        number: 1,
        title: 'Bab 1 - Rekayasa Kebutuhan & Spesifikasi SRS',
        moduleLabel: 'Modul Bab 1',
        duration: '22 mnt baca',
        videoDuration: '13:05',
        summary:
          'Membedakan kebutuhan fungsional dan non-fungsional serta mendokumentasikannya secara terukur dalam dokumen SRS.',
        keyPoints: [
          'Teknik elisitasi kebutuhan melalui wawancara dan observasi proses.',
          'Menulis kriteria penerimaan (acceptance criteria) yang dapat diuji.',
          'Menjaga keterlacakan kebutuhan hingga tahap pengujian.',
        ],
      },
      {
        id: 'ppl-2',
        number: 2,
        title: 'Bab 2 - Use Case & Activity Diagram',
        moduleLabel: 'Modul Bab 2',
        duration: '24 mnt baca',
        videoDuration: '14:55',
        summary:
          'Memetakan aktor dan layanan sistem lewat Use Case Diagram serta memvisualisasikan alur aktivitas bisnis dengan Activity Diagram.',
        keyPoints: [
          'Relasi include dan extend yang tepat pada Use Case.',
          'Skenario utama (main flow) dan skenario alternatif.',
          'Penggunaan swimlane pada Activity Diagram untuk pembagian peran.',
        ],
      },
      {
        id: 'ppl-3',
        number: 3,
        title: 'Bab 3 - Class Diagram & Relasi Domain',
        moduleLabel: 'Modul Bab 3',
        duration: '27 mnt baca',
        videoDuration: '16:25',
        summary:
          'Merancang struktur statis sistem meliputi asosiasi, agregasi, komposisi, serta multiplisitas antar entitas domain.',
        keyPoints: [
          'Perbedaan agregasi (belah ketupat putih) dan komposisi (hitam).',
          'Menentukan visibilitas atribut (+, -, #) dan tipe kembalian method.',
          'Menghubungkan Class Diagram dengan arsitektur kode.',
        ],
      },
      {
        id: 'ppl-4',
        number: 4,
        title: 'Bab 4 - Sequence & State Machine Diagram',
        moduleLabel: 'Modul Bab 4',
        duration: '25 mnt baca',
        videoDuration: '15:10',
        summary:
          'Memodelkan urutan pertukaran pesan antar objek berdasarkan waktu serta transisi status objek sepanjang siklus hidupnya.',
        keyPoints: [
          'Lifeline, activation bar, pesan sinkron, dan nilai balik.',
          'Fragmen gabungan alt, opt, dan loop pada Sequence Diagram.',
          'Pemodelan siklus status (Draft -> Aktif -> Selesai).',
        ],
      },
      {
        id: 'ppl-5',
        number: 5,
        title: 'Bab 5 - Pola Arsitektur & Dokumentasi Sistem',
        moduleLabel: 'Modul Bab 5',
        duration: '24 mnt baca',
        videoDuration: '14:35',
        summary:
          'Mengenal arsitektur berlapis (Layered, MVC, Clean Architecture) untuk menghasilkan sistem yang mudah dirawat dan dikembangkan.',
        keyPoints: [
          'Pemisahan tanggung jawab lapisan presentasi, domain, dan data.',
          'Deployment Diagram dan Component Diagram untuk infrastruktur.',
          'Praktik menjaga diagram tetap relevan dengan kode produksi.',
        ],
      },
    ],
  },
];

const DAY_OFFSET: Record<DayOfWeek, number> = {
  Senin: 0,
  Selasa: 1,
  Rabu: 2,
  Kamis: 3,
  Jumat: 4,
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function buildInitialAttendanceLogs(course: RawCourse): AttendanceLogEntry[] {
  // Semester start Monday: 2026-08-17
  const baseMonday = new Date(2026, 7, 17);
  const offset = DAY_OFFSET[course.dayOfWeek];
  return course.attendancePattern.map((status, idx) => {
    const meetingDate = new Date(baseMonday);
    meetingDate.setDate(baseMonday.getDate() + idx * 7 + offset);
    const yyyy = meetingDate.getFullYear();
    const mm = String(meetingDate.getMonth() + 1).padStart(2, '0');
    const dd = String(meetingDate.getDate()).padStart(2, '0');
    const chapter = course.chapters[idx % course.chapters.length];
    const cleanTopic = chapter.title.replace(/^Bab\s+\d+\s*-\s*/i, '');

    return {
      id: `${course.id}-att-${idx + 1}`,
      meetingNumber: idx + 1,
      dateLabel: `${meetingDate.getDate()} ${MONTH_LABELS[meetingDate.getMonth()]} ${yyyy}`,
      dateKey: `${yyyy}-${mm}-${dd}`,
      timeLabel: `${course.startTime} - ${course.endTime}`,
      topic: `${chapter.moduleLabel}: ${cleanTopic}`,
      status,
      method: status === 'hadir' ? (idx % 3 === 0 ? 'Manual' : 'QR') : 'Manual',
    };
  });
}

export const COURSES: Course[] = RAW_COURSES.map(({ attendancePattern: _pattern, ...course }) => ({
  ...course,
  chapters: course.chapters.map((chapter) => {
    const cleanTopic = chapter.title.replace(/^Bab\s+\d+\s*-\s*/i, '');
    const query = encodeURIComponent(`${course.title} ${cleanTopic}`);
    return {
      ...chapter,
      youtubeUrl: `https://www.youtube.com/results?search_query=${query}`,
    };
  }),
  initialAttendanceLogs: buildInitialAttendanceLogs({
    ...course,
    attendancePattern: _pattern,
  }),
}));

export const COURSE_QUIZZES: CourseQuizSet[] = [
  {
    courseId: 'pbo',
    pretest: [
      {
        id: 'pbo-pre-1',
        question: 'Dalam paradigma PBO, istilah yang menggambarkan cetak biru atau templat untuk menciptakan objek disebut...',
        options: ['Method', 'Class', 'Constructor', 'Package'],
        correctIndex: 1,
        explanation: 'Class berfungsi sebagai cetak biru (blueprint) yang mendefinisikan atribut dan perilaku dari objek yang akan dibuat.',
      },
      {
        id: 'pbo-pre-2',
        question: 'Pilar PBO yang bertujuan menyembunyikan detail data internal dengan access modifier private adalah...',
        options: ['Pewarisan', 'Polimorfisme', 'Enkapsulasi', 'Instansiasi'],
        correctIndex: 2,
        explanation: 'Enkapsulasi melindungi data internal objek dengan membatasi akses langsung dan menyediakan getter/setter terkontrol.',
      },
      {
        id: 'pbo-pre-3',
        question: 'Kata kunci apa yang biasa digunakan di Java untuk mewarisi kelas induk (superclass)?',
        options: ['implements', 'extends', 'inherits', 'superclass'],
        correctIndex: 1,
        explanation: 'Kata kunci extends digunakan oleh subclass untuk mewarisi atribut dan method dari satu superclass.',
      },
    ],
    posttest: [
      {
        id: 'pbo-post-1',
        question: 'Mengapa method setter sebaiknya dilengkapi validasi sebelum mengubah atribut private?',
        options: [
          'Agar kompilator berjalan lebih cepat',
          'Menjaga konsistensi dan integritas nilai objek',
          'Menggantikan fungsi konstruktor kelas',
          'Menghapus kebutuhan pewarisan kelas',
        ],
        correctIndex: 1,
        explanation: 'Validasi di dalam setter memastikan nilai yang masuk selalu memenuhi aturan domain objek (invariant).',
      },
      {
        id: 'pbo-post-2',
        question: 'Jika kelas Mahasiswa menimpa method tampilInfo() milik kelas Pengguna, mekanisme ini disebut...',
        options: ['Method Overloading', 'Method Overriding', 'Static Binding', 'Data Hiding'],
        correctIndex: 1,
        explanation: 'Method overriding terjadi ketika subclass mendefinisikan ulang implementasi method dari superclass dengan signature yang sama.',
      },
      {
        id: 'pbo-post-3',
        question: 'Kapan sebaiknya menggunakan interface dibanding abstract class?',
        options: [
          'Saat beberapa kelas yang tidak berkerabat perlu memenuhi kontrak perilaku yang sama',
          'Saat kita ingin menyimpan banyak state instans yang berubah-ubah',
          'Saat kelas hanya memiliki satu konstruktor privat',
          'Saat tidak membutuhkan polimorfisme',
        ],
        correctIndex: 0,
        explanation: 'Interface ideal untuk mendefinisikan kontrak kemampuan lintas hierarki kelas yang berbeda.',
      },
    ],
  },
  {
    courseId: 'basis-data',
    pretest: [
      {
        id: 'bd-pre-1',
        question: 'Kunci yang secara unik mengidentifikasi setiap baris dalam sebuah tabel relasional adalah...',
        options: ['Foreign Key', 'Primary Key', 'Composite Index', 'Check Constraint'],
        correctIndex: 1,
        explanation: 'Primary Key menjamin keunikan setiap record dan tidak boleh bernilai NULL.',
      },
      {
        id: 'bd-pre-2',
        question: 'Tahap normalisasi yang memastikan setiap kolom hanya berisi nilai atomik (tidak berulang) adalah...',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctIndex: 0,
        explanation: 'First Normal Form (1NF) mensyaratkan nilai setiap atribut bersifat atomik dan tidak memiliki repeating group.',
      },
      {
        id: 'bd-pre-3',
        question: 'Perintah SQL untuk mengelompokkan baris hasil sebelum menerapkan fungsi agregat adalah...',
        options: ['ORDER BY', 'GROUP BY', 'DISTINCT', 'UNION'],
        correctIndex: 1,
        explanation: 'GROUP BY mengelompokkan baris berdasarkan nilai kolom tertentu agar fungsi seperti COUNT atau SUM bisa dihitung per kelompok.',
      },
    ],
    posttest: [
      {
        id: 'bd-post-1',
        question: 'Jenis JOIN yang tetap menampilkan seluruh baris dari tabel kiri meskipun tidak ada kecocokan di tabel kanan adalah...',
        options: ['INNER JOIN', 'CROSS JOIN', 'LEFT JOIN', 'SELF JOIN'],
        correctIndex: 2,
        explanation: 'LEFT JOIN mempertahankan seluruh record tabel kiri dan mengisi kolom tabel kanan dengan NULL jika tidak ada padanan.',
      },
      {
        id: 'bd-post-2',
        question: 'Huruf "A" pada prinsip transaksi ACID merupakan singkatan dari...',
        options: ['Availability', 'Atomicity', 'Authentication', 'Aggregation'],
        correctIndex: 1,
        explanation: 'Atomicity menjamin seluruh operasi dalam satu transaksi berhasil tuntas bersama atau dibatalkan seluruhnya.',
      },
      {
        id: 'bd-post-3',
        question: 'Apa dampak utama penambahan terlalu banyak indeks pada tabel yang sering menerima operasi INSERT/UPDATE?',
        options: [
          'Operasi tulis menjadi lebih lambat karena setiap indeks ikut diperbarui',
          'Ukuran Primary Key menjadi otomatis berkurang',
          'Relasi Foreign Key terhapus otomatis',
          'Kueri SELECT tidak bisa memakai klausa WHERE',
        ],
        correctIndex: 0,
        explanation: 'Indeks mempercepat pencarian (SELECT), namun setiap INSERT, UPDATE, dan DELETE harus memperbarui struktur B-Tree indeks.',
      },
    ],
  },
  {
    courseId: 'pemweb-mobile',
    pretest: [
      {
        id: 'pw-pre-1',
        question: 'Ukuran target sentuh minimal yang direkomendasikan agar tombol nyaman ditekan di layar ponsel adalah...',
        options: ['24 × 24 px', '32 × 32 px', '44 × 44 px', '80 × 80 px'],
        correctIndex: 2,
        explanation: 'Standar ergonomi mobile merekomendasikan area tekan minimal 44 × 44 px untuk mencegah salah ketuk.',
      },
      {
        id: 'pw-pre-2',
        question: 'Hook React yang digunakan untuk menyimpan state lokal di dalam komponen fungsional adalah...',
        options: ['useRef', 'useState', 'useMemo', 'useId'],
        correctIndex: 1,
        explanation: 'useState mengembalikan nilai state saat ini beserta fungsi setter untuk memicu render ulang saat nilai berubah.',
      },
    ],
    posttest: [
      {
        id: 'pw-post-1',
        question: 'Mengapa elemen <main> dan <nav> semantik penting dalam pengembangan web modern?',
        options: [
          'Membantu screen reader dan mesin pencari memahami struktur halaman',
          'Menggantikan kebutuhan CSS Flexbox',
          'Membuat file JavaScript lebih kecil otomatis',
          'Menghilangkan kebutuhan HTTPS',
        ],
        correctIndex: 0,
        explanation: 'HTML semantik meningkatkan aksesibilitas navigasi keyboard/pembaca layar serta kejelasan struktur dokumen.',
      },
      {
        id: 'pw-post-2',
        question: 'Mengapa animasi UI sebaiknya hanya mengubah properti transform dan opacity?',
        options: [
          'Karena kedua properti ditangani compositor GPU tanpa memicu reflow layout mahal',
          'Karena CSS tidak mendukung animasi warna',
          'Agar halaman tidak membutuhkan state',
          'Supaya font berubah menjadi monospace',
        ],
        correctIndex: 0,
        explanation: 'Menganimasikan transform dan opacity menghindari kalkulasi ulang geometri layout sehingga frame rate tetap mulus.',
      },
    ],
  },
  {
    courseId: 'algoritma',
    pretest: [
      {
        id: 'alg-pre-1',
        question: 'Prasyarat mutlak agar algoritma Binary Search dapat bekerja dengan benar adalah...',
        options: [
          'Data harus sudah dalam keadaan terurut',
          'Jumlah data harus selalu ganjil',
          'Data hanya boleh berupa huruf',
          'Menggunakan perulangan rekursif saja',
        ],
        correctIndex: 0,
        explanation: 'Binary Search membagi ruang pencarian menjadi dua bagian berdasarkan perbandingan nilai tengah pada data yang terurut.',
      },
      {
        id: 'alg-pre-2',
        question: 'Setiap fungsi rekursif wajib memiliki kondisi berhenti yang disebut...',
        options: ['Loop guard', 'Base case', 'Pivot node', 'Pointer'],
        correctIndex: 1,
        explanation: 'Base case menghentikan pemanggilan diri sendiri agar tidak terjadi stack overflow.',
      },
    ],
    posttest: [
      {
        id: 'alg-post-1',
        question: 'Kompleksitas waktu algoritma Binary Search pada array terurut berukuran n adalah...',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctIndex: 1,
        explanation: 'Setiap iterasi memangkas setengah ruang pencarian sehingga kompleksitasnya adalah O(log n).',
      },
      {
        id: 'alg-post-2',
        question: 'Algoritma pengurutan manakah yang memakai strategi divide-and-conquer dengan kompleksitas stabil O(n log n)?',
        options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'],
        correctIndex: 2,
        explanation: 'Merge Sort membagi array secara rekursif lalu menggabungkannya kembali secara terurut dalam O(n log n).',
      },
    ],
  },
  {
    courseId: 'ui-ux',
    pretest: [
      {
        id: 'ux-pre-1',
        question: 'Tahap paling awal dalam pendekatan Design Thinking adalah...',
        options: ['Prototype', 'Empathize', 'Ideate', 'Test'],
        correctIndex: 1,
        explanation: 'Empathize berfokus memahami kebutuhan, kendala, dan konteks pengguna sebelum merancang solusi.',
      },
      {
        id: 'ux-pre-2',
        question: 'Rasio kontras minimal WCAG AA untuk teks berukuran normal adalah...',
        options: ['2.0 : 1', '3.0 : 1', '4.5 : 1', '10.0 : 1'],
        correctIndex: 2,
        explanation: 'WCAG AA mensyaratkan rasio kontras minimal 4.5:1 untuk teks reguler agar tetap terbaca jelas.',
      },
    ],
    posttest: [
      {
        id: 'ux-post-1',
        question: 'Tujuan utama metode card sorting saat merancang arsitektur informasi adalah...',
        options: [
          'Mengetahui cara pengguna mengelompokkan label menu secara alami',
          'Memilih warna gradasi latar belakang',
          'Menentukan ukuran berkas ikon SVG',
          'Menghitung kecepatan server backend',
        ],
        correctIndex: 0,
        explanation: 'Card sorting membantu desainer menyusun struktur navigasi yang selaras dengan model mental pengguna.',
      },
      {
        id: 'ux-post-2',
        question: 'Dalam prinsip aksesibilitas UI, mengapa status error tidak boleh hanya ditandai warna merah?',
        options: [
          'Pengguna dengan gangguan penglihatan warna tetap membutuhkan teks atau ikon penjelas',
          'Warna merah membuat CSS lebih berat',
          'Browser mobile menghapus warna merah otomatis',
          'Agar tidak perlu menulis pesan validasi',
        ],
        correctIndex: 0,
        explanation: 'Menggabungkan warna dengan ikon dan pesan teks memastikan semua pengguna memahami status sistem.',
      },
    ],
  },
  {
    courseId: 'pemodelan-pl',
    pretest: [
      {
        id: 'ppl-pre-1',
        question: 'Diagram UML yang paling tepat untuk menggambarkan interaksi aktor dengan layanan sistem adalah...',
        options: ['Use Case Diagram', 'Deployment Diagram', 'Component Diagram', 'Object Diagram'],
        correctIndex: 0,
        explanation: 'Use Case Diagram memodelkan aktor eksternal dan fitur-fitur fungsional utama yang disediakan sistem.',
      },
      {
        id: 'ppl-pre-2',
        question: 'Kebutuhan seperti "Halaman harus memuat di bawah 1,5 detik" termasuk kategori...',
        options: ['Kebutuhan Fungsional', 'Kebutuhan Non-Fungsional', 'Aktor Sistem', 'Use Case'],
        correctIndex: 1,
        explanation: 'Atribut kualitas seperti performa, keamanan, dan ketersediaan termasuk kebutuhan non-fungsional.',
      },
    ],
    posttest: [
      {
        id: 'ppl-post-1',
        question: 'Pada Class Diagram, relasi kepemilikan kuat di mana bagian ikut terhapus bila induk dihapus disebut...',
        options: ['Asosiasi biasa', 'Agregasi', 'Komposisi', 'Generalisasi'],
        correctIndex: 2,
        explanation: 'Komposisi (belah ketupat penuh) menunjukkan siklus hidup objek anak bergantung sepenuhnya pada objek induk.',
      },
      {
        id: 'ppl-post-2',
        question: 'Diagram UML yang menekankan urutan kronologis pertukaran pesan antar objek adalah...',
        options: ['Sequence Diagram', 'Package Diagram', 'Use Case Diagram', 'ER Diagram'],
        correctIndex: 0,
        explanation: 'Sequence Diagram memvisualisasikan alur pemanggilan pesan dari atas ke bawah berdasarkan urutan waktu.',
      },
    ],
  },
];

export const INITIAL_THREADS: DiscussionThread[] = [
  {
    id: 'disc-1',
    courseId: 'pbo',
    courseTitle: 'Pemrograman Berorientasi Objek',
    chapterLabel: 'Bab 3 · Enkapsulasi',
    title: 'Perbedaan penggunaan protected dan default modifier saat inheritance antar package',
    body: 'Halo semuanya, silakan diskusikan kasus di mana atribut protected lebih aman daripada public ketika kita merancang hierarki kelas Mahasiswa dan Dosen di package berbeda.',
    authorName: 'Dr. Andi Saputra',
    authorInitials: 'AS',
    authorRole: 'dosen',
    createdAt: '2 jam lalu',
    timestampMs: Date.now() - 2 * 3600 * 1000,
    views: 48,
    replies: [
      {
        id: 'rep-1',
        authorName: 'Alimiana',
        authorInitials: 'AL',
        authorRole: 'mahasiswa',
        body: 'Dengan protected, subclass di package lain tetap bisa mengakses method utilitas induk tanpa membukanya ke seluruh kelas luar.',
        createdAt: '1 jam lalu',
      },
      {
        id: 'rep-2',
        authorName: 'Rafi Pratama',
        authorInitials: 'RP',
        authorRole: 'mahasiswa',
        body: 'Setuju, Pak. Untuk atribut sensitif seperti nilai akhir tetap private dan diakses lewat getter/setter protected bila perlu.',
        createdAt: '45 mnt lalu',
      },
    ],
  },
  {
    id: 'disc-2',
    courseId: 'basis-data',
    courseTitle: 'Basis Data',
    chapterLabel: 'Bab 3 · Normalisasi Data',
    title: 'Apakah tabel KRS mahasiswa perlu dipecah ke 3NF jika sudah menyimpan kode mata kuliah?',
    body: 'Saya masih bingung membedakan ketergantungan parsial (2NF) dan ketergantungan transitif (3NF) pada studi kasus tabel nilai dan dosen pengampu.',
    authorName: 'Nadia Kusuma',
    authorInitials: 'NK',
    authorRole: 'mahasiswa',
    createdAt: '5 jam lalu',
    timestampMs: Date.now() - 5 * 3600 * 1000,
    views: 34,
    replies: [
      {
        id: 'rep-3',
        authorName: 'Ir. Rina Wijaya',
        authorInitials: 'RW',
        authorRole: 'dosen',
        body: 'Bagus pertanyaannya! Jika nama dosen bergantung pada kode mata kuliah (bukan langsung ke primary key KRS), itu ketergantungan transitif sehingga wajib dipisah ke tabel MataKuliah (3NF).',
        createdAt: '4 jam lalu',
      },
    ],
  },
  {
    id: 'disc-3',
    courseId: 'pemweb-mobile',
    courseTitle: 'Pemrograman Web dan Perangkat Bergerak',
    chapterLabel: 'Bab 4 · Mobile Ergonomics',
    title: 'Tips menghindari horizontal overflow pada kartu jadwal di layar 390px',
    body: 'Saat menguji tampilan ponsel 390px, teks judul mata kuliah yang panjang kadang mendorong lebar kartu. Ada rekomendasi class Tailwind yang paling bersih?',
    authorName: 'Bagas Mahendra',
    authorInitials: 'BM',
    authorRole: 'mahasiswa',
    createdAt: '1 hari lalu',
    timestampMs: Date.now() - 24 * 3600 * 1000,
    views: 62,
    replies: [
      {
        id: 'rep-4',
        authorName: 'Budi Hartono, M.T.',
        authorInitials: 'BH',
        authorRole: 'dosen',
        body: 'Pastikan container flex memiliki min-w-0 pada anak teksnya dan gunakan truncate atau break-words bila judul bersifat dinamis.',
        createdAt: '20 jam lalu',
      },
    ],
  },
  {
    id: 'disc-4',
    courseId: 'ui-ux',
    courseTitle: 'Desain Industri & UI/UX',
    chapterLabel: 'Bab 4 · Aksesibilitas',
    title: 'Standar jarak antar kartu dan padding kontainer agar tampilan tidak terasa sesak',
    body: 'Bagaimana menentukan proporsi padding kartu dibanding jarak antar kartu pada halaman dashboard pembelajaran?',
    authorName: 'Dimas Prakoso, M.Ds.',
    authorInitials: 'DP',
    authorRole: 'dosen',
    createdAt: '2 hari lalu',
    timestampMs: Date.now() - 48 * 3600 * 1000,
    views: 75,
    replies: [],
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Pretest PBO Tersedia',
    titleEn: 'OOP Pretest Available',
    body: 'Selesaikan Pretest Pemrograman Berorientasi Objek sebelum kuliah Senin dimulai (+40 XP).',
    bodyEn: 'Complete the Object-Oriented Programming Pretest before Monday class (+40 XP).',
    time: '15 mnt lalu',
    read: false,
    targetTab: 'dashboard',
  },
  {
    id: 'notif-2',
    title: 'Balasan Baru dari Dr. Andi Saputra',
    titleEn: 'New Reply from Dr. Andi Saputra',
    body: 'Dosen menanggapi diskusi Bab 3 Enkapsulasi di forum Pemrograman Berorientasi Objek.',
    bodyEn: 'Lecturer replied to the Chapter 3 Encapsulation thread in OOP discussion.',
    time: '1 jam lalu',
    read: false,
    targetTab: 'diskusi',
  },
];

export const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'tgs-pbo-1',
    courseId: 'pbo',
    chapterLabel: 'Bab 3 · Enkapsulasi',
    title: 'Implementasi Enkapsulasi & Validasi Nilai Mahasiswa',
    titleEn: 'Implementing Encapsulation & Student Grade Validation',
    summary: 'Buat kelas NilaiMahasiswa dengan atribut private, getter/setter bervalidasi, dan uji kasus batas 0–100.',
    summaryEn: 'Create a NilaiMahasiswa class with private fields, validated getter/setter methods, and 0–100 boundary tests.',
    instructions:
      '1. Buat kelas NilaiMahasiswa dengan atribut private nama, nim, dan skorAkhir.\n2. Tambahkan validasi pada method setSkorAkhir() agar hanya menerima nilai rentang 0 sampai 100.\n3. Lampirkan kode sumber (.java) atau tautan repositori GitHub beserta tangkapan layar hasil eksekusi.',
    instructionsEn:
      '1. Create a NilaiMahasiswa class with private attributes nama, nim, and skorAkhir.\n2. Add validation inside setSkorAkhir() so it only accepts values between 0 and 100.\n3. Attach the source code (.java) or GitHub repository link along with execution screenshots.',
    deadline: 'Senin, 30 Nov 2026 · 23.59 WIB',
    deadlineEn: 'Mon, Nov 30, 2026 · 23:59 WIB',
  },
  {
    id: 'tgs-pbo-2',
    courseId: 'pbo',
    chapterLabel: 'Bab 5 · Polimorfisme dan Abstraksi',
    title: 'Desain Interface Penilaian Akademik',
    titleEn: 'Academic Assessment Interface Design',
    summary: 'Rancang kontrak interface Penilaian yang diimplementasikan oleh kelas Kuis, Tugas, dan Ujian.',
    summaryEn: 'Design a Penilaian interface contract implemented by Kuis, Tugas, and Ujian classes.',
    instructions:
      '1. Definisikan interface Penilaian dengan method hitungNilaiAkhir() dan getPredikat().\n2. Implementasikan pada minimal dua kelas turunan berbeda.\n3. Jelaskan keuntungan runtime polymorphism pada kasus ini secara singkat.',
    instructionsEn:
      '1. Define a Penilaian interface with hitungNilaiAkhir() and getPredikat() methods.\n2. Implement it across at least two distinct subclasses.\n3. Briefly explain the benefits of runtime polymorphism in this case.',
    deadline: 'Jumat, 4 Des 2026 · 23.59 WIB',
    deadlineEn: 'Fri, Dec 4, 2026 · 23:59 WIB',
  },
  {
    id: 'tgs-bd-1',
    courseId: 'basis-data',
    chapterLabel: 'Bab 2 · Entity Relationship Diagram',
    title: 'Pemodelan ERD Sistem Informasi Perpustakaan Kampus',
    titleEn: 'Campus Library Information System ERD Modeling',
    summary: 'Susun diagram ERD lengkap dengan kardinalitas relasi 1:N dan M:N beserta skema tabel relasional.',
    summaryEn: 'Build a complete ERD diagram with 1:N and M:N cardinalities along with its relational table schema.',
    instructions:
      '1. Identifikasi entitas Anggota, Buku, Peminjaman, dan Petugas.\n2. Tentukan Primary Key, Foreign Key, serta atribut relasi peminjaman.\n3. Unggah diagram dalam format PDF/gambar atau tautan Figma/Draw.io.',
    instructionsEn:
      '1. Identify Member, Book, Borrowing, and Staff entities.\n2. Define Primary Keys, Foreign Keys, and borrowing relation attributes.\n3. Upload the diagram as PDF/image or share a Figma/Draw.io link.',
    deadline: 'Rabu, 2 Des 2026 · 23.59 WIB',
    deadlineEn: 'Wed, Dec 2, 2026 · 23:59 WIB',
  },
  {
    id: 'tgs-bd-2',
    courseId: 'basis-data',
    chapterLabel: 'Bab 4 · Kueri SQL Lanjutan & Join',
    title: 'Optimasi Kueri Agregasi & Multi-Table JOIN',
    titleEn: 'Multi-Table JOIN & Aggregation Query Optimization',
    summary: 'Tulis 5 kueri SQL analitis menggunakan LEFT JOIN, GROUP BY, HAVING, dan CTE.',
    summaryEn: 'Write 5 analytical SQL queries utilizing LEFT JOIN, GROUP BY, HAVING, and CTE.',
    instructions:
      '1. Gunakan skema tabel mahasiswa, krs, dan matakuliah.\n2. Tampilkan daftar mahasiswa beserta jumlah SKS yang diambil.\n3. Sertakan kueri SQL beserta output tabel hasil pengujian.',
    instructionsEn:
      '1. Use the mahasiswa, krs, and matakuliah table schemas.\n2. Output each student along with their total enrolled credits.\n3. Include SQL scripts and screenshot/text output of query results.',
    deadline: 'Senin, 7 Des 2026 · 23.59 WIB',
    deadlineEn: 'Mon, Dec 7, 2026 · 23:59 WIB',
  },
  {
    id: 'tgs-pw-1',
    courseId: 'pemweb-mobile',
    chapterLabel: 'Bab 2 · Komponen React & State',
    title: 'Komponen Daftar Tugas Interaktif Berbasis State',
    titleEn: 'Stateful Interactive Task List Component',
    summary: 'Bangun komponen React responsif dengan filter status, pencarian kata kunci, dan penyimpanan lokal.',
    summaryEn: 'Build a responsive React component with status filters, keyword search, and local persistence.',
    instructions:
      '1. Gunakan functional component dan hooks useState + useEffect.\n2. Pastikan ukuran target sentuh tombol minimal 44px untuk layar ponsel.\n3. Kirim tautan repositori GitHub atau pratinjau deploy.',
    instructionsEn:
      '1. Use functional components with useState and useEffect hooks.\n2. Ensure interactive touch targets are at least 44px for mobile screens.\n3. Submit the GitHub repository link or live preview URL.',
    deadline: 'Selasa, 1 Des 2026 · 23.59 WIB',
    deadlineEn: 'Tue, Dec 1, 2026 · 23:59 WIB',
  },
  {
    id: 'tgs-pw-2',
    courseId: 'pemweb-mobile',
    chapterLabel: 'Bab 3 · Integrasi REST API',
    title: 'Konsumsi REST API Katalog Mata Kuliah (Async/Await)',
    titleEn: 'Course Catalog REST API Integration (Async/Await)',
    summary: 'Implementasikan pengambilan data JSON asinkron lengkap dengan indikator loading dan penanganan error.',
    summaryEn: 'Implement asynchronous JSON fetching with proper loading skeleton and error handling states.',
    instructions:
      '1. Gunakan fetch dengan blok try/catch pada fungsi async.\n2. Tangani kondisi jaringan lambat dan respons gagal tanpa crash.\n3. Tuliskan catatan arsitektur singkat atau lampirkan link kode.',
    instructionsEn:
      '1. Use fetch inside an async function wrapped in try/catch.\n2. Gracefully handle slow networks and error responses.\n3. Provide brief architecture notes or attach your code link.',
    deadline: 'Selasa, 8 Des 2026 · 23.59 WIB',
    deadlineEn: 'Tue, Dec 8, 2026 · 23:59 WIB',
  },
  {
    id: 'tgs-alg-1',
    courseId: 'algoritma',
    chapterLabel: 'Bab 3 · Array, String & Rekursif',
    title: 'Latihan Implementasi Fungsi Rekursif & Tracing Array',
    titleEn: 'Recursive Function & Array Tracing Exercise',
    summary: 'Bandingkan efisiensi pendekatan iteratif dan rekursif pada kasus pencarian nilai maksimum & faktorial.',
    summaryEn: 'Compare iterative vs recursive approaches for maximum value lookup and factorial computation.',
    instructions:
      '1. Tuliskan pseudocode dan implementasi fungsi rekursif dengan base case yang jelas.\n2. Buat tabel penelusuran (tracing) pemanggilan fungsi untuk n = 5.\n3. Unggah dokumen jawaban atau tulis langsung di kolom jawaban.',
    instructionsEn:
      '1. Write pseudocode and recursive function code with an explicit base case.\n2. Create a call-stack trace table for n = 5.\n3. Upload your answer document or enter it directly in the answer field.',
    deadline: 'Rabu, 2 Des 2026 · 23.59 WIB',
    deadlineEn: 'Wed, Dec 2, 2026 · 23:59 WIB',
  },
  {
    id: 'tgs-alg-2',
    courseId: 'algoritma',
    chapterLabel: 'Bab 4 · Pencarian & Pengurutan',
    title: 'Analisis Perbandingan Binary Search vs Linear Search',
    titleEn: 'Comparative Analysis: Binary Search vs Linear Search',
    summary: 'Uji jumlah iterasi kedua algoritma pada dataset 100, 1.000, dan 10.000 elemen terurut.',
    summaryEn: 'Benchmark iteration counts of both algorithms on sorted datasets of 100, 1,000, and 10,000 items.',
    instructions:
      '1. Catat jumlah langkah perbandingan terburuk (worst-case).\n2. Kaitkan hasil pengukuran dengan notasi kompleksitas O(n) dan O(log n).\n3. Lampirkan tabel ringkasan hasil uji.',
    instructionsEn:
      '1. Record worst-case comparison steps.\n2. Relate measured results to O(n) and O(log n) complexity.\n3. Attach a summary table of your benchmark results.',
    deadline: 'Rabu, 9 Des 2026 · 23.59 WIB',
    deadlineEn: 'Wed, Dec 9, 2026 · 23:59 WIB',
  },
  {
    id: 'tgs-ux-1',
    courseId: 'ui-ux',
    chapterLabel: 'Bab 3 · Wireframing & Tata Letak Grid',
    title: 'Wireframe Aplikasi Akademik Berbasis Grid 8pt',
    titleEn: '8pt-Grid Academic App Wireframe',
    summary: 'Buat wireframe low-fidelity halaman Jadwal & Tugas untuk ukuran viewport 390px dengan spasi konsisten.',
    summaryEn: 'Create a low-fidelity wireframe for the Schedule & Assignments screens on a 390px mobile viewport.',
    instructions:
      '1. Gunakan skala jarak kelipatan 4px/8px secara konsisten.\n2. Hindari kepadatan kartu yang berlebihan; jaga hierarki visual utama.\n3. Bagikan tautan Figma atau unggah ekspor gambar PNG/PDF.',
    instructionsEn:
      '1. Apply consistent 4px/8px spacing increments.\n2. Avoid cluttered card density and maintain a clear primary visual hierarchy.\n3. Share your Figma link or attach PNG/PDF exports.',
    deadline: 'Kamis, 3 Des 2026 · 23.59 WIB',
    deadlineEn: 'Thu, Dec 3, 2026 · 23:59 WIB',
  },
  {
    id: 'tgs-ux-2',
    courseId: 'ui-ux',
    chapterLabel: 'Bab 5 · Usability Testing',
    title: 'Laporan Uji Ketergunaan (Usability Testing) 3 Responden',
    titleEn: 'Usability Testing Report (3 Participants)',
    summary: 'Lakukan evaluasi 3 skenario tugas pada prototipe UI dan susun daftar temuan perbaikan.',
    summaryEn: 'Conduct a 3-task usability evaluation on your UI prototype and document prioritized improvements.',
    instructions:
      '1. Susun skenario uji tanpa mengarahkan langkah responden.\n2. Catat tingkat keberhasilan tugas serta kendala yang muncul.\n3. Ringkas 3 rekomendasi perbaikan prioritas tinggi.',
    instructionsEn:
      '1. Prepare unbiased task scenarios.\n2. Record task completion rate and observed friction points.\n3. Summarize 3 high-priority UI refinements.',
    deadline: 'Kamis, 10 Des 2026 · 23.59 WIB',
    deadlineEn: 'Thu, Dec 10, 2026 · 23:59 WIB',
  },
  {
    id: 'tgs-ppl-1',
    courseId: 'pemodelan-pl',
    chapterLabel: 'Bab 2 · Use Case & Activity Diagram',
    title: 'Pemodelan Use Case & Skenario Presensi QR Mahasiswa',
    titleEn: 'Use Case & Scenario Modeling: Student QR Attendance',
    summary: 'Gambarkan aktor Mahasiswa dan Dosen beserta relasi include/extend pada fitur presensi kelas.',
    summaryEn: 'Diagram Student and Lecturer actors with include/extend relationships for class QR attendance.',
    instructions:
      '1. Sertakan Use Case Diagram serta 1 tabel skenario main flow & alternate flow.\n2. Gunakan Swimlane pada Activity Diagram untuk memisahkan alur Mahasiswa dan Sistem.\n3. Lampirkan berkas diagram atau tautan editor UML.',
    instructionsEn:
      '1. Include a Use Case Diagram plus 1 scenario table covering main and alternate flows.\n2. Use swimlanes in the Activity Diagram to separate Student and System actions.\n3. Attach diagram file or UML editor link.',
    deadline: 'Jumat, 4 Des 2026 · 23.59 WIB',
    deadlineEn: 'Fri, Dec 4, 2026 · 23:59 WIB',
  },
  {
    id: 'tgs-ppl-2',
    courseId: 'pemodelan-pl',
    chapterLabel: 'Bab 3 · Class Diagram',
    title: 'Perancangan Class Diagram Domain LMS Kampus',
    titleEn: 'Campus LMS Domain Class Diagram Design',
    summary: 'Petakan kelas MataKuliah, ModulBab, Tugas, dan Pengumpulan beserta multiplisitas dan visibilitasnya.',
    summaryEn: 'Map MataKuliah, ModulBab, Tugas, and Pengumpulan classes with multiplicity and visibility markers.',
    instructions:
      '1. Tentukan jenis relasi asosiasi, agregasi, atau komposisi dengan tepat.\n2. Lengkapi tipe data atribut dan method utama tiap kelas.\n3. Kirim tautan diagram atau ringkasan relasi di kolom jawaban.',
    instructionsEn:
      '1. Specify association, aggregation, or composition relationships accurately.\n2. Include attribute data types and core methods for each class.\n3. Submit the diagram link or summarize class relations in the answer box.',
    deadline: 'Jumat, 11 Des 2026 · 23.59 WIB',
    deadlineEn: 'Fri, Dec 11, 2026 · 23:59 WIB',
  },
];

export const MANUAL_BOOK_SECTIONS = [
  {
    title: '1. Memulai & Navigasi Portal',
    titleEn: '1. Getting Started & Portal Navigation',
    body: 'Gunakan lima tab utama (Dashboard, Kelas, Materi, Diskusi, Profil) di bagian bawah pada ponsel atau sidebar kiri di layar desktop untuk berpindah antar modul dengan cepat.',
    bodyEn: 'Use the five primary tabs (Dashboard, Classes, Materials, Discussion, Profile) at the bottom on mobile or left sidebar on desktop to switch modules effortlessly.',
  },
  {
    title: '2. Sistem Level & XP Belajar',
    titleEn: '2. Level & Learning XP System',
    body: 'Membuka modul bab memberi +25 XP, mengunduh materi +15 XP, menonton video belajar di YouTube +30 XP, mengirim Tugas +35 XP, Pretest +40 XP, Posttest +60 XP, dan berdiskusi +15 XP/topik atau +10 XP/balasan. Tersedia pula Check-in XP Harian selama 7 hari.',
    bodyEn: 'Opening a chapter module grants +25 XP, downloading a module +15 XP, watching study videos on YouTube +30 XP, submitting an Assignment +35 XP, Pretest +40 XP, Posttest +60 XP, and participating in discussions +15 XP/topic or +10 XP/reply, plus a 7-day Daily XP Check-in.',
  },
  {
    title: '3. Alur Belajar Ideal per Mata Kuliah',
    titleEn: '3. Recommended Study Flow',
    body: 'Mulai dengan Pretest untuk mengukur pemahaman awal, pelajari serta unduh Bab 1–5 dan kerjakan Tugas di menu Materi, tonton Video Belajar di YouTube, berdiskusi jika ada kendala, lalu tutup dengan Posttest.',
    bodyEn: 'Start with the Pretest to gauge baseline knowledge, study and download Chapters 1–5 and submit Assignments in Materials, watch Study Videos on YouTube, discuss questions in the forum, and finish with the Posttest.',
  },
  {
    title: '4. Presensi QR & Pengumpulan Tugas',
    titleEn: '4. QR Attendance & Assignment Submission',
    body: 'Buka tab Kelas untuk memindai QR Presensi dosen dengan kamera mahasiswa, memantau rekap kehadiran per mata kuliah, atau langsung mengakses halaman Tugas pada mata kuliah terkait.',
    bodyEn: 'Open the Classes tab to scan your lecturer’s attendance QR with the student scanner, track meeting attendance, or jump directly to course Assignments.',
  },
];
