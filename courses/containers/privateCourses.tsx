import { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import CourseContainer from '../components/CourseContainer';
import useCourses from '../hooks/useCourses';

const PrivateCourses = ({ myClass }: { myClass: boolean }): JSX.Element => {
    const { data, loading } = useCourses();
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
                courses.map((course: Course) => (
                    <CourseCard course={course} key={course.id} />
                ))
            )}
        </CourseContainer>
    );
};

export default PrivateCourses;
