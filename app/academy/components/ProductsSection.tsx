import { ArrowUpRight, Check, ClipboardCheck, GraduationCap, Target, UserRound } from "lucide-react";
import { LipButton, SectionHeading } from "./ui";
import { PRODUCTS } from "../data";

const ICONS = { utbk: Target, tka: ClipboardCheck, kuliah: GraduationCap, private: UserRound };

export default function ProductsSection() {
  return (
    <section id="produk" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <SectionHeading
          eyebrow="Satu Gradient, banyak jalan"
          title="Pilih Gradient yang pas untuk jenjangmu."
          subtitle="Dari Tes Kemampuan Akademik sampai bangku kuliah, setiap produk dibangun dengan Mastery dan pengajar terbaik."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {PRODUCTS.map((p) => {
            const Icon = ICONS[p.id];
            return (
              <article
                key={p.id}
                className="group relative flex flex-col overflow-hidden rounded-[28px] border-2 border-gm-line bg-gm-surface p-7 transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-white/[0.14] md:p-8"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-28 -top-28 size-80 rounded-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: `radial-gradient(closest-side, ${p.accent}40, transparent)` }}
                />

                <div className="relative flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="grid size-12 place-items-center rounded-2xl"
                      style={{ background: `${p.accent}26`, boxShadow: `inset 0 -4px 0 ${p.accent}40` }}
                    >
                      <Icon className="size-6" style={{ color: p.accent }} strokeWidth={2.4} />
                    </div>
                    <div>
                      <p className="font-nunito text-[13px] font-extrabold text-gm-muted">Gradient</p>
                      <h3 className="font-nunito text-[24px] font-black leading-none" style={{ color: p.accent }}>
                        {p.name.replace("Gradient ", "")}
                      </h3>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-nunito text-[12px] font-extrabold text-white/80">
                    {p.audience}
                  </span>
                </div>

                <p className="relative mt-7 font-nunito text-[26px] font-black leading-tight">{p.tagline}</p>
                <p className="relative mt-3 text-[15px] leading-relaxed text-gm-muted">{p.description}</p>

                <ul className="relative mt-6 flex flex-col gap-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2.5 text-[15px] font-semibold">
                      <span
                        className="grid size-5 place-items-center rounded-full"
                        style={{ background: `${p.accent}33` }}
                      >
                        <Check className="size-3" style={{ color: p.accent }} strokeWidth={3.5} />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-8 flex flex-1 items-end">
                  <LipButton href={p.href} variant="subtle" size="md">
                    Kunjungi {p.name}
                    <ArrowUpRight className="size-4" />
                  </LipButton>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
