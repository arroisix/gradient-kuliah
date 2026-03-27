import { ChevronRight, PenLine } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from 'react';
import type { LottieRefCurrentProps } from 'lottie-react';
import { cn } from 'commons/utils';

// Dynamic import for Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface BenefitCardProps {
    tag: string;
    title: string;
    description: string;
    linkText: string;
    accentColor?: string;
    className?: string;
    variant?: 'default' | 'image' | 'lottie';
    imageSrc?: string;
    lottieData?: object;
    showPlayIcon?: boolean;
    tagIcon?: string;
    copilotStyle?: boolean;
    tryoutStyle?: boolean;
    showTryoutIcon?: boolean;
    textbookStyle?: boolean;
    banksoalStyle?: boolean;
    placeholderStyle?: boolean;
    astronotesStyle?: boolean;
    astronotesImages?: string[];
}

const BenefitCard = ({
    tag,
    title,
    description,
    linkText,
    accentColor = '#5F2BCE',
    className = '',
    variant = 'default',
    imageSrc,
    lottieData,
    showPlayIcon = false,
    tagIcon,
    copilotStyle = false,
    tryoutStyle = false,
    showTryoutIcon = false,
    textbookStyle = false,
    banksoalStyle = false,
    placeholderStyle = false,
    astronotesStyle = false,
    astronotesImages = []
}: BenefitCardProps): JSX.Element => {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const isImageVariant = variant === 'image' && imageSrc;
    const isLottieVariant = variant === 'lottie' && lottieData;

    // Initialize Lottie - textbook starts at 2.7s
    useEffect(() => {
        if (lottieRef.current && lottieData) {
            if (textbookStyle) {
                lottieRef.current.goToAndStop(4400, false);
            } else {
                lottieRef.current.goToAndStop(0, true);
            }
            setIsLoaded(true);
        }
    }, [lottieData, textbookStyle]);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (lottieRef.current) {
            if (textbookStyle) {
                // Start from beginning and play
                lottieRef.current.goToAndStop(0, true);
            }
            lottieRef.current.play();
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (lottieRef.current) {
            lottieRef.current.pause();
            if (textbookStyle) {
                // Go back to 4.4s without fade
                lottieRef.current.goToAndStop(4400, false);
            } else if (banksoalStyle) {
                // No fade out for banksoal, just reset to start
                lottieRef.current.goToAndStop(0, true);
            } else {
                setIsFadingOut(true);
            }
        }
    };

    // Handle fade transitions - reset to initial frame
    const handleTransitionEnd = () => {
        if (isFadingOut && lottieRef.current) {
            lottieRef.current.goToAndStop(0, true);
            setIsFadingOut(false);
        }
    };

    // Handle animation complete - loop for textbook and banksoal when hovered
    const handleComplete = () => {
        if ((textbookStyle || banksoalStyle) && isHovered && lottieRef.current) {
            // Loop animation while hovering
            lottieRef.current.goToAndStop(0, true);
            lottieRef.current.play();
        }
    };

    return (
        <div
            className={cn(
                'relative flex flex-col bg-graphite-800 overflow-hidden transition-all duration-300',
                placeholderStyle
                    ? 'rounded-[32px]'
                    : 'rounded-[32px] border-2 border-transparent hover:scale-[1.02] hover:border-accent-purple hover:shadow-[0_0_40px_rgba(95,43,206,0.4)]',
                className
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {/* Image header for image variant */}
            {isImageVariant && (
                <div className="relative w-full h-[344px] overflow-hidden">
                    <Image
                        src={imageSrc}
                        alt={title}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="top"
                        unoptimized={imageSrc.endsWith('.gif')}
                    />
                </div>
            )}

            {/* Lottie animation for lottie variant */}
            {isLottieVariant && (
                <div
                    className={cn(
                        'relative w-full overflow-hidden flex justify-center z-10',
                        isLottieVariant ? 'flex-1' : 'h-[55%] min-h-[300px]',
                        (textbookStyle || banksoalStyle) ? 'items-start' : 'items-center'
                    )}>
                    <div
                        className={cn(
                            'transition-opacity duration-500 ease-in-out',
                            copilotStyle
                                ? 'w-[75%] rounded-[12px] border-x border-b border-graphite-650/60 overflow-hidden -translate-y-[14%]'
                                : tryoutStyle
                                ? 'w-[55%] md:w-[45%] rounded-[16px] md:rounded-[24px] border border-graphite-650/80 overflow-hidden -translate-y-[10%]'
                                : textbookStyle
                                ? 'w-[52%] rounded-b-[12px] border-x border-b border-graphite-650/60 overflow-hidden'
                                : banksoalStyle
                                ? 'w-[52%] rounded-b-[12px] border-x border-b border-graphite-650/60 overflow-hidden'
                                : 'w-full h-full'
                        )}
                        style={{ opacity: isFadingOut ? 0 : 1 }}
                        onTransitionEnd={handleTransitionEnd}>
                        <Lottie
                            lottieRef={lottieRef}
                            animationData={lottieData}
                            loop={false}
                            autoplay={false}
                            className="w-full h-full"
                            onDOMLoaded={() => {
                                if (lottieRef.current) {
                                    if (textbookStyle) {
                                        lottieRef.current.goToAndStop(4400, false);
                                    } else {
                                        lottieRef.current.goToAndStop(0, true);
                                    }
                                    setIsLoaded(true);
                                }
                            }}
                            onComplete={handleComplete}
                        />
                    </div>
                </div>
            )}

            {/* Astronotes style - 3 books stacked with hover effect */}
            {astronotesStyle && astronotesImages.length >= 3 && (
                <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden z-10">
                    <div className="relative w-[400px] h-[400px] md:w-[550px] md:h-[500px]">
                        {/* Book 1 - Left back (Discrete Math) */}
                        <div
                            className="absolute w-[194px] h-[282px] md:w-[240px] md:h-[348px] overflow-hidden z-10"
                            style={{
                                left: isHovered ? '2%' : '10%',
                                top: '50%',
                                transform: `translateY(-50%) ${isHovered ? 'rotate(-12deg) scale(1.15)' : 'rotate(-8deg) scale(1)'}`,
                                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                            }}>
                            <Image
                                src={astronotesImages[2]}
                                alt="Book 1"
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                        {/* Book 2 - Center front (FISIKA) - 100% size */}
                        <div
                            className="absolute w-[190px] h-[275px] md:w-[235px] md:h-[340px] overflow-hidden z-30"
                            style={{
                                left: '50%',
                                top: '45%',
                                transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.1) translateY(-8px)' : 'scale(1)'}`,
                                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                            }}>
                            <Image
                                src={astronotesImages[0]}
                                alt="Book 2"
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                        {/* Book 3 - Right back (Calculus) */}
                        <div
                            className="absolute w-[160px] h-[231px] md:w-[197px] md:h-[286px] overflow-hidden z-10"
                            style={{
                                right: isHovered ? '8%' : '12%',
                                top: '50%',
                                transform: `translateY(-50%) ${isHovered ? 'rotate(15deg) scale(1.15)' : 'rotate(10deg) scale(1)'}`,
                                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                            }}>
                            <Image
                                src={astronotesImages[1]}
                                alt="Book 3"
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Accent glow - positioned based on card style */}
            {(textbookStyle || banksoalStyle || astronotesStyle) ? (
                <>
                    {/* Ellipse 1 - top right */}
                    <div
                        className="absolute w-[300px] h-[300px] md:w-[435px] md:h-[423px] -right-[100px] -top-[50px] rounded-full opacity-60 z-0 bg-accent-purple blur-[120px]"
                    />
                    {/* Ellipse 2 - bottom left */}
                    <div
                        className="absolute w-[300px] h-[300px] md:w-[435px] md:h-[423px] -left-[100px] -bottom-[50px] rounded-full opacity-60 z-0 bg-accent-purple blur-[120px]"
                    />
                </>
            ) : (
                <div
                    className={cn(
                        'absolute rounded-full opacity-80 z-0',
                        tryoutStyle
                            ? 'w-[435px] h-[423px] left-1/2 -translate-x-1/2 -top-[107px]'
                            : 'w-[702px] h-[380px] -left-[57px] -bottom-[100px]'
                    )}
                    style={{
                        background: accentColor,
                        filter: 'blur(184px)'
                    }}
                />
            )}

            {/* Content */}
            <div
                className={cn(
                    'relative z-10 flex flex-col items-center gap-4 px-8 pb-8',
                    (isLottieVariant || astronotesStyle) ? 'pt-8' : 'flex-1 pt-8'
                )}>
                {/* Tag with optional icon */}
                <div className="flex items-center gap-2">
                    {showPlayIcon && (
                        <Image
                            src="/assets/kuliah/play-icon.svg"
                            alt="Play"
                            width={36}
                            height={36}
                        />
                    )}
                    {showTryoutIcon && (
                        <PenLine className="w-6 h-6 text-accent-purple-light" />
                    )}
                    {tagIcon && (
                        <Image src={tagIcon} alt="" width={32} height={32} />
                    )}
                    <span className="text-base font-bold tracking-[0.15em] uppercase text-accent-purple-light">
                        {tag}
                    </span>
                </div>

                {/* Title - centered for media variants */}
                <h3
                    className={cn(
                        'text-[28px] md:text-[36px] font-extrabold text-white leading-[1.15]',
                        (isImageVariant || isLottieVariant || astronotesStyle) && 'text-center'
                    )}>
                    {title}
                </h3>

                {/* Description - centered for media variants */}
                <p
                    className={cn(
                        'text-lg md:text-xl text-white/80 leading-relaxed',
                        (isImageVariant || isLottieVariant || astronotesStyle) && 'text-center'
                    )}>
                    {description}
                </p>

                {/* Link */}
                {linkText && (
                    <button className="inline-flex items-center gap-1.5 text-accent-purple-light text-base font-semibold hover:gap-2.5 transition-all w-fit mt-2">
                        {linkText}
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default BenefitCard;
