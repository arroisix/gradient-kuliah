"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import SubtestIllustration from "./SubtestIllustration";
import { LipButton, MasteryBar, SectionHeading } from "./ui";
import { SUBTESTS } from "../data";

const STEPS = [
  {
    title: "Tes diagnostik singkat",
    body: "Kerjakan beberapa soal per subtes supaya Gradient tahu titik awalmu.",
  },
  {
    title: "Latihan adaptif",
    body: "Soal menyesuaikan level kamu: tidak terlalu mudah, tidak bikin menyerah.",
  },
  {
    title: "Rapot & rekomendasi",
    body: "Lihat progres mastery tiap chapter dan langsung tahu apa yang perlu dilatih berikutnya.",
  },
];

function level(m: number) {
  if (m >= 80) return { label: "Hampir Master", tone: "#2dd4a7" };
  if (m >= 60) return { label: "Berkembang", tone: "#b285f0" };
  return { label: "Perlu dilatih", tone: "#ff6a5c" };
}

export default function MasterySection() {
  const weakest = [...SUBTESTS].sort((a, b) => a.mastery - b.mastery)[0];
  const [selected, setSelected] = useState(weakest.id);
  const current = SUBTESTS.find((s) => s.id === selected) ?? weakest;
  const lv = level(current.mastery);

  return (
    <section id="mastery" className="relative scroll-mt-24 py-20 md:py-28">
      <div aria-hidden className="pointer-events-none absolute left-[-200px] top-1/3 h-[520px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(95,43,206,0.22),transparent)]" />

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 gap-14 px-4 md:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Mastery"
            title="Belajar yang mengikuti kekuatanmu, bukan sebaliknya."
            subtitle="Mastery memetakan kemampuanmu di setiap subtes dan chapter. Kamu nggak perlu menebak harus belajar apa, Gradient yang menyusun jalannya."
          />
          <ol className="mt-10 flex flex-col gap-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gm-brand font-nunito text-[16px] font-black shadow-[0_4px_0_0_#451aa2]">
                  {i + 1}
                </span>
                <div>
                  <p className="font-nunito text-[18px] font-extrabold">{s.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-gm-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Interactive demo: pick a subtest → see mastery + recommendation */}
        <div className="rounded-[28px] border-2 border-gm-line bg-gm-surface p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between px-1">
            <p className="font-nunito text-[18px] font-black">Pilih subtes</p>
            <p className="text-[12px] text-gm-muted">Contoh data siswa</p>
          </div>

          <div className="grid grid-cols-1 gap-2" role="listbox" aria-label="Subtes">
            {SUBTESTS.map((s) => {
              const active = s.id === selected;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => setSelected(s.id)}
                  className={`flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#b79cff] ${
                    active ? "border-gm-brand-300/60 bg-gm-raised" : "border-transparent hover:bg-white/[0.03]"
                  }`}
                >
                  <SubtestIllustration id={s.id} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-baseline justify-between gap-2">
                      <span className="truncate font-nunito text-[14px] font-extrabold">
                        {s.name} <span className="text-gm-muted">({s.id})</span>
                      </span>
                      <span className="font-nunito text-[13px] font-black" style={{ color: s.color }}>
                        {s.mastery}%
                      </span>
                    </div>
                    <MasteryBar value={s.mastery} color={s.color} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Recommendation banner – brand/500 with Inverse buttons, as in Figma M1 */}
          <div className="mt-4 rounded-[20px] bg-gm-brand p-5 shadow-[inset_0_-4px_0_0_#451aa2]">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white/15 p-2">
                <SubtestIllustration id={current.id} size={44} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-nunito text-[13px] font-extrabold text-white/75">Rekomendasi untukmu</p>
                  <span
                    className="rounded-full px-2 py-0.5 font-nunito text-[11px] font-black text-[#171421]"
                    style={{ background: lv.tone }}
                  >
                    {lv.label}
                  </span>
                </div>
                <p className="mt-1 font-nunito text-[19px] font-black leading-snug">
                  Latihan {current.id}: {current.focus}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[13px] text-white/75">
                  <Check className="size-3.5" /> 5 soal · ±10 menit · +25 EXP
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <LipButton href="#produk" variant="inverse" size="sm">
                Mulai latihan
              </LipButton>
              <LipButton href="#produk" variant="inverse-secondary" size="sm">
                Lihat rapot
              </LipButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
