import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ImQuotesLeft } from 'react-icons/im';
import { cn } from 'commons/utils';
import { TestimonialUniversity } from 'commons/types/testimonial';

interface TestimonialCardProps {
    name: string;
    university: TestimonialUniversity;
    text: string;
    image: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
    name,
    university,
    text,
    image
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldShowButton, setShouldShowButton] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (textRef.current) {
            const element = textRef.current;
            const lineHeight = parseInt(
                window.getComputedStyle(element).lineHeight
            );
            const maxHeight = lineHeight * 6;
            const scrollHeight = element.scrollHeight;

            setShouldShowButton(scrollHeight > maxHeight);
        }
    }, [text]);

    return (
        <div className="relative w-full h-full bg-[#222222] rounded-2xl p-4 md:p-6 flex flex-col justify-between border border-[#444444]">
            <div className="relative">
                <div className="absolute top-0 left-0">
                    <ImQuotesLeft className="w-8 h-6 text-[#7264EB]" />
                </div>
                <div className="relative">
                    <div className="relative">
                        <p
                            ref={textRef}
                            className={cn(
                                'text-base md:text-xl text-white font-bold mt-8',
                                !isExpanded && 'line-clamp-6'
                            )}>
                            {text}
                        </p>
                        {shouldShowButton && !isExpanded && (
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#222222] to-transparent" />
                        )}
                    </div>
                    {shouldShowButton && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={cn(
                                'text-[#B6A6F3] font-bold text-base hover:underline mt-2'
                            )}>
                            {isExpanded ? 'Lebih Sedikit' : 'Baca Selengkapnya'}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3 md:gap-4 mt-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                        src={image}
                        alt={name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                    />
                </div>
                <div className="flex flex-col gap-0.5 md:gap-1">
                    <h3 className="font-semibold text-sm md:text-lg text-white">
                        {name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400">
                        {university.major} - {university.name}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;
