import type { SubtestId } from "./components/SubtestIllustration";

export type Subtest = {
  id: SubtestId;
  name: string;
  color: string;
  /** Demo mastery value for the illustrative Rapot card. */
  mastery: number;
  /** Demo recommendation shown when the subtest is selected. */
  focus: string;
};

// Colours: "Identitas warna subtest" (Figma 4:23275).
export const SUBTESTS: Subtest[] = [
  { id: "PK", name: "Pengetahuan Kuantitatif", color: "#ffc83d", mastery: 82, focus: "Logaritma · Fungsi" },
  { id: "PU", name: "Penalaran Umum", color: "#c0c7d6", mastery: 68, focus: "Silogisme · Pola bilangan" },
  { id: "PPU", name: "Pengetahuan & Pemahaman Umum", color: "#22d3ee", mastery: 57, focus: "Makna kata · Kalimat efektif" },
  { id: "PBM", name: "Pemahaman Bacaan & Menulis", color: "#c084fc", mastery: 74, focus: "Ide pokok · Ejaan" },
  { id: "LBI", name: "Literasi Bahasa Indonesia", color: "#84cc16", mastery: 63, focus: "Teks argumentasi" },
  { id: "LBE", name: "Literasi Bahasa Inggris", color: "#f59e0b", mastery: 41, focus: "Main idea · Inference" },
  { id: "PM", name: "Penalaran Matematika", color: "#facc15", mastery: 35, focus: "Peluang · Statistika" },
];

export type Product = {
  id: "utbk" | "tka" | "kuliah" | "private";
  name: string;
  audience: string;
  tagline: string;
  description: string;
  points: string[];
  href: string;
  accent: string;
};

// Sub-kategori Gradient. TKA & Private belum punya URL final → "#".
export const PRODUCTS: Product[] = [
  {
    id: "utbk",
    name: "Gradient UTBK",
    audience: "SMA kelas 12 & gap year",
    tagline: "Tembus PTN impianmu",
    description:
      "Persiapan SNBT dengan materi dari mahasiswa top universitas, Try Out rutin, dan Mastery per subtes.",
    points: ["Latihan soal adaptif 7 subtes", "Try Out rutin + pembahasan", "Rapot mastery tiap chapter"],
    href: "https://gradient.academy/utbk",
    accent: "#8753f5",
  },
  {
    id: "tka",
    name: "Gradient TKA",
    audience: "Siswa SMA",
    tagline: "Siap Tes Kemampuan Akademik",
    description:
      "Latihan terarah untuk Tes Kemampuan Akademik: materi inti, bank soal, dan simulasi tes yang menyesuaikan kemampuanmu.",
    points: ["Materi wajib & pilihan", "Simulasi TKA berwaktu", "Analisis kekuatan per mapel"],
    href: "#",
    accent: "#22d3ee",
  },
  {
    id: "kuliah",
    name: "Gradient Kuliah",
    audience: "Mahasiswa",
    tagline: "Raih IPK idaman",
    description:
      "Video dari dosen universitas top, rangkuman, dan pembahasan soal, ditemani AI Copilot untuk bantu belajar kapan saja.",
    points: ["Video dosen top universitas", "Latihan soal + pembahasan", "AI Copilot untuk tanya materi"],
    href: "/",
    accent: "#84cc16",
  },
  {
    id: "private",
    name: "Gradient Private",
    audience: "Siswa ambisius",
    tagline: "Kelas privat eksklusif",
    description:
      "Kelas privat dengan tutor terpilih untuk bantu kamu tembus nilai tinggi, jalur kuliah favorit, dan olimpiade.",
    points: ["Tutor terpilih & terkurasi", "Jadwal fleksibel", "Rencana belajar personal"],
    href: "#",
    accent: "#ffc83d",
  },
];
