import { useGetPublicListCoursesQuery } from 'courses/redux/api/publicCourseApi';
import CourseCard from '../components/CourseCard';
import CourseContainer from '../components/CourseContainer';

const PublicCourses = (): JSX.Element => {
    const { data: courses } = useGetPublicListCoursesQuery({});
    return (
        <CourseContainer>
            {courses?.data.map((course: Course) => (
                <CourseCard course={course} key={course.id} />
            ))}
        </CourseContainer>
    );
};

export default PublicCourses;
