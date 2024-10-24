import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface TestimonialCardProps {
    name: string;
    university: {
        name: string;
        major: string;
    };
    text: string;
    image: string;
}

const QuoteIcon = () => (
    <svg
        width="32"
        height="24"
        viewBox="0 0 32 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6.85714 9.72332C6.05143 9.72332 5.28929 9.88687 4.57143 10.1429V9.72332C4.57143 7.21309 6.62143 5.1722 9.14286 5.1722C10.405 5.1722 11.4286 4.15318 11.4286 2.89665C11.4286 1.64012 10.4071 0.621094 9.14286 0.621094C4.10143 0.621094 0 4.70287 0 9.72332V16.55C0 20.3203 3.07 23.3766 6.85714 23.3766C10.6443 23.3766 13.7143 20.3203 13.7143 16.55C13.7143 12.7797 10.6429 9.72332 6.85714 9.72332ZM25.1429 9.72332C24.3371 9.72332 23.575 9.88723 22.8571 10.1414V9.72332C22.8571 7.21309 24.9071 5.1722 27.4286 5.1722C28.6907 5.1722 29.7143 4.15318 29.7143 2.89665C29.7143 1.64012 28.6907 0.621094 27.4286 0.621094C22.3871 0.621094 18.2857 4.70429 18.2857 9.72332V16.55C18.2857 20.3203 21.3557 23.3766 25.1429 23.3766C28.93 23.3766 32 20.3203 32 16.55C32 12.7797 28.9286 9.72332 25.1429 9.72332Z"
            fill="#7264EB"
        />
    </svg>
);

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
                    <QuoteIcon />
                </div>
                <div className="relative">
                    <div className="relative">
                        <p
                            ref={textRef}
                            className={`text-base md:text-xl text-white font-bold mt-8 ${
                                !isExpanded ? 'line-clamp-6' : ''
                            }`}>
                            {text}
                        </p>
                        {shouldShowButton && !isExpanded && (
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#222222] to-transparent" />
                        )}
                    </div>
                    {shouldShowButton && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-[#B6A6F3] font-bold text-base hover:underline mt-2">
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
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
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
