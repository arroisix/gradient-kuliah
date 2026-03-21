"use client";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[600px] md:min-h-[600px] bg-bg-black pt-24">
      {/* Mobile Video Background - full width at top */}
      <div className="block md:hidden absolute inset-x-0 top-0 h-[450px] z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/assets/hero-video.webm" type="video/webm" />
        </video>
        {/* Gradient fade at bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent 50%, #000000 100%)",
          }}
        />
      </div>

      {/* Noise texture - behind gradient, top-left */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: "755px",
          height: "733px",
          backgroundImage: "url('/assets/background.webp')",
          backgroundSize: "cover",
        }}
      />

      {/* Gradient blob - purple/magenta from bottom-left (on top of texture) */}
      <div
        className="absolute rounded-full z-1"
        style={{
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.6) 0%, rgba(139, 92, 246, 0.3) 40%, transparent 70%)",
          filter: "blur(80px)",
          left: "-300px",
          bottom: "-200px",
        }}
      />

      {/* Desktop Video - positioned top right, behind gradient */}
      <div className="hidden md:block absolute right-0 top-0 w-[640px] aspect-square z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 15%), linear-gradient(to bottom, black 85%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%), linear-gradient(to bottom, black 85%, transparent 100%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          <source src="/assets/hero-video.webm" type="video/webm" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-[60px] h-full flex items-center pt-[200px] pb-16 md:py-16">
        <div className="flex flex-col gap-8 w-full">
          {/* Left - Text Content */}
          <div className="flex flex-col gap-8 max-w-[700px] flex-1">
            {/* Title and Description */}
            <div className="flex flex-col gap-6">
              <h1 className="animate-initial:opacity-0 animate-initial:y-10 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-700 text-[66px] md:text-[72px] font-extrabold leading-[1.1] text-white text-center md:text-left">
                Aplikasi Belajar{" "}
                <span className="relative inline-block">
                  <span className="text-secondary-purple">Kuliah</span>
                  <span
                    className="absolute left-0 bottom-0 w-full md:w-[217px] h-0 border-b-[3px] md:border-b-[5px] border-dashed"
                    style={{ borderColor: "#B6A6F3" }}
                  />
                </span>{" "}
                No 1 di Indonesia
              </h1>
              <p className="animate-initial:opacity-0 animate-initial:y-10 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-700 animate-delay-150 text-base md:text-lg text-white/80 leading-relaxed text-center md:text-left">
                Akses video dari dosen universitas top, sambil melihat pembahasan
                dan rangkuman soal, disertai AI untuk membantumu raih IPK idaman.
              </p>
            </div>

            {/* CTA Button - no icon, sesuai Figma */}
            <div className="animate-initial:opacity-0 animate-initial:y-10 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-700 animate-delay-300 flex justify-center md:justify-start">
              <button className="px-8 md:px-12 py-4 md:py-[18px] bg-primary-purple text-white text-lg md:text-xl font-semibold rounded-full animate-hover:scale-105 animate-tap:scale-95 transition-colors hover:bg-primary-purple/90">
                Coba Sekarang
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
