import CourseCard from "courses/components/CourseCard";
import { useGrid } from "courses/contexts/GridProvider"
import { useGetCourseProgressV2Query } from "courses/redux/api/courseV2Api";
import { useEffect } from "react";
import { useTracker } from "tracker/tracker";

export default function CourseProgress(): JSX.Element {
  const tracker = useTracker();
  const {data: courseProgresses, isLoading} = useGetCourseProgressV2Query();
  const {cellWidth} = useGrid();
  console.log(cellWidth)
  
  return (
    <section>
      <h1 className="text-4xl font-bold md:text-4xl">
        Kelasku
      </h1>
      <div className="overflow-x-hidden flex gap-4 md:gap-1 lg:gap-4 mt-6">
        {isLoading ? (
          <>
            <div className={`p-4 h-[300px] bg-neutral-600 animate-pulse rounded-lg`} style={{ width: `${cellWidth}px` }} />
            <div className={`p-4 h-[300px] bg-neutral-600 animate-pulse rounded-lg`} style={{ width: `${cellWidth}px` }} />
            <div className={`p-4 h-[300px] bg-neutral-600 animate-pulse rounded-lg`} style={{ width: `${cellWidth}px` }} />
            <div className={`p-4 h-[300px] bg-neutral-600 animate-pulse rounded-lg`} style={{ width: `${cellWidth}px` }} />
          </>
        ) : (
          courseProgresses?.map((courseProgress: CourseProgress) => (
            <CourseCard 
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
  )
}
