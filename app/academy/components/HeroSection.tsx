import { ArrowDown } from "lucide-react";
import SubtestIllustration from "./SubtestIllustration";
import { ExpChip, ExpToast, LevelChip, LipButton, MasteryBar, StreakChip, Eyebrow } from "./ui";
import { SUBTESTS } from "../data";

function RapotCard() {
  const rows = SUBTESTS.slice(0, 4);
  return (
    <div className="w-[300px] rounded-[20px] border-2 border-gm-line bg-gm-surface p-5 shadow-[0_40px_80px_-30px_rgba(95,43,206,0.55)] sm:w-[340px]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-nunito text-[18px] font-black">Rapot Mastery</p>
          <p className="text-[12px] text-gm-muted">Minggu ini · 4 subtes naik</p>
        </div>
        <span className="rounded-full bg-gm-mint/15 px-2.5 py-1 font-nunito text-[12px] font-extrabold text-gm-mint">
          +12%
        </span>
      </div>
      <ul className="flex flex-col gap-3.5">
        {rows.map((s) => (
          <li key={s.id} className="flex items-center gap-3">
            <SubtestIllustration id={s.id} size={36} />
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <span className="truncate font-nunito text-[13px] font-extrabold">{s.name}</span>
                <span className="font-nunito text-[12px] font-black" style={{ color: s.color }}>
                  {s.mastery}%
                </span>
              </div>
              <MasteryBar value={s.mastery} color={s.color} className="h-2" />
            </div>
          </li>
        ))}
      </ul>
      <LipButton href="#mastery" size="sm" className="mt-5 w-full">
        Lanjut latihan PM
      </LipButton>
    </div>
  );
}

function StreakWeek() {
  const days = ["S", "S", "R", "K", "J", "S", "M"];
  return (
    <div className="w-[220px] rounded-[18px] border-2 border-gm-line bg-[#1d1a29] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-nunito text-[14px] font-black">Streak 7 hari</span>
        <span className="text-[11px] font-semibold text-gm-brand-300">Reset 24.00</span>
      </div>
      <div className="flex justify-between">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span
              className={`grid size-6 place-items-center rounded-full text-[11px] ${
                i < 6 ? "bg-gradient-to-b from-[#ffb36b] to-[#ff4d3d] text-white" : "border-2 border-dashed border-white/20 text-white/40"
              }`}
            >
              {i < 6 ? "✓" : ""}
            </span>
            <span className="text-[10px] font-bold text-gm-muted">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
      {/* Raycast-style brand glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-240px] h-[640px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(95,43,206,0.45),rgba(95,43,206,0.08)_60%,transparent)]" />
        <div className="absolute right-[-200px] top-[320px] h-[420px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 px-4 md:px-6 lg:grid-cols-[1.05fr_1fr]">
        {/* Copy */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <Eyebrow>🇮🇩 Gerakan belajar untuk Indonesia</Eyebrow>
          <h1 className="mt-6 font-nunito text-[42px] font-black leading-[1.02] tracking-[-0.03em] text-balance sm:text-[56px] lg:text-[68px]">
            Mencerdaskan bangsa,{" "}
            <span className="bg-gradient-to-r from-[#cdaff6] via-[#b285f0] to-[#8753f5] bg-clip-text text-transparent">
              satu level
            </span>{" "}
            setiap hari.
          </h1>
          <p className="mt-6 max-w-[540px] text-[17px] leading-relaxed text-gm-muted md:text-[19px]">
            Gradient adalah platform belajar yang menyesuaikan diri dengan kekuatan tiap siswa. Dari persiapan UTBK dan
            TKA sampai kuliah, semua diajar oleh dosen dan mahasiswa kampus top Indonesia.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <LipButton href="#produk" size="lg">
              Mulai belajar gratis
            </LipButton>
            <LipButton href="#mastery" variant="subtle" size="lg">
              Lihat cara kerjanya
              <ArrowDown className="size-4" />
            </LipButton>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] text-gm-muted lg:justify-start">
            <span>
              <b className="font-nunito font-black text-white">200.000+</b> pelajar
            </span>
            <span className="hidden size-1 rounded-full bg-white/20 sm:block" />
            <span>
              <b className="font-nunito font-black text-white">200.000+</b> video materi
            </span>
            <span className="hidden size-1 rounded-full bg-white/20 sm:block" />
            <span>Dosen top universitas</span>
          </div>
        </div>

        {/* Product collage */}
        <div className="relative mx-auto h-[520px] w-full max-w-[520px] sm:h-[560px]">
          <div className="absolute left-1/2 top-0 -translate-x-1/2">
            <div className="flex gap-2 animate-[gm-float_6s_ease-in-out_infinite]">
              <StreakChip />
              <ExpChip />
              <LevelChip />
            </div>
          </div>
          <div className="absolute left-1/2 top-[64px] -translate-x-1/2">
            <RapotCard />
          </div>
          <div className="absolute -left-2 bottom-[46px] hidden animate-[gm-float_7s_ease-in-out_infinite_0.6s] sm:block">
            <StreakWeek />
          </div>
          <div className="absolute right-0 top-[452px] animate-[gm-float_5.5s_ease-in-out_infinite_1.2s] sm:right-[-12px] sm:top-[462px]">
            <ExpToast amount="+40 EXP" caption="Khatam bab Logaritma" />
          </div>
        </div>
      </div>
    </section>
  );
}
