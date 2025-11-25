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
    itemWrapperClassName?: string;
    titleClassName?: string;
    hideNavigation?: boolean;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({
    title,
    items = [],
    isLoading,
    itemsPerPage = 4,
    renderItem,
    eventCategory,
    titleClassName,
    hideNavigation,
    itemWrapperClassName = 'w-[calc(100%-2rem)] sm:w-[calc((100%-1rem)/2.5)] lg:w-[calc((100%-2rem)/3.5)] xl:w-[calc((100%-3rem)/3.5)]'
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
            requestAnimationFrame(updateScrollButtons);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', updateScrollButtons);

        requestAnimationFrame(updateScrollButtons);

        return () => {
            el.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, [items, updateScrollButtons]);

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

    const showNav = !isLoading && (items?.length ?? 0) > 3;

    return (
        <div className="w-full mt-6 mb-2">
            <div className="flex items-center justify-between mb-4">
                <h2
                    className={cn(
                        'text-lg font-bold md:text-xl',
                        titleClassName
                    )}>
                    {title}
                </h2>
                {!hideNavigation && showNav && (
                    <div className="flex items-center gap-2">
                        <div className="flex gap-2">
                            <button
                                onClick={prev}
                                disabled={!canScrollLeft}
                                className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Scroll left">
                                <FiChevronLeft size={20} />
                            </button>
                            <button
                                onClick={next}
                                disabled={!canScrollRight}
                                className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Scroll right">
                                <FiChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="relative overflow-hidden mb-8">
                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto gap-4 xl:gap-6 scrollbar-hide pt-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {displayItems.map((item, index) => (
                        <div
                            key={`${slugify(title)}-${index}`}
                            className={cn(
                                'flex-shrink-0 snap-start',
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
        </div>
    );
};

export default CarouselSection;
