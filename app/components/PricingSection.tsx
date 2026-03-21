"use client";

import { Check } from "lucide-react";

interface PricingFeature {
  title: string;
  description: string;
}

interface PricingPlan {
  name: string;
  price: string;
  originalPrice: string;
  features: PricingFeature[];
  featured?: boolean;
}

const features: PricingFeature[] = [
  { title: "Video", description: "330+ Video Belajar On-Demand" },
  { title: "Latihan", description: "Latihan Soal + Pembahasan" },
  { title: "Rangkuman", description: "Rangkuman beserta ilustrasi" },
  { title: "Komunitas", description: "Tanya, jawab, diskusi" },
  { title: "Copilot", description: "Asisten belajar AI" },
];

const plans: PricingPlan[] = [
  {
    name: "Paket 1 Bulan",
    price: "Rp150.000",
    originalPrice: "Rp300.000",
    features,
  },
  {
    name: "Paket 3 Bulan",
    price: "Rp225.000",
    originalPrice: "Rp900.000",
    features,
    featured: true,
  },
  {
    name: "Paket 6 Bulan",
    price: "Rp450.000",
    originalPrice: "Rp300.000",
    features,
  },
];

function PricingCard({ plan }: { plan: PricingPlan }) {
  const { name, price, originalPrice, features, featured } = plan;

  return (
    <div
      className={`
        relative flex flex-col gap-4 w-full max-w-[282px] rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.5)]
        ${featured
          ? "border-2 border-primary-purple/50"
          : "bg-[#222]"
        }
      `}
      style={
        featured
          ? {
              backgroundImage: `
                url("data:image/svg+xml;utf8,<svg viewBox='0 0 282 457' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-2.6359e-13 66.847 -41.249 -3.054e-13 141 228.5)'><stop stop-color='rgba(95,43,206,0.3)' offset='0'/><stop stop-color='rgba(48,22,103,0.15)' offset='0.5'/><stop stop-color='rgba(0,0,0,0)' offset='1'/></radialGradient></defs></svg>"),
                linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 100%)
              `,
            }
          : undefined
      }
    >
      {/* Featured badge */}
      {featured && (
        <div className="w-full bg-primary-purple/50 py-2.5 rounded-t-xl text-center">
          <span className="font-raleway font-bold text-xs text-white tracking-wide">
            PENAWARAN TERBAIK!
          </span>
        </div>
      )}

      {/* Content */}
      <div className={`flex flex-col gap-4 w-full ${!featured ? "pt-6" : ""}`}>
        {/* Pricing header */}
        <div className="flex flex-col gap-1 items-center w-full">
          <p className="font-raleway font-extrabold text-base text-white">
            {name}
          </p>
          <p
            className={`font-opensans font-extrabold text-[32px] leading-tight ${
              featured
                ? "bg-gradient-to-r from-[#CAC7E4] via-[#AB8EEC] via-[28%] to-[#DD837A] to-[65%] bg-clip-text text-transparent"
                : "text-white"
            }`}
          >
            {price}
          </p>
          <div className="relative">
            <span className="font-opensans font-bold text-lg text-[#666]">
              {originalPrice}
            </span>
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#DF5446] -rotate-6" />
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-2.5 px-6">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-purple/20">
                <Check className="w-4 h-4 text-primary-purple" />
              </div>
              <div className="flex flex-col">
                <span className="font-raleway font-extrabold text-sm text-white">
                  {feature.title}
                </span>
                <span className="font-opensans text-xs text-[#999]">
                  {feature.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-full px-6 pb-6">
        <button className="w-full py-2 px-6 bg-primary-purple hover:bg-primary-purple/90 text-white font-raleway font-bold text-sm rounded-full transition-colors">
          Langganan Sekarang
        </button>
      </div>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section className="w-full bg-bg-black py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[60px]">
        <div className="flex flex-col gap-10 items-center">
          {/* Section title - same size as TestimonySection */}
          <h2 className="text-[32px] md:text-[64px] font-bold text-white text-center leading-[1.25]">
            Tertarik? Langganan untuk mengakses seluruh materi
          </h2>

          {/* Pricing cards */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {plans.map((plan, index) => (
              <PricingCard key={index} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
