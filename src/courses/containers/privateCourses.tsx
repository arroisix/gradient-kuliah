import { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import CourseContainer from '../components/CourseContainer';
import useCourses from '../hooks/courses';

const PrivateCourses = (): JSX.Element => {
    const { data, loading } = useCourses();
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        if (data) {
            setCourses(
                data.authAllCourses.edges.map(
                    (course: CourseNode) => course.node as Course
                )
            );
        }
    }, [data]);

    return (
        <CourseContainer>
            {loading && <h1>Tunggu Sebentar...</h1>}
            {!loading &&
                courses.map((course: Course) => (
                    <CourseCard course={course} key={course.uuid} />
                ))}
        </CourseContainer>
    );
};

export default PrivateCourses;
