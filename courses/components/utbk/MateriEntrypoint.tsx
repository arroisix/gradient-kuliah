import { MateriCardSkeleton } from './MateriCardSkeleton';
import { MateriCard } from './MateriCard';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useGetPublicListCoursesV2Query } from 'courses/redux/api/publicCourseV2Api';
import { useGetPrivateListCoursesV2Query } from 'courses/redux/api/privateCourseV2Api';

function MateriEntrypoint() {
    const { isAuthenticated } = useAuth();

    const { isLoading: isPublicCoursesLoading, data: publicCourses } =
        useGetPublicListCoursesV2Query(
            { type: 'UTBK' },
            { skip: isAuthenticated }
        );

    const { isLoading: isPrivateCoursesLoading, data: privateCourses } =
        useGetPrivateListCoursesV2Query({}, { skip: !isAuthenticated });

    const courses = publicCourses
        ? publicCourses.data
        : privateCourses
        ? privateCourses.data
        : [];

    return (
        <>
            <h1 className="text-white font-bold text-2xl leading-tight mb-6">
                Modul Belajar
            </h1>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                {isPublicCoursesLoading || isPrivateCoursesLoading ? (
                    <>
                        <MateriCardSkeleton />
                        <MateriCardSkeleton />
                        <MateriCardSkeleton />
                        <MateriCardSkeleton />
                        <MateriCardSkeleton />
                        <MateriCardSkeleton />
                    </>
                ) : (
                    courses.map((course) => (
                        <MateriCard
                            key={course.id}
                            id={course.id}
                            course_name={course.course_name}
                            cover={course.cover}
                            tags={course.tags}
                            latest_subchapter_name={
                                course.latest_subchapter_name
                            }
                            percentage_progress={course.percentage_progress}
                        />
                    ))
                )}
            </div>
        </>
    );
}

export { MateriEntrypoint };
