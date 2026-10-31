import { Compass, GraduationCap, HeartHandshake } from "lucide-react";
import { SectionHeading } from "./ui";

const PILLARS = [
  {
    icon: HeartHandshake,
    color: "#ff6a5c",
    title: "Mencerdaskan bangsa",
    body: "Pendidikan berkualitas bukan hak istimewa. Kami membangun Gradient supaya setiap anak Indonesia punya kesempatan yang sama untuk berkembang.",
  },
  {
    icon: Compass,
    color: "#b285f0",
    title: "Belajar sesuai kekuatanmu",
    body: "Setiap siswa berbeda. Mastery membaca kekuatan dan kelemahanmu, lalu menyusun latihan yang paling kamu butuhkan.",
  },
  {
    icon: GraduationCap,
    color: "#22d3ee",
    title: "Akses untuk semua",
    body: "Dari kota besar sampai pelosok, kamu tetap bisa belajar dari dosen kampus top. Cukup dengan HP dan koneksi internet.",
  },
];

export default function MissionSection() {
  return (
    <section id="misi" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <SectionHeading
          eyebrow="Kenapa Gradient ada"
          title={
            <>
              Kami percaya setiap siswa bisa{" "}
              <span className="text-gm-brand-300">jadi master</span>.
            </>
          }
          subtitle="Yang berbeda hanya jalannya. Gradient hadir untuk menemani setiap langkah, dari SD sampai bangku kuliah."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, color, title, body }) => (
            <div
              key={title}
              className="group rounded-[24px] border-2 border-gm-line bg-gm-surface p-7 transition-colors hover:border-white/[0.12]"
            >
              <div
                className="mb-6 grid size-14 place-items-center rounded-2xl"
                style={{ background: `${color}1f`, boxShadow: `inset 0 -4px 0 ${color}33` }}
              >
                <Icon className="size-7" style={{ color }} strokeWidth={2.4} />
              </div>
              <h3 className="font-nunito text-[22px] font-black">{title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-gm-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
