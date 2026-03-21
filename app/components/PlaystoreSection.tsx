"use client";

export default function PlaystoreSection() {
  return (
    <section className="w-full bg-bg-black py-16">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[60px]">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-bg-card">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(600px 280px at 20% 20%, rgba(95, 43, 206, 0.35), transparent 60%), radial-gradient(520px 260px at 80% 60%, rgba(182, 166, 243, 0.20), transparent 60%)",
            }}
          />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 p-10 md:p-14 items-center">
            <div className="flex flex-col gap-4">
              <p className="animate-initial:opacity-0 animate-initial:y-10 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-500 text-secondary-purple font-semibold text-sm tracking-wide">
                Gradient Kuliah (Mobile)
              </p>
              <h3 className="animate-initial:opacity-0 animate-initial:y-10 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-500 animate-delay-100 text-white font-bold text-3xl md:text-[34px] leading-tight">
                Belajar fleksibel dari mana saja, kapan saja
              </h3>
              <p className="animate-initial:opacity-0 animate-initial:y-10 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-500 animate-delay-200 text-white/80 text-base leading-relaxed max-w-[520px]">
                Akses video materi, diskusi, rangkuman, dan fitur AI langsung dari
                HP kamu.
              </p>

              <div className="animate-initial:opacity-0 animate-initial:y-10 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-500 animate-delay-300 flex flex-wrap gap-3 mt-2">
                <div className="animate-hover:scale-105 animate-tap:scale-95 flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20 cursor-pointer">
                  <span className="text-[10px] text-white/60 leading-none">
                    Download on the
                  </span>
                  <span className="text-sm font-semibold text-white leading-none">
                    App Store
                  </span>
                </div>
                <div className="animate-hover:scale-105 animate-tap:scale-95 flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20 cursor-pointer">
                  <span className="text-[10px] text-white/60 leading-none">
                    GET IT ON
                  </span>
                  <span className="text-sm font-semibold text-white leading-none">
                    Google Play
                  </span>
                </div>
              </div>
            </div>

            <div className="relative animate-initial:opacity-0 animate-initial:scale-95 animate-inview:opacity-100 animate-inview:scale-100 animate-once animate-duration-600 animate-delay-200">
              <div className="mx-auto w-full max-w-[520px] aspect-3/2 rounded-[24px] border border-white/10 bg-bg-dark-01 overflow-hidden">
                <div className="h-full w-full bg-linear-to-br from-primary-purple/20 to-accent-purple/20" />
              </div>
              <div className="absolute -bottom-6 -right-8 w-[220px] h-[220px] rounded-full blur-[90px] opacity-40 bg-primary-purple" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
