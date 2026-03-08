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
    const tracker = useTracker();
    const carouselRef = useRef<HTMLDivElement>(null);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollButtons = useCallback(() => {
        const el = carouselRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }, []);

    useEffect(() => {
        updateScrollButtons();
        const el = carouselRef.current;
        if (!el) return;

        const onScroll = (): void => {
            // use rAF for smoother updates
            requestAnimationFrame(updateScrollButtons);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', updateScrollButtons);

        // update after render to account for dynamic widths
        requestAnimationFrame(updateScrollButtons);

        return () => {
            el.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, [items, updateScrollButtons]);

    // Determine one-card scroll distance (card width + gap)
    const getAdvance = useCallback(() => {
        const el = carouselRef.current;
        if (!el) return 0;
        const first = el.firstElementChild as HTMLElement | null;
        if (!first) return el.clientWidth * 0.9;
        const firstWidth = first.getBoundingClientRect().width;
        const styles = getComputedStyle(el);
        const gap =
            parseFloat((styles as any).columnGap || styles.gap || '0') || 0;
        return Math.max(1, Math.round(firstWidth + gap));
    }, []);

    const next = useCallback(() => {
        const el = carouselRef.current;
        if (!el) return;
        const dx = getAdvance();
        el.scrollBy({ left: dx, behavior: 'smooth' });
        tracker?.genericTrack(`Navigate ${eventCategory} Carousel`, {
            action: 'next',
            title
        });
    }, [getAdvance, tracker, eventCategory, title]);

    const prev = useCallback(() => {
        const el = carouselRef.current;
        if (!el) return;
        const dx = getAdvance();
        el.scrollBy({ left: -dx, behavior: 'smooth' });
        tracker?.genericTrack(`Navigate ${eventCategory} Carousel`, {
            action: 'previous',
            title
        });
    }, [getAdvance, tracker, eventCategory, title]);

    const displayItems = isLoading ? Array(itemsPerPage).fill(null) : items;

    if (!isLoading && (!items || items.length === 0)) {
        return null;
    }

    return (
        <div className="w-full mb-12">
            <div className="flex items-center justify-between mb-4">
                <Header title={title} />
                <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                        <button
                            onClick={prev}
                            disabled={!canScrollLeft}
                            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Scroll left">
                            <FiChevronLeft size={20} className="text-white" />
                        </button>
                        <button
                            onClick={next}
                            disabled={!canScrollRight}
                            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Scroll right">
                            <FiChevronRight size={20} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>

            <div
                ref={carouselRef}
                className="flex overflow-x-auto gap-4 xl:gap-6 pr-4 pb-4 no-scrollbar snap-x snap-mandatory">
                {displayItems.map((item, index) => (
                    <div
                        key={`${slugify(title)}-${index}`}
                        className={cn(
                            'shrink-0 min-w-0 snap-start',
                            itemWrapperClassName
                        )}>
                        {isLoading ? (
                            <Skeleton className="w-full h-56 rounded-lg" />
                        ) : (
                            renderItem(item, index)
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarouselSection;
