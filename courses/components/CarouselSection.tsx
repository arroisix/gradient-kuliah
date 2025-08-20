import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Skeleton from 'commons/components/elements/Skeleton';
import { useTracker } from 'tracker/tracker';
import { cn, slugify } from 'commons/utils';
import { Header } from './CourseTabHeader';

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

    const navigateToPage = useCallback(
        (page: number) => {
            if (page >= 0 && page < totalPages) {
                setCurrentPage(page);

                tracker?.genericTrack(`Navigate ${eventCategory} Carousel`, {
                    action: page > currentPage ? 'next' : 'previous',
                    title,
                    page
                });
            }
        },
        [totalPages, currentPage, tracker, eventCategory, title]
    );

    const nextPage = useCallback(() => {
        if (currentPage < totalPages - 1) {
            navigateToPage(currentPage + 1);
        }
    }, [currentPage, navigateToPage, totalPages]);

    const prevPage = useCallback(() => {
        if (currentPage > 0) {
            navigateToPage(currentPage - 1);
        }
    }, [currentPage, navigateToPage]);

    const getItemsForDisplay = useCallback(() => {
        const result = [];
        const totalItems = items.length;

        for (let i = 0; i < totalItems; i += itemsPerPage) {
            result.push(items.slice(i, i + itemsPerPage));
        }

        return result;
    }, [items, itemsPerPage]);

    const paginatedItems = getItemsForDisplay();
    const displayItems = isLoading
        ? Array(itemsPerPage).fill(null)
        : paginatedItems[currentPage] || [];

    if (!isLoading && (!items || items.length === 0)) {
        return null;
    }

    return (
        <div className="w-full mb-12">
            <div className="flex items-center justify-between mb-4">
                <Header title={title} />
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
                        key={`${slugify(title)}-${
                            currentPage * itemsPerPage + index
                        }`}
                        className="flex-shrink-0 w-[80%] md:w-[48%] lg:w-[32%] xl:w-[24%] min-w-[240px] max-w-[360px]"
                        style={{ scrollSnapAlign: 'start' }}>
                        {isLoading ? (
                            <Skeleton className="h-64 rounded-lg" />
                        ) : (
                            renderItem(item, currentPage * itemsPerPage + index)
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
                            onClick={() => navigateToPage(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarouselSection;
