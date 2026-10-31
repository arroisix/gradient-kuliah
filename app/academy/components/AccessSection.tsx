import Image from "next/image";
import { MapPin, PlayCircle, Smartphone } from "lucide-react";
import { SectionHeading } from "./ui";

// Pin positions reused from the Gradient Kuliah CTA map (Figma frame 960×285).
const PINS = [
  { id: 1, left: "22.71%", top: "74.74%" },
  { id: 2, left: "0%", top: "0%" },
  { id: 3, left: "10.42%", top: "37.54%" },
  { id: 4, left: "18.33%", top: "65.61%" },
  { id: 5, left: "24.48%", top: "82.81%" },
  { id: 6, left: "29.38%", top: "82.11%" },
  { id: 7, left: "29.69%", top: "31.58%" },
  { id: 8, left: "38.33%", top: "48.77%" },
  { id: 9, left: "44.9%", top: "37.19%" },
  { id: 10, left: "63.02%", top: "23.51%" },
  { id: 11, left: "70.83%", top: "54.39%" },
  { id: 12, left: "96.04%", top: "51.58%" },
  { id: 13, left: "96.67%", top: "83.51%" },
  { id: 14, left: "57.71%", top: "25.96%" },
  { id: 15, left: "51.15%", top: "51.23%" },
  { id: 16, left: "57.4%", top: "59.65%" },
  { id: 17, left: "53.13%", top: "65.61%" },
  { id: 18, left: "37.08%", top: "87.37%" },
  { id: 19, left: "41.77%", top: "88.77%" },
];

const POINTS = [
  {
    icon: PlayCircle,
    color: "#b285f0",
    title: "Diajar dosen kampus top",
    body: "200.000+ video materi dari dosen dan mahasiswa universitas terbaik Indonesia.",
  },
  {
    icon: MapPin,
    color: "#ff6a5c",
    title: "Dari mana saja",
    body: "Sabang sampai Merauke: kualitas materinya sama, di mana pun kamu tinggal.",
  },
  {
    icon: Smartphone,
    color: "#22d3ee",
    title: "Cukup dari HP",
    body: "Belajar di web atau aplikasi Android & iOS, kapan pun kamu sempat.",
  },
];

export default function AccessSection() {
  return (
    <section id="akses" className="relative scroll-mt-24 overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <SectionHeading
          eyebrow="Accessibility for everyone"
          title={
            <>
              Kelas dosen kampus top, <span className="text-gm-brand-300">untuk semua.</span>
            </>
          }
          subtitle="Mahasiswa dan siswa dari kota mana pun berhak mendapat paparan belajar dari pengajar terbaik. Gradient membawa kelas itu ke genggamanmu."
        />

        <div className="relative mt-14 rounded-[28px] border-2 border-gm-line bg-gm-surface px-6 pb-8 pt-12 md:px-12 md:pt-16">
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(ellipse_at_center,rgba(95,43,206,0.18),transparent_65%)]" />
          <div className="relative mx-auto aspect-[960/285] w-full max-w-[960px]">
            <Image src="/figma/indonesia-map.svg" alt="Peta Indonesia" fill className="object-contain opacity-80" />
            {PINS.map((p) => (
              <div
                key={p.id}
                className="absolute z-10 size-[16px] -translate-x-1/4 -translate-y-1/4 sm:size-[24px] md:size-[34px]"
                style={{ left: p.left, top: p.top }}
              >
                <Image src="/figma/pin-marker.svg" alt="" fill className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.35)]" />
                <div className="absolute inset-[15%] overflow-hidden rounded-full bg-white">
                  <Image src={`/figma/univ-${p.id}.png`} alt="Logo universitas" fill sizes="34px" className="object-cover" />
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-12 grid gap-4 md:grid-cols-3">
            {POINTS.map(({ icon: Icon, color, title, body }) => (
              <div key={title} className="flex gap-4 rounded-[20px] bg-gm-card p-5">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl" style={{ background: `${color}1f` }}>
                  <Icon className="size-5" style={{ color }} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="font-nunito text-[17px] font-extrabold">{title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-gm-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
