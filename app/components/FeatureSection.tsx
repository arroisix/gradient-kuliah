"use client";

import { Play, ChevronRight, Sparkles, BarChart3 } from "lucide-react";
import Image from "next/image";

interface FeatureCardData {
  badge: string;
  badgeIcon: "play" | "sparkles" | "chart";
  title: string;
  description: string;
  descriptionItalic?: string;
  cta: string;
  image: string;
}

const featureData: Record<string, FeatureCardData> = {
  kelas: {
    badge: "KELAS",
    badgeIcon: "play",
    title: "200.000+ Video Materi dari Dosen Top Universitas",
    description: "Penjelasan yang santai, mudah dimengerti, dan ",
    descriptionItalic: "to the point",
    cta: "Lihat Daftar Kelas",
    image: "/figma/kelas-image.png",
  },
  copilot: {
    badge: "COPILOT",
    badgeIcon: "sparkles",
    title: "Belajar Cepat dengan Dukungan AI dan Alat Belajar Interaktif",
    description: "Asisten belajar AI yang siap membantu kamu ",
    descriptionItalic: "24/7",
    cta: "Coba Copilot AI",
    image: "/figma/copilot-image.png",
  },
  analytics: {
    badge: "ANALYTICS",
    badgeIcon: "chart",
    title: "Perdalam Pemahaman dengan Soal dan Rangkuman",
    description: "Pantau progress belajarmu dengan ",
    descriptionItalic: "insight mendalam",
    cta: "Lihat Analytics",
    image: "/figma/analytics-image.png",
  },
};

interface FeatureSectionProps {
  variant: "kelas" | "copilot" | "analytics";
  title: string;
}

function BadgeIcon({ type }: { type: "play" | "sparkles" | "chart" }) {
  switch (type) {
    case "play":
      return <Play className="w-4 h-4 text-secondary-purple fill-secondary-purple" />;
    case "sparkles":
      return <Sparkles className="w-4 h-4 text-secondary-purple" />;
    case "chart":
      return <BarChart3 className="w-4 h-4 text-secondary-purple" />;
  }
}

export default function FeatureSection({ variant, title }: FeatureSectionProps) {
  const data = featureData[variant];

  return (
    <section className="w-full bg-bg-black py-16">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[60px]">
        {/* Section Title */}
        <h2 className="animate-initial:opacity-0 animate-initial:y-10 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-600 text-[24px] md:text-[30px] font-bold text-white text-center mb-12">
          {title}
        </h2>

        {/* Feature Card */}
        <div className="animate-initial:opacity-0 animate-initial:scale-95 animate-inview:opacity-100 animate-inview:scale-100 animate-once animate-duration-600 animate-delay-150 flex justify-center">
          <div
            className="group relative w-full max-w-[600px] bg-bg-card rounded-[32px] border border-white/5 overflow-hidden transition-all duration-300 hover:border-secondary-purple hover:shadow-[0_0_30px_rgba(182,166,243,0.15)]"
          >
            {/* Purple glow at bottom */}
            <div
              className="absolute bottom-[-241px] left-1/2 -translate-x-1/2 w-[702px] h-[380px] pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(95, 43, 206, 0.4) 0%, transparent 70%)",
              }}
            />

            {/* Image Area */}
            <div className="relative h-[280px] md:h-[344px] w-full overflow-hidden">
              <Image
                src={data.image}
                alt={data.badge}
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Content Area */}
            <div className="relative flex flex-col gap-4 items-center pt-8 pb-8 px-8 text-center">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-[30px] h-[30px]">
                  <BadgeIcon type={data.badgeIcon} />
                </div>
                <span className="text-secondary-purple text-sm font-bold tracking-[0.7px] uppercase">
                  {data.badge}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[24px] md:text-[30px] font-bold text-white leading-[1.2]">
                {data.title}
              </h3>

              {/* Description */}
              <p className="text-base md:text-lg text-white">
                {data.description}
                {data.descriptionItalic && (
                  <span className="italic">{data.descriptionItalic}</span>
                )}
                .
              </p>

              {/* CTA Button */}
              <button className="flex items-center gap-1 py-2 text-secondary-purple text-sm font-semibold hover:gap-2 transition-all">
                {data.cta}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
