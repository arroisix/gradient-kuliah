"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import type { LottieRefCurrentProps } from "lottie-react";

// Dynamic import for Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface BenefitCardProps {
  tag: string;
  title: string;
  description: string;
  linkText: string;
  accentColor?: string;
  className?: string;
  variant?: "default" | "image" | "lottie";
  imageSrc?: string;
  lottieData?: object;
  showPlayIcon?: boolean;
  tagIcon?: string;
  copilotStyle?: boolean;
}

export default function BenefitCard({
  tag,
  title,
  description,
  linkText,
  accentColor = "#5F2BCE",
  className = "",
  variant = "default",
  imageSrc,
  lottieData,
  showPlayIcon = false,
  tagIcon,
  copilotStyle = false,
}: BenefitCardProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isImageVariant = variant === "image" && imageSrc;
  const isLottieVariant = variant === "lottie" && lottieData;

  // Initialize Lottie at frame 0
  useEffect(() => {
    if (lottieRef.current && lottieData) {
      lottieRef.current.goToAndStop(0, true);
      setIsLoaded(true);
    }
  }, [lottieData]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsFadingOut(true);
    if (lottieRef.current) {
      lottieRef.current.pause();
    }
  };

  // Handle fade transitions - reset to frame 0
  const handleTransitionEnd = () => {
    if (isFadingOut && lottieRef.current) {
      lottieRef.current.goToAndStop(0, true);
      setIsFadingOut(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col bg-bg-card rounded-[32px] border-2 border-transparent overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-primary-purple hover:shadow-[0_0_40px_rgba(95,43,206,0.4)] ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image header for image variant */}
      {isImageVariant && (
        <div className="relative w-full h-[344px] overflow-hidden">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover object-top"
            unoptimized={imageSrc.endsWith('.gif')}
          />
        </div>
      )}

      {/* Lottie animation for lottie variant */}
      {isLottieVariant && (
        <div className={`relative w-full overflow-hidden flex items-center justify-center ${
          isLottieVariant ? "flex-1" : "h-[55%] min-h-[300px]"
        }`}>
          <div
            className={`transition-opacity duration-500 ease-in-out ${
              copilotStyle
                ? "w-[75%] rounded-[12px] border-x border-b border-[#3a3a3a]/60 overflow-hidden -translate-y-[20%]"
                : "w-full h-full"
            }`}
            style={{ opacity: isFadingOut ? 0 : 1 }}
            onTransitionEnd={handleTransitionEnd}
          >
            <Lottie
              lottieRef={lottieRef}
              animationData={lottieData}
              loop={false}
              autoplay={false}
              className="w-full h-full"
              onDOMLoaded={() => {
                if (lottieRef.current) {
                  lottieRef.current.goToAndStop(0, true);
                  setIsLoaded(true);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Accent glow - positioned at bottom */}
      <div
        className="absolute w-[702px] h-[380px] rounded-full opacity-80"
        style={{
          background: accentColor,
          filter: "blur(184px)",
          left: "-57px",
          bottom: (isImageVariant || isLottieVariant) ? "-100px" : "-100px",
        }}
      />

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center gap-4 px-8 pb-8 ${
          isLottieVariant ? "pt-8" : "flex-1 pt-8"
        }`}
      >
        {/* Tag with optional icon */}
        <div className="flex items-center gap-2">
          {showPlayIcon && (
            <Image
              src="/assets/play-icon.svg"
              alt="Play"
              width={36}
              height={36}
            />
          )}
          {tagIcon && (
            <Image
              src={tagIcon}
              alt=""
              width={32}
              height={32}
            />
          )}
          <span
            className="text-base font-bold tracking-[0.15em] uppercase"
            style={{ color: "#B6A6F3" }}
          >
            {tag}
          </span>
        </div>

        {/* Title - centered for media variants */}
        <h3 className={`text-[28px] md:text-[36px] font-extrabold text-white leading-[1.15] ${
          (isImageVariant || isLottieVariant) ? "text-center" : ""
        }`}>
          {title}
        </h3>

        {/* Description - centered for media variants */}
        <p className={`text-lg md:text-xl text-white/80 leading-relaxed ${
          (isImageVariant || isLottieVariant) ? "text-center" : ""
        }`}>
          {description}
        </p>

        {/* Link */}
        {linkText && (
          <button className="inline-flex items-center gap-1.5 text-secondary-purple text-base font-semibold hover:gap-2.5 transition-all w-fit mt-2">
            {linkText}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
