import { ExpIcon, ExpToast, FlameIcon, LevelIcon, LipButton, SectionHeading } from "./ui";

function Tile({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[24px] border-2 border-gm-line bg-gm-surface p-6 md:p-7 ${className}`}>
      {children}
    </div>
  );
}

function TileText({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative">
      <h3 className="font-nunito text-[22px] font-black">{title}</h3>
      <p className="mt-2 max-w-[380px] text-[15px] leading-relaxed text-gm-muted">{body}</p>
    </div>
  );
}

export default function HabitSection() {
  const week = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <SectionHeading
          eyebrow="Belajar jadi kebiasaan"
          title="Seru kayak main game, hasilnya nyata di rapot."
          subtitle="Streak, EXP, dan level bikin kamu balik lagi setiap hari, tanpa merasa dipaksa."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-6">
          {/* Streak */}
          <Tile className="md:col-span-4">
            <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgba(255,106,92,0.28),transparent)]" />
            <TileText
              title="Jaga streak-mu 🔥"
              body="Belajar satu aktivitas saja tiap hari untuk menjaga streak. Lupa? Gradient ingatkan sebelum tengah malam."
            />
            <div className="relative mt-8 grid max-w-[520px] grid-cols-7 gap-1.5 sm:gap-3">
              {week.map((d, i) => {
                const done = i < 5;
                const today = i === 5;
                return (
                  <div key={d} className="flex flex-col items-center gap-2">
                    <div
                      className={`grid aspect-square w-full max-w-14 place-items-center rounded-xl sm:rounded-2xl ${
                        done
                          ? "bg-[#3a1f22] shadow-[inset_0_-4px_0_0_#861714]"
                          : today
                            ? "border-2 border-[#ff6a5c] bg-[#ff6a5c]/10"
                            : "border-2 border-dashed border-white/15"
                      }`}
                    >
                      {(done || today) && <FlameIcon className={done ? "size-5 sm:size-7" : "size-5 opacity-50 sm:size-7"} />}
                    </div>
                    <span className={`whitespace-nowrap font-nunito text-[11px] font-extrabold sm:text-[12px] ${today ? "text-[#ff6a5c]" : "text-gm-muted"}`}>
                      {today ? "Hari ini" : d}
                    </span>
                  </div>
                );
              })}
            </div>
          </Tile>

          {/* EXP */}
          <Tile className="md:col-span-2">
            <TileText title="Kumpulkan EXP" body="Setiap video, soal, dan bab yang selesai memberi EXP." />
            <div className="relative mt-6 flex flex-col gap-2.5">
              <ExpToast amount="+15 EXP" caption="Video baru selesai" />
              <ExpToast amount="+3 EXP" caption="Jawaban benar" />
              <ExpToast amount="+40 EXP" caption="Khatam bab" />
            </div>
          </Tile>

          {/* Level */}
          <Tile className="md:col-span-3">
            <TileText title="Naik level" body="EXP yang terkumpul menaikkan level dan membuka gelar baru." />
            <div className="relative mt-7 rounded-[18px] bg-gm-card p-5">
              <div className="flex items-center gap-3">
                <LevelIcon className="size-10" />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-nunito text-[16px] font-black">Level 8</span>
                    <span className="text-[12px] font-semibold text-gm-muted">295 / 300 EXP</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/[0.08]">
                    <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-[#8753f5] to-[#cdaff6]" />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[13px] text-gm-muted">5 EXP lagi menuju Level 9 ✨</p>
            </div>
          </Tile>

          {/* Shop */}
          <Tile className="md:col-span-3">
            <TileText title="Tukar di Shop" body="Pakai Saldo EXP untuk border avatar dan gelar yang bisa kamu pamerkan." />
            <div className="relative mt-7 flex gap-4">
              {[
                { name: "Border Perak", cost: "800", ring: "#c0c7d6" },
                { name: "Border Emas", cost: "1.500", ring: "#ffc83d" },
              ].map((b) => (
                <div key={b.name} className="flex flex-1 flex-col items-center rounded-[18px] border-2 border-gm-line bg-gm-card p-4">
                  <div
                    className="grid size-16 place-items-center rounded-full bg-gm-raised"
                    style={{ boxShadow: `0 0 0 4px ${b.ring}` }}
                  >
                    <span className="font-nunito text-[22px] font-black text-white/80">G</span>
                  </div>
                  <p className="mt-3 font-nunito text-[14px] font-extrabold">{b.name}</p>
                  <LipButton variant="secondary" size="sm" className="mt-3 w-full">
                    <ExpIcon className="size-4" /> {b.cost}
                  </LipButton>
                </div>
              ))}
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
}
