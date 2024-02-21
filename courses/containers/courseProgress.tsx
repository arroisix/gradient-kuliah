import CourseCard from "courses/components/CourseCard";
import { useGrid } from "courses/contexts/GridProvider"
import { useGetCourseProgressV2Query } from "courses/redux/api/courseV2Api";
import { useEffect, useRef } from "react";
import { useTracker } from "tracker/tracker";

export default function CourseProgress(): JSX.Element {
  const tracker = useTracker();
  const {data: courseProgresses, isLoading} = useGetCourseProgressV2Query();
  const {cellWidth, gapWidth} = useGrid();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollTo = (direction: 'left' | 'right') => {
    console.log(gapWidth)
    const scrollWidth = cellWidth! + gapWidth!;
    const scrollAmount = direction === 'left' ? -scrollWidth! : scrollWidth!;
    scrollContainerRef.current?.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative w-full overflow-x-scroll">
      <div className="flex justify-between w-full md:pr-8 xl:pr-12">
        <h1 className="text-4xl font-bold md:text-4xl">
          Kelasku
        </h1>
        <div className="hidden md:flex gap-4 text-black">
          <button 
            className="bg-white w-[40px] h-[40px] rounded-full flex justify-center items-center"
            onClick={() => scrollTo('left')}
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.00047 11.2902C7.39047 10.9002 7.39047 10.2702 7.00047 9.88022L3.12047 6.00022L7.00047 2.12022C7.39047 1.73022 7.39047 1.10022 7.00047 0.710222C6.61047 0.320222 5.98047 0.320222 5.59047 0.710222L1.00047 5.30022C0.610469 5.69022 0.610469 6.32022 1.00047 6.71022L5.59047 11.3002C5.97047 11.6802 6.61047 11.6802 7.00047 11.2902Z" fill="black"/>
            </svg>
          </button>
          <button 
            className="bg-white w-[40px] h-[40px] rounded-full flex justify-center items-center"
            onClick={() => scrollTo('right')}
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.999531 0.709778C0.609531 1.09978 0.609531 1.72978 0.999531 2.11978L4.87953 5.99978L0.999531 9.87978C0.609531 10.2698 0.609531 10.8998 0.999531 11.2898C1.38953 11.6798 2.01953 11.6798 2.40953 11.2898L6.99953 6.69978C7.38953 6.30978 7.38953 5.67978 6.99953 5.28978L2.40953 0.699778C2.02953 0.319778 1.38953 0.319778 0.999531 0.709778Z" fill="black"/>
            </svg>
          </button>
        </div>
      </div>
      <div ref={scrollContainerRef} className="overflow-x-scroll w-full flex gap-4 md:gap-1 lg:gap-4 mt-6 md:pr-8 xl:pr-12">
        {isLoading || !cellWidth ? (
          <>
            <div className={`p-4 h-[300px] bg-neutral-600 animate-pulse rounded-lg`} />
            <div className={`p-4 h-[300px] bg-neutral-600 animate-pulse rounded-lg`} />
            <div className={`p-4 h-[300px] bg-neutral-600 animate-pulse rounded-lg`} />
            <div className={`p-4 h-[300px] bg-neutral-600 animate-pulse rounded-lg`} />
          </>
        ) : (
          courseProgresses?.map((courseProgress: CourseProgress) => (
            <CourseCard 
              isInGrid={false}
              course={courseProgress.course}
              latestSubChapter={courseProgress.latest_subchapter}
              latestWatchProgress={courseProgress.latest_watch_progress}
              key={courseProgress.id}
              onClick={() => {
                  tracker?.genericTrack(
                      'Click Public Class Card On Class Page',
                      {
                          'Course Slug': courseProgress.course.slug
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
