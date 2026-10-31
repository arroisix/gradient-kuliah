import Image from "next/image";
import Link from "next/link";
import SubtestIllustration, { type SubtestId } from "./SubtestIllustration";
import { LipButton } from "./ui";
import { PRODUCTS } from "../data";

const FLOATERS: { id: SubtestId; className: string }[] = [
  { id: "PK", className: "left-[6%] top-[18%] -rotate-12" },
  { id: "PU", className: "left-[14%] bottom-[14%] rotate-6" },
  { id: "LBE", className: "right-[8%] top-[16%] rotate-12" },
  { id: "PM", className: "right-[15%] bottom-[12%] -rotate-6" },
];

export function CtaSection() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      {/* brand/500 banner with Inverse + Inverse Secondary buttons (Figma rule) */}
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[32px] bg-gm-brand px-6 py-16 text-center shadow-[inset_0_-6px_0_0_#451aa2] md:py-24">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.18),transparent_60%)]" />
        {FLOATERS.map((f) => (
          <div key={f.id} className={`absolute hidden md:block ${f.className}`}>
            <div className="animate-[gm-float_6s_ease-in-out_infinite] rounded-3xl bg-white/12 p-3 backdrop-blur-sm">
              <SubtestIllustration id={f.id} size={64} />
            </div>
          </div>
        ))}
        <div className="relative mx-auto max-w-[640px]">
          <h2 className="font-nunito text-[34px] font-black leading-[1.05] tracking-[-0.02em] text-balance md:text-[52px]">
            Level berikutnya dimulai hari ini.
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-white/80">
            Bergabung dengan 200.000+ pelajar Indonesia yang belajar bersama Gradient.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <LipButton href="#produk" variant="inverse" size="lg">
              Mulai belajar gratis
            </LipButton>
            <LipButton href="#mastery" variant="inverse-secondary" size="lg">
              Kenali Mastery
            </LipButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AcademyFooter() {
  return (
    <footer className="border-t border-gm-line px-4 pb-10 pt-14 md:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-[320px]">
          <Image src="/academy/icons/gradient-wordmark.svg" alt="Gradient" width={112} height={28} />
          <p className="mt-4 text-[14px] leading-relaxed text-gm-muted">
            Belajar sesuai kekuatanmu, dari pengajar terbaik, untuk Indonesia yang lebih cerdas.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:gap-16">
          <div>
            <p className="font-nunito text-[14px] font-extrabold">Produk</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-[14px] text-gm-muted">
              {PRODUCTS.map((p) => (
                <li key={p.id}>
                  <Link href={p.href} className="hover:text-white">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-nunito text-[14px] font-extrabold">Gradient</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-[14px] text-gm-muted">
              <li><a href="#misi" className="hover:text-white">Misi</a></li>
              <li><a href="#mastery" className="hover:text-white">Mastery</a></li>
              <li><a href="#akses" className="hover:text-white">Akses</a></li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-[1200px] text-[13px] text-white/40">
        © {new Date().getFullYear()} Gradient Academy. Semua hak dilindungi.
      </p>
    </footer>
  );
}
