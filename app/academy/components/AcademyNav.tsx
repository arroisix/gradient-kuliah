"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LipButton } from "./ui";

const LINKS = [
  { label: "Misi", href: "#misi" },
  { label: "Mastery", href: "#mastery" },
  { label: "Akses", href: "#akses" },
  { label: "Produk", href: "#produk" },
];

export default function AcademyNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 md:pt-4">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between rounded-full border border-white/[0.08] bg-[#171421]/75 py-2.5 pl-5 pr-2.5 backdrop-blur-md">
        <Link href="/academy" className="flex items-center" aria-label="Gradient Academy">
          <Image src="/academy/icons/gradient-wordmark.svg" alt="Gradient" width={112} height={28} priority />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 font-nunito text-[15px] font-bold text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LipButton href="#" variant="subtle" size="sm">
            Masuk
          </LipButton>
          <LipButton href="#produk" size="sm">
            Mulai belajar
          </LipButton>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full text-white md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-[1200px] rounded-3xl border border-white/[0.08] bg-[#171421]/95 p-3 backdrop-blur-md md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 font-nunito text-[16px] font-bold text-white/85 hover:bg-white/[0.05]"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/[0.08] pt-3">
            <LipButton href="#" variant="subtle" size="md">
              Masuk
            </LipButton>
            <LipButton href="#produk" size="md">
              Mulai belajar
            </LipButton>
          </div>
        </div>
      )}
    </header>
  );
}
