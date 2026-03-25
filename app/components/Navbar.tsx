"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Check } from "lucide-react";

const navLinks = [
  { label: "Kelas", href: "#", hasDropdown: true },
  { label: "Try Out", href: "#", hasDropdown: true },
  { label: "Perpustakaan", href: "#", hasDropdown: false },
];

const productCards = [
  {
    id: "kuliah",
    name: "Gradient Kuliah",
    description: "Platform belajar untuk mahasiswa dengan video dan latihan soal lengkap.",
    logo: "/assets/logo-gradient-kuliah.svg",
    href: "/",
    current: true,
  },
  {
    id: "utbk",
    name: "Gradient UTBK",
    description: "Persiapan UTBK dengan materi lengkap dan tryout berkualitas.",
    logo: "/assets/logo-gradient-utbk.svg",
    href: "https://gradient.academy/utbk",
    current: false,
  },
  {
    id: "private",
    name: "Gradient Private",
    description: "Les privat online dengan tutor berpengalaman dan fleksibel.",
    logo: "/assets/logo-gradient-private.svg",
    href: "#",
    current: false,
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showMobileProductDropdown, setShowMobileProductDropdown] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setShowProductDropdown(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowProductDropdown(false);
    }, 150);
  };

  return (
    <>
      {/* Desktop Floating Pill Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden lg:block">
        {/* Outer container with padding */}
        <div className="max-w-[1280px] mx-auto px-6 py-4">
          {/* Inner pill navbar */}
          <div
            className="flex items-center justify-between px-8 py-3 rounded-full border border-white/8"
            style={{
              background: "rgba(4, 4, 4, 0.23)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0px 25px 50px -12px rgba(88, 28, 135, 0.1)",
            }}
          >
            {/* Logo with Product Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="relative flex items-center gap-2">
                {/* Black bar background - always present, opacity changes on hover */}
                <div
                  className={`absolute -inset-x-3 -inset-y-2 bg-black rounded-full transition-opacity duration-200 ${
                    showProductDropdown ? "opacity-80" : "opacity-0"
                  }`}
                />
                <Image
                  src="/assets/gradient-logo-nav.svg"
                  alt="Gradient"
                  width={191}
                  height={24}
                  className="relative z-10"
                />
                <ChevronDown
                  className={`relative z-10 w-4 h-4 text-secondary-purple transition-transform duration-200 ${
                    showProductDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Product Dropdown */}
              <div
                className={`absolute top-full left-0 pt-4 transition-all duration-200 ease-out ${
                  showProductDropdown
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <div
                  className="w-[480px] p-4 rounded-2xl border border-white/8"
                  style={{
                    background: "rgba(10, 10, 10, 0.98)",
                    boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div className="flex flex-col gap-2">
                    {productCards.map((product) => (
                      <Link
                        key={product.id}
                        href={product.href}
                        className={`group flex items-center gap-4 p-3 rounded-xl transition-all duration-150 ${
                          product.current
                            ? "bg-primary-purple/20 border border-primary-purple/30"
                            : "hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        {/* Product Logo */}
                        <div className="relative h-10 rounded-full bg-black flex items-center justify-center overflow-hidden shrink-0 px-3">
                          <Image
                            src={product.logo}
                            alt={product.name}
                            width={140}
                            height={24}
                            className="object-contain h-6"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <span className="text-white font-semibold text-sm">
                            {product.name}
                          </span>
                          <p className="text-white/50 text-xs mt-0.5 leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        {/* Check icon for current */}
                        {product.current && (
                          <div className="w-5 h-5 rounded-full bg-primary-purple flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Center Navigation */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center gap-1 px-3 py-2 text-white hover:text-white/80 transition-colors text-sm font-semibold"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
              ))}
            </div>

            {/* Right CTA Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="px-4 py-2 bg-[#333333] text-white text-sm font-semibold rounded-full hover:bg-[#444444] transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="#"
                className="px-4 py-2 bg-primary-purple text-white text-sm font-semibold rounded-full hover:bg-primary-purple/90 transition-colors"
              >
                Coba Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="px-4 py-3">
          <div
            className="flex items-center justify-between px-4 py-2.5 rounded-full border border-white/8"
            style={{
              background: "rgba(4, 4, 4, 0.23)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0px 25px 50px -12px rgba(88, 28, 135, 0.1)",
            }}
          >
            {/* Logo with Product Dropdown */}
            <div className="relative">
              <button
                className="relative flex items-center gap-2"
                onClick={() => setShowMobileProductDropdown(!showMobileProductDropdown)}
              >
                {/* Black bar background - always present, opacity changes on tap */}
                <div
                  className={`absolute -inset-x-3 -inset-y-2 bg-black rounded-full transition-opacity duration-200 ${
                    showMobileProductDropdown ? "opacity-80" : "opacity-0"
                  }`}
                />
                <Image
                  src="/assets/gradient-logo-nav.svg"
                  alt="Gradient"
                  width={160}
                  height={20}
                  className="relative z-10"
                />
                <ChevronDown
                  className={`relative z-10 w-4 h-4 text-secondary-purple transition-transform duration-200 ${
                    showMobileProductDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mobile Product Dropdown */}
              <div
                className={`fixed left-4 right-4 top-[72px] transition-all duration-200 ease-out ${
                  showMobileProductDropdown
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <div
                  className="w-full p-4 rounded-2xl border border-white/8"
                  style={{
                    background: "rgba(10, 10, 10, 0.98)",
                    boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div className="flex flex-col gap-2">
                    {productCards.map((product) => (
                      <Link
                        key={product.id}
                        href={product.href}
                        className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                          product.current
                            ? "bg-primary-purple/20"
                            : "hover:bg-white/5"
                        }`}
                        onClick={() => setShowMobileProductDropdown(false)}
                      >
                        <div className="h-10 rounded-full bg-black flex items-center justify-center overflow-hidden px-3 shrink-0">
                          <Image
                            src={product.logo}
                            alt={product.name}
                            width={120}
                            height={22}
                            className="object-contain h-[22px]"
                          />
                        </div>
                        <span className="text-white text-sm font-medium flex-1">
                          {product.name}
                        </span>
                        {product.current && (
                          <Check className="w-5 h-5 text-primary-purple shrink-0" />
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="text-white p-1"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Click outside to close mobile product dropdown */}
        {showMobileProductDropdown && (
          <div
            className="fixed inset-0 z-[-1]"
            onClick={() => setShowMobileProductDropdown(false)}
          />
        )}

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="mx-4 mt-2 rounded-2xl border border-white/8 overflow-hidden"
            style={{
              background: "rgba(4, 4, 4, 0.85)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0px 25px 50px -12px rgba(88, 28, 135, 0.1)",
            }}
          >
            <div className="p-4 flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center justify-between py-3 px-3 text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-white/10">
                <Link
                  href="#"
                  className="py-2.5 bg-[#333333] text-white text-sm font-semibold rounded-full text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="#"
                  className="py-2.5 bg-primary-purple text-white text-sm font-semibold rounded-full text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Coba Gratis
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
