import { useGetPublicListCoursesQuery } from 'courses/redux/api/publicCourseApi';
import CourseCard from '../components/CourseCard';
import CourseContainer from '../components/CourseContainer';

const PublicCourses = (): JSX.Element => {
    const { data: courses, isLoading } = useGetPublicListCoursesQuery({});
    return (
        <CourseContainer>
            {isLoading ? (
                <>
                    <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                    <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                    <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                    <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                    <div className="p-4 h-52 w-full bg-neutral-600 animate-pulse rounded-lg" />
                </>
            ) : (
                courses?.data.map((course: Course) => (
                    <CourseCard course={course} key={course.id} />
                ))
            )}
        </CourseContainer>
    );
};

export default PublicCourses;
