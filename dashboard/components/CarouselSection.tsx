import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Skeleton from 'commons/components/elements/Skeleton';
import { useTracker } from 'tracker/tracker';
import { cn, slugify } from 'commons/utils';

interface CarouselSectionProps {
    title: string;
    items?: any[];
    isLoading: boolean;
    itemsPerPage?: number;
    renderItem: (item: any, index: number) => React.ReactNode;
    eventCategory: string;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({
    title,
    items = [],
    isLoading,
    itemsPerPage = 4,
    renderItem,
    eventCategory
}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const tracker = useTracker();
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (items?.length > 0) {
            setTotalPages(Math.ceil(items.length / itemsPerPage));
        }
    }, [items, itemsPerPage]);

    const nextPage = useCallback(() => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);

            if (carouselRef.current) {
                carouselRef.current.scrollBy({
                    left: carouselRef.current.offsetWidth,
                    behavior: 'smooth'
                });
            }

            tracker?.genericTrack(`Navigate ${eventCategory} Carousel`, {
                action: 'next',
                title
            });
        }
    }, [currentPage, totalPages, tracker, eventCategory, title]);

    const prevPage = useCallback(() => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);

            if (carouselRef.current) {
                carouselRef.current.scrollBy({
                    left: -carouselRef.current.offsetWidth,
                    behavior: 'smooth'
                });
            }

            tracker?.genericTrack(`Navigate ${eventCategory} Carousel`, {
                action: 'previous',
                title
            });
        }
    }, [currentPage, tracker, eventCategory, title]);

    const displayItems = isLoading ? Array(itemsPerPage).fill(null) : items;

    if (!isLoading && (!items || items.length === 0)) {
        return null;
    }

    return (
        <div className="w-full mb-12">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold md:text-xl">{title}</h2>
                <div className="flex items-center gap-2">
                    {totalPages > 1 && (
                        <div className="flex gap-2">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 0}
                                className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Previous page">
                                <FiChevronLeft size={20} />
                            </button>
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages - 1}
                                className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Next page">
                                <FiChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div
                ref={carouselRef}
                className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar"
                style={{ scrollSnapType: 'x mandatory' }}>
                {displayItems.map((item, index) => (
                    <div
                        key={`${slugify(title)}-${index}`}
                        className="flex-shrink-0 w-[80%] md:w-[48%] lg:w-[23%]"
                        style={{ scrollSnapAlign: 'start' }}>
                        {isLoading ? (
                            <Skeleton className="h-64 rounded-lg" />
                        ) : (
                            renderItem(item, index)
                        )}
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            className={cn(
                                'h-1.5 rounded-full transition-all',
                                index === currentPage
                                    ? 'w-6 bg-white'
                                    : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                            )}
                            onClick={() => {
                                setCurrentPage(index);
                                if (carouselRef.current) {
                                    const scrollAmount =
                                        carouselRef.current.offsetWidth * index;
                                    carouselRef.current.scrollTo({
                                        left: scrollAmount,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarouselSection;
