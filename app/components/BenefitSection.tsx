"use client";

import { useEffect, useState } from "react";
import BenefitCard from "./BenefitCard";

const benefits = [
  {
    tag: "Kelas",
    title: "200.000+ Video Materi dari Dosen Top Universitas",
    description: "Diajarkan oleh dosen yang ahli di berbagai bidang dan jurusan",
    linkText: "Lihat Daftar Kelas",
    accentColor: "#5F2BCE",
    variant: "lottie" as const,
    showPlayIcon: true,
  },
  {
    tag: "Try out",
    title: "Tryout Asli UTBK (IRT)",
    description:
      "Simulasi ujian dengan format yang sama persis dengan UTBK asli. Menggunakan sistem penilaian Item Response Theory (IRT) untuk akurasi skor tinggi.",
    linkText: "Apa itu IRT?",
    accentColor: "#5F2BCE",
  },
  {
    tag: "Assistant",
    title: "Copilot AI Assistant",
    description:
      "Asisten belajar pribadi berbasis AI yang siap membantumu. Tanyakan soal sulit atau minta penjelasan materi yang belum kamu pahami!",
    linkText: "",
    accentColor: "#36236A",
    variant: "lottie" as const,
    tagIcon: "/assets/copilot-icon.svg",
    copilotStyle: true,
  },
  {
    tag: "Analytics",
    title: "Analisis Performa Belajar",
    description:
      "Pantau perkembangan belajarmu dengan dashboard analytics yang komprehensif. Identifikasi kekuatan dan kelemahan untuk belajar lebih efektif.",
    linkText: "Lihat Analytics",
    accentColor: "#5F2BCE",
  },
];

export default function BenefitSection() {
  const [lecturerAnimation, setLecturerAnimation] = useState<object | null>(null);
  const [copilotAnimation, setCopilotAnimation] = useState<object | null>(null);

  useEffect(() => {
    fetch("/assets/lecturer.json")
      .then((res) => res.json())
      .then((data) => setLecturerAnimation(data))
      .catch((err) => console.error("Failed to load lecturer animation:", err));

    fetch("/assets/copilot.json")
      .then((res) => res.json())
      .then((data) => setCopilotAnimation(data))
      .catch((err) => console.error("Failed to load copilot animation:", err));
  }, []);

  return (
    <section className="w-full bg-bg-black py-20">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[60px]">
        {/* Heading */}
        <div className="animate-initial:opacity-0 animate-initial:y-10 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-600 flex flex-col gap-4 items-center text-center max-w-[900px] mx-auto mb-12">
          <h2 className="text-[30px] font-bold text-white leading-tight">
            Semua yang kamu butuhkan untuk raih IPK idaman
          </h2>
          <p className="text-lg text-gray-text leading-relaxed">
          Tingkatkan Pengalaman Belajar dengan Fitur-Fitur Gradient
          </p>
        </div>

        {/* Cards Grid - Staggered scroll animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First row - Kelas card with Lottie animation */}
          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-500 animate-delay-0">
            <BenefitCard
              {...benefits[0]}
              lottieData={lecturerAnimation ?? undefined}
              className="h-[500px] md:h-[680px]"
            />
          </div>
          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-500 animate-delay-100">
            <BenefitCard {...benefits[1]} className="h-full min-h-[380px]" />
          </div>

          {/* Second row */}
          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-500 animate-delay-200">
            <BenefitCard
              {...benefits[2]}
              lottieData={copilotAnimation ?? undefined}
              className="h-[500px] md:h-[680px]"
            />
          </div>
          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-500 animate-delay-300">
            <BenefitCard {...benefits[3]} className="h-full min-h-[380px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
