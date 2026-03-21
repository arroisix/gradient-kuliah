"use client";

import Image from "next/image";

interface Testimony {
  quote: string;
  name: string;
  university: string;
  major: string;
  image: string;
}

const testimonies: Testimony[] = [
  {
    quote: "Gradient is more than just a learning tool; it's a valuable resource that helps students succeed in college. It's a complete all-in-one for us. You'll need it for securing impressive GPA!",
    name: "Ida Garaad",
    university: "Universitas Indonesia",
    major: "Ilmu Komputer",
    image: "/figma/testimony-avatar.png",
  },
  {
    quote: "Awal kenal Gradient dari kelas 3 SMA dan langsung tertarik karena ngadain kelas kalkulus 1. Setelah SNBT, aku langsung daftar buat belajar kalkulus karena gabut nunggu pengumuman. Saat belajar di sini, aku jadi tau kalo aku sebenarnya ga tau apa-apa tentang konsep dasar kalkulus. Penjelasan di Gradient sangat bagus untuk yang punya jiwa penasaran dan mau belajar sains yang sebenarnya.",
    name: "Ida Garaad",
    university: "Universitas Indonesia",
    major: "Ilmu Komputer",
    image: "/figma/testimony-avatar.png",
  },
  {
    quote: "Saya sangat puas dengan platform pembelajaran online melalui gradient! Materinya sangat komprehensif, termasuk topik-topik lanjutan seperti persamaan diferensial dan fisika, yang disampaikan dengan cara menarik dan mudah dimengerti. Pokok pembahasannya juga mulai dari konsep bukan hafalan sehingga cocok dengan saya.",
    name: "Ida Garaad",
    university: "Universitas Indonesia",
    major: "Ilmu Komputer",
    image: "/figma/testimony-avatar.png",
  },
  {
    quote: "Gradient is more than just a learning tool; it's a valuable resource!",
    name: "Ida Garaad",
    university: "Universitas Indonesia",
    major: "Ilmu Komputer",
    image: "/figma/testimony-avatar.png",
  },
  {
    quote: "Gradient is more than just a learning tool; it's a valuable resource!",
    name: "Ida Garaad",
    university: "Universitas Indonesia",
    major: "Ilmu Komputer",
    image: "/figma/testimony-avatar.png",
  },
  {
    quote: "Gradient is more than just a learning tool; it's a valuable resource!",
    name: "Ida Garaad",
    university: "Universitas Indonesia",
    major: "Ilmu Komputer",
    image: "/figma/testimony-avatar.png",
  },
];

function TestimonyCard({ testimony }: { testimony: Testimony }) {
  return (
    <div
      className="flex flex-col justify-between p-6 md:px-[25px] md:py-[41px] rounded-[24px] border border-white/10 min-h-[320px]"
      style={{
        background: "linear-gradient(133deg, rgb(26, 26, 26) 0%, rgb(10, 10, 10) 100%)",
      }}
    >
      {/* Quote */}
      <p className="text-white text-base md:text-xl font-semibold leading-[1.4]">
        {testimony.quote}
      </p>

      {/* Author */}
      <div className="flex items-end justify-between pt-8 mt-auto">
        <div className="flex flex-col">
          <span className="text-white text-base md:text-xl font-semibold leading-[1.4]">
            {testimony.name}
          </span>
          <span className="text-white text-sm md:text-base leading-[1.5]">
            {testimony.university}
          </span>
          <span className="text-[#6B7280] text-sm md:text-base leading-[1.5]">
            {testimony.major}
          </span>
        </div>
        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0">
          <Image
            src={testimony.image}
            alt={testimony.name}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default function TestimonySection() {
  return (
    <section className="relative w-full bg-bg-black py-16 md:py-24 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute left-0 bottom-0 w-[783px] h-[818px] pointer-events-none opacity-50"
        style={{
          background: "radial-gradient(ellipse at center, rgba(95, 43, 206, 0.3) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-[60px]">
        {/* Section Title */}
        <h2 className="text-[32px] md:text-[64px] font-bold text-white text-center mb-10 md:mb-16 leading-[1.25]">
          Kata mereka yang belajar bersama Gradient
        </h2>

        {/* Bento Grid - Desktop */}
        <div className="hidden md:grid grid-cols-3 gap-6 auto-rows-auto">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <TestimonyCard testimony={testimonies[0]} />
            <TestimonyCard testimony={testimonies[3]} />
          </div>

          {/* Column 2 - taller card */}
          <div className="flex flex-col gap-6">
            <TestimonyCard testimony={testimonies[1]} />
            <TestimonyCard testimony={testimonies[4]} />
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <TestimonyCard testimony={testimonies[2]} />
            <TestimonyCard testimony={testimonies[5]} />
          </div>
        </div>

        {/* Mobile - Single column */}
        <div className="md:hidden flex flex-col gap-4">
          {testimonies.slice(0, 4).map((testimony, index) => (
            <TestimonyCard key={index} testimony={testimony} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-10 md:mt-16">
          <button className="px-5 py-3 bg-[#333] hover:bg-[#444] text-white text-base font-semibold rounded-full transition-colors">
            Lihat Semua
          </button>
        </div>
      </div>
    </section>
  );
}
