import Link from "next/link";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Button / Gamifikasi                                                 */
/* Figma: lip 4px solid; Pressed: face drops 3px, lip becomes 1px,      */
/* colour ~6% darker. Inverse variants sit on a brand/500 background.   */
/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "secondary" | "subtle" | "inverse" | "inverse-secondary";
type ButtonSize = "sm" | "md" | "lg";

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-[#5f2bce] text-white shadow-[0_4px_0_0_#451aa2] hover:bg-[#6a36da] active:bg-[#5928c2] active:shadow-[0_1px_0_0_#451aa2]",
  secondary:
    "bg-[#333] text-white shadow-[0_4px_0_0_#232323] hover:bg-[#3a3a3a] active:bg-[#303030] active:shadow-[0_1px_0_0_#232323]",
  subtle:
    "bg-[#2a2539] text-white shadow-[0_4px_0_0_#1c1828] hover:bg-[#312b43] active:bg-[#272336] active:shadow-[0_1px_0_0_#1c1828]",
  inverse:
    "bg-white text-[#8753f5] border border-[#d6c2ff] shadow-[0_2px_0_0_#d6c2ff] hover:bg-[#faf7ff] active:bg-[#f3eeff] active:shadow-[0_1px_0_0_#d6c2ff]",
  "inverse-secondary":
    "bg-white/16 text-white shadow-[0_4px_0_0_#451aa2] hover:bg-white/20 active:bg-white/10 active:shadow-[0_1px_0_0_#451aa2]",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-[34px] px-4 text-[14px] tracking-[-0.28px]",
  md: "h-[44px] px-5 text-[15px] tracking-[-0.3px]",
  lg: "h-[54px] px-7 text-[17px] tracking-[-0.34px]",
};

export function LipButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
}: {
  href?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: () => void;
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-nunito font-extrabold leading-[1.25] whitespace-nowrap select-none transition-[transform,box-shadow,background-color] duration-[80ms] active:translate-y-[3px] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#b79cff] ${VARIANT[variant]} ${SIZE[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Header chips – Streak, EXP, Level                                   */
/* ------------------------------------------------------------------ */

// "Ikon / flame" (Figma 4:21755) and "Ikon / EXP" (Figma 4:21650).
export function FlameIcon({ className = "size-4" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/academy/icons/flame.svg" alt="" aria-hidden className={`shrink-0 ${className}`} />;
}

export function ExpIcon({ className = "size-4" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/academy/icons/exp.png" alt="" aria-hidden className={`shrink-0 ${className}`} />;
}

export function LevelIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#8753f5" />
      <circle cx="12" cy="12" r="10" fill="none" stroke="#cdaff6" strokeOpacity=".5" strokeWidth="1.5" />
      <path d="m12 6.6 1.6 3.4 3.7.4-2.8 2.5.8 3.7L12 14.7l-3.3 1.9.8-3.7-2.8-2.5 3.7-.4z" fill="#fff" />
    </svg>
  );
}

const chipBase =
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap h-8 pl-2 pr-3 rounded-full font-nunito font-extrabold text-[13px] text-white bg-[#221e2f]/90 border border-white/[0.06] backdrop-blur-sm";

export function StreakChip({ days = 7, active = true }: { days?: number; active?: boolean }) {
  return (
    <span className={`${chipBase} ${active ? "" : "opacity-60"}`}>
      <FlameIcon />
      {days} hari
    </span>
  );
}

export function ExpChip({ value = "1.240" }: { value?: string }) {
  return (
    <span className={chipBase}>
      <ExpIcon />
      {value}
    </span>
  );
}

export function LevelChip({ level = 8 }: { level?: number }) {
  return (
    <span className={chipBase}>
      <LevelIcon />
      Lv {level}
    </span>
  );
}

/** "+15 EXP" reward toast, as used in 0.3 Hadiah EXP. */
export function ExpToast({ amount, caption }: { amount: string; caption: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl bg-[#221e2f] border border-white/[0.06] px-3.5 py-2.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)]">
      <ExpIcon className="size-6" />
      <div className="leading-tight">
        <p className="font-nunito font-black text-[15px] text-gm-gold">{amount}</p>
        <p className="text-[12px] text-gm-muted">{caption}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layout helpers                                                       */
/* ------------------------------------------------------------------ */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gm-brand/15 border border-gm-brand-300/25 px-3 py-1 font-nunito font-extrabold text-[13px] text-gm-brand-200">
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div className={`flex flex-col gap-4 ${align === "center" ? "items-center text-center mx-auto" : "items-start"} max-w-[720px]`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-nunito font-black text-[32px] md:text-[48px] leading-[1.08] tracking-[-0.02em] text-balance">
        {title}
      </h2>
      {subtitle && <p className="text-gm-muted text-[16px] md:text-[18px] leading-relaxed text-pretty">{subtitle}</p>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[20px] bg-gm-surface border-2 border-gm-line ${className}`}>{children}</div>
  );
}

/** Mastery progress bar coloured with the subtest identity colour. */
export function MasteryBar({ value, color, className = "" }: { value: number; color: string; className?: string }) {
  return (
    <div className={`h-2.5 rounded-full bg-white/[0.08] overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}
