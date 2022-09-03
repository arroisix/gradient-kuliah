import { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import CourseContainer from '../components/CourseContainer';
import useCourses from '../hooks/useCourses';

export const COMING_SOON_COURSE = [
    {
        course_name: 'Pengantar Teknik Sipil & Lingkungan',
        thumbnail:
            'https://d2uqn6ndx4ow3t.cloudfront.net/courses/intro-sipil/assets/hero_asih_new.jpg',
        comingSoon: true
    }
];

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
            {loading && <h1>Tunggu Sebentar...</h1>}
            {!loading &&
                courses.map((course: Course) => (
                    <CourseCard course={course} key={course.id} />
                ))}
        </CourseContainer>
    );
};

export default PrivateCourses;
