import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import { cn, slugify } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import React from 'react';

type DashboardSectionProps = {
    header: string;
    isLoading: boolean;
    isCourse?: boolean;
    items?: unknown[];
    showButton?: boolean;
    btnHref?: string;
    children: (item: unknown, i: number) => JSX.Element;
};

/** Styling assumptions
 * Sidebar width: 250px
 * Screen XL: 1536px
 */
const CAROUSEL =
    'w-screen relative gap-4 carousel carousel-center right-4 xl:gap-6';
const CAROUSEL_ITEM =
    'carousel-item first:ml-4 last:mr-4 lg:first:ml-0 lg:last:mr-0';

const DashboardSection = ({
    isLoading,
    isCourse,
    header,
    items,
    showButton,
    btnHref,
    children
}: DashboardSectionProps): JSX.Element => {
    const { is_subscribed: isSubscribed } = useCourseSubscription();

    return (
        <div className="relative space-y-4" data-tour="step-1">
            <div
                className={cn(
                    'flex items-center justify-between w-full',
                    isSubscribed &&
                        'md:w-[calc(100vw-250px-4rem)] lg:w-[calc(100vw-250px-12rem)]'
                )}>
                <h2 className="text-lg font-extrabold md:text-xl">{header}</h2>
                <Button
                    href={btnHref}
                    variant="custom"
                    eventName={`User click "Lihat Semua" on "${header}" Section`}
                    className={cn(
                        !showButton && 'hidden',
                        'text-xs text-black bg-white whitespace-nowrap'
                    )}>
                    Lihat Semua
                </Button>
            </div>
            <div
                className={cn(
                    CAROUSEL,
                    isSubscribed &&
                        'md:w-[calc(100vw-250px)] md:right-8 2xl:w-full 2xl:grid 2xl:grid-cols-4',
                    {
                        'lg:grid lg:right-auto lg:grid-cols-4 lg:w-[calc(100vw-250px-12rem)]':
                            !isCourse && isSubscribed,
                        'md:grid md:right-auto md:w-full md:grid-cols-4':
                            !isCourse && !isSubscribed,
                        'lg:right-24 2xl:right-auto': isCourse
                    }
                )}>
                {isLoading ? (
                    <Skeleton
                        repeat={4}
                        className={cn(
                            CAROUSEL_ITEM,
                            isSubscribed
                                ? 'md:first:ml-8 md:last:mr-8 lg:w-full'
                                : 'md:first:ml-0 md:last:mr-0 md:w-full',
                            '!px-0 h-60 !w-40 lg:!w-full'
                        )}
                    />
                ) : (
                    <>
                        {items?.map((item, i) => (
                            <div
                                key={`dashboard-${slugify(header)}-${i}`}
                                className={cn(
                                    CAROUSEL_ITEM,
                                    isCourse
                                        ? 'w-80 xl:w-96 2xl:w-full'
                                        : 'w-40',
                                    isSubscribed &&
                                        'md:first:ml-8 md:last:mr-8',
                                    {
                                        ' lg:w-full': !isCourse && isSubscribed,
                                        'md:first:ml-0 md:last:mr-0 md:w-full':
                                            !isCourse && !isSubscribed,
                                        'lg:first:ml-24 lg:last:mr-24 2xl:first:ml-0 2xl:last:mr-0':
                                            isCourse
                                    }
                                )}>
                                {children?.(item, i)}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardSection;
