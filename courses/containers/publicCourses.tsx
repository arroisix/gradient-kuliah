import { useGetPublicListCoursesQuery } from 'courses/redux/api/publicCourseApi';
import { useTracker } from 'tracker/tracker';
import CourseCard from '../components/CourseCard';
import CourseContainer from '../components/CourseContainer';

const PublicCourses = (): JSX.Element => {
    const tracker = useTracker();

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
                    <CourseCard
                        course={course}
                        key={course.id}
                        onClick={() => {
                            tracker?.genericTrack(
                                'Click Public Class Card On Class Page',
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

export default PublicCourses;
