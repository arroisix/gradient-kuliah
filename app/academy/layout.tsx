import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-nunito-var",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito-sans-var",
});

export const metadata: Metadata = {
  title: "Gradient Academy – Belajar sesuai kekuatanmu",
  description:
    "Gradient hadir untuk mencerdaskan bangsa: belajar adaptif dengan Mastery, materi dari dosen kampus top, untuk siswa dan mahasiswa dari mana saja. UTBK, TKA, Kuliah, dan Private.",
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${nunito.variable} ${nunitoSans.variable} font-nunito-sans bg-gm-bg text-white`}>
      {children}
    </div>
  );
}
