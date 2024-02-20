import { useEffect, useState } from 'react';
import { useTracker } from 'tracker/tracker';
import CourseCard from '../components/CourseCard';
import CourseContainer from '../components/CourseContainer';
import useCourses from '../hooks/useCourses';

const PrivateCourses = ({ 
    myClass,
    section,
    sort,
}: { 
    myClass: boolean;
    section: 'all' | 'newly-released' | 'coming-soon';
    sort: 'latest' | 'popularity' | 'lexicography';
}): JSX.Element => {

    const tracker = useTracker();

    const { data, loading } = useCourses(section, sort);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        if (data) {
            setCourses(data.data);
        }
    }, [data]);

    useEffect(() => {
        if (courses.length > 0 && myClass) {
            setCourses(courses.filter((course) => course.is_subscribed));
        } else {
            if (data) {
                setCourses(data.data);
            }
        }
    }, [myClass, data]);

    return (
        <CourseContainer>
            {loading ? (
                <>
                    <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                    <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                    <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                    <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                    <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                </>
            ) : (
                courses.map((course: Course, index: number) => (
                    <CourseCard
                        isInGrid
                        course={course}
                        key={course.id}
                        onClick={() => {
                            tracker?.genericTrack(
                                'Click Private Class Card On Class Page',
                                {
                                    'Course Slug': course.slug
                                }
                            );
                        }}
                    />
                ))
            )}
        </CourseContainer>
    );
};

export default PrivateCourses;
