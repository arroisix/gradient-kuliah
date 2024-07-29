import ProductCard from 'commons/components/elements/ProductCard';
import Skeleton from 'commons/components/elements/Skeleton';
import { cn } from 'commons/utils';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md';

const RelatedCoursesSection = ({
    title,
    courses,
    isLoading
}: {
    title: string;
    courses?: CourseRecommendation[];
    isLoading?: boolean;
}): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { id } = router.query as { id: string };

    function scrollRight(): void {
        const SCROLL_CONSTANT = 200;
        if (ref?.current) {
            ref.current.scrollLeft += SCROLL_CONSTANT;
        }
    }

    function scrollLeft(): void {
        const SCROLL_CONSTANT = 200;
        if (ref?.current) {
            ref.current.scrollLeft -= SCROLL_CONSTANT;
        }
    }

    if (!isLoading && !courses) return <></>;

    return (
        <div className="flex flex-col items-center w-screen gap-5 py-4 md:w-full first:pt-8 last:pb-8 md:gap-6 bg-graphite-800">
            <div className="flex items-center justify-between w-full px-5 md:px-16 2xl:w-2/3 2xl:px-0">
                <h2 className="font-extrabold sm:text-sm md:text-lg">
                    {title}
                </h2>
                <div
                    className={cn(
                        'hidden gap-3 text-black',
                        courses && courses.length > 3 && 'md:flex'
                    )}>
                    <button
                        className="flex items-center justify-center w-8 h-8 text-2xl duration-200 bg-white rounded-full hover:bg-graphite-200"
                        onClick={scrollLeft}>
                        <MdOutlineChevronLeft size={24} />
                    </button>
                    <button
                        className="flex items-center justify-center w-8 h-8 text-2xl duration-200 bg-white rounded-full hover:bg-graphite-200"
                        onClick={scrollRight}>
                        <MdOutlineChevronRight size={24} />
                    </button>
                </div>
            </div>
            <div
                ref={ref}
                className="w-full px-5 overflow-x-scroll no-scrollbar snap-x scroll-smooth md:px-16 2xl:w-2/3 2xl:px-0">
                <div className="flex flex-col w-full gap-4 sm:w-max sm:flex-row md:gap-6">
                    {isLoading && (
                        <Skeleton
                            repeat={5}
                            isCustomSize
                            className="w-full h-48 sm:w-80"
                        />
                    )}
                    {courses?.map((course) => (
                        <ProductCard
                            key={course.id}
                            href={`/kelas/${course.course_slug}`}
                            orientation="vertical"
                            category="kelas"
                            product={{
                                title: course.course_name,
                                thumbnail: course.thumbnail,
                                inProgress: false,
                                latestProgress: 0
                            }}
                            heading="h3"
                            className="w-full sm:w-80"
                            eventName="Click Other Class Card"
                            eventPayload={{
                                'Course Slug': id,
                                'Target Course Slug': course.course_slug
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RelatedCoursesSection;
