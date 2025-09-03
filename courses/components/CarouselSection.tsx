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
    itemWrapperClassName?: string;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({
    title,
    items = [],
    isLoading,
    itemsPerPage = 3,
    renderItem,
    eventCategory,
    itemWrapperClassName
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
                className="flex overflow-x-auto gap-4 xl:gap-6 pr-4 pb-4 hide-scrollbar snap-x snap-mandatory">
                {/*                                  ^ add pr-4 so last card has breathing room */}
                {displayItems.map((item, index) => (
                    <div
                        key={`${slugify(title)}-${
                            currentPage * itemsPerPage + index
                        }`}
                        className={cn(
                            'shrink-0 min-w-0 snap-start',
                            itemWrapperClassName
                        )}>
                        {isLoading ? (
                            <Skeleton className="w-full h-56 rounded-lg" />
                        ) : (
                            renderItem(item, currentPage * itemsPerPage + index)
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarouselSection;
