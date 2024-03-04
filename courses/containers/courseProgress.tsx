import CourseCard from 'courses/components/CourseCard';
import { useGrid } from 'courses/contexts/GridProvider';
import { useRef } from 'react';
import { useTracker } from 'tracker/tracker';
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md';

export default function CourseProgress({
    courseProgresses,
    isLoading
}: {
    courseProgresses: CourseProgress[];
    isLoading: boolean;
}): JSX.Element {
    const tracker = useTracker();
    const { cellWidth, gapWidth, screenWidth } = useGrid();

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollTo = (direction: 'left' | 'right') => {
        const scrollWidth = cellWidth! + gapWidth!;
        const scrollAmount =
            direction === 'left' ? -scrollWidth! : scrollWidth!;
        scrollContainerRef.current?.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <section className="relative w-full overflow-x-auto">
            <div className="flex justify-between items-center w-full px-4 md:px-8 xl:px-12">
                <h1 className="text-4xl font-bold md:text-4xl">Kelasku</h1>
                <div className="hidden md:flex gap-4 text-black">
                    <button
                        className="bg-white hover:bg-[#F8F8F8] duration-200 w-[40px] h-[40px] rounded-full flex justify-center items-center text-2xl"
                        onClick={() => scrollTo('left')}>
                        <MdOutlineChevronLeft />
                    </button>
                    <button
                        className="bg-white hover:bg-[#F8F8F8] duration-200 w-[40px] h-[40px] rounded-full flex justify-center items-center text-2xl"
                        onClick={() => scrollTo('right')}>
                        <MdOutlineChevronRight />
                    </button>
                </div>
            </div>
            <div
                ref={scrollContainerRef}
                className="overflow-x-scroll flex gap-4 md:gap-1 lg:gap-4 mt-6 px-4 md:px-8 xl:px-12"
                style={{
                    maxWidth: `${
                        screenWidth! >= 768 ? screenWidth! - 250 : screenWidth
                    }px`,
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none'
                }}>
                {isLoading || !cellWidth ? (
                    <>
                        <div className="p-4 h-[224px] w-[300px] bg-neutral-600 animate-pulse rounded-lg" />
                        <div className="p-4 h-[224px] w-[300px] bg-neutral-600 animate-pulse rounded-lg" />
                        <div className="p-4 h-[224px] w-[300px] bg-neutral-600 animate-pulse rounded-lg" />
                    </>
                ) : (
                    courseProgresses?.map((courseProgress: CourseProgress) => (
                        <CourseCard
                            isInGrid={false}
                            course={courseProgress.course}
                            latestSubChapter={courseProgress.latest_subchapter}
                            latestWatchProgress={
                                courseProgress.latest_watch_progress
                            }
                            key={courseProgress.id}
                            onClick={() => {
                                tracker?.genericTrack(
                                    'Click Public Class Card On Class Page',
                                    {
                                        'Course Slug':
                                            courseProgress.course.slug
                                    }
                                );
                            }}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
