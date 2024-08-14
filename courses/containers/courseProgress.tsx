import ProductCard from 'commons/components/elements/ProductCard';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRef } from 'react';
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md';

export default function CourseProgress({
    courseProgresses
}: {
    courseProgresses: CourseProgress[];
}): JSX.Element {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { is_subscribed: isSubscribed } = useCourseSubscription();

    const scrollTo = (direction: 'left' | 'right'): void => {
        const scrollWidth = 300;
        const scrollAmount = direction === 'left' ? -scrollWidth : scrollWidth;
        scrollContainerRef.current?.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    if (courseProgresses.length == 0) return <></>;

    const getProduct = (progress: CourseProgress): Product => ({
        title: progress.course.course_name,
        thumbnail: progress.course.thumbnail,
        inProgress: true,
        latestProgress: 0,
        latestChapter: progress.latest_subchapter.subchapter_name
    });

    const getHref = (progress: CourseProgress): string => {
        if (!progress.course.slug) return '';
        if (progress.latest_subchapter) {
            return `/kelas/${progress.course.slug}/${progress.latest_subchapter.subchapter_slug}`;
        }
        return `/kelas/${progress.course.slug}`;
    };

    return (
        <section className="relative py-4 mb-6 sm:pb-6 space-y-4 z-[1] overflow-x-visible">
            <div className="absolute h-full -z-[1] -inset-x-full bg-neutral-900 top-0"></div>
            <div className="flex items-center justify-between w-full">
                <b>Kelasku</b>
                {courseProgresses.length > 2 && (
                    <div className="hidden gap-3 md:flex">
                        <button
                            className="text-black bg-white border-white hover:bg-neutral-300 btn btn-neutral btn-circle btn-sm"
                            onClick={() => scrollTo('left')}>
                            <MdOutlineChevronLeft />
                        </button>
                        <button
                            className="text-black bg-white border-white hover:bg-neutral-300 btn-neutral btn btn-circle btn-sm"
                            onClick={() => scrollTo('right')}>
                            <MdOutlineChevronRight />
                        </button>
                    </div>
                )}
            </div>
            <div
                ref={scrollContainerRef}
                className={cn(
                    'w-screen relative gap-4 carousel carousel-center right-4 md:right-8 lg:right-12',
                    isSubscribed
                        ? 'md:w-[calc(100vw-250px)] min-[1786px]:-inset-x-[calc((100vw-250px-1536px)/2)]'
                        : 'md:w-screen min-[1786px]:-inset-x-[calc((100vw-1536px)/2)]'
                )}>
                {courseProgresses?.map((courseProgress: CourseProgress) => (
                    <div
                        key={courseProgress.id}
                        className={cn(
                            'carousel-item first:ml-4 last:mr-4 md:first:ml-8 md:last:mr-8 lg:first:ml-12 lg:last:mr-12',
                            isSubscribed
                                ? 'min-[1786px]:first:ml-[calc((100vw-250px-1536px)/2)] min-[1786px]:last:mr-[calc((100vw-250px-1536px)/2)]'
                                : 'min-[1786px]:first:ml-[calc((100vw-1536px)/2)] min-[1786px]:last:mr-[calc((100vw-1536px)/2)]'
                        )}>
                        <ProductCard
                            key={courseProgress.id}
                            orientation="vertical"
                            category="kelas"
                            eventName="Click Class Card"
                            href={getHref(courseProgress)}
                            product={getProduct(courseProgress)}
                            className="flex-none w-56 min-[400px]:w-[348px]"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
