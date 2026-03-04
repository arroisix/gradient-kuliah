import { MateriCardSkeleton } from './MateriCardSkeleton';
import { MateriCard } from './MateriCard';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useGetPublicListCoursesV2Query } from 'courses/redux/api/publicCourseV2Api';
import { useGetPrivateListCoursesV2Query } from 'courses/redux/api/privateCourseV2Api';
import { cn } from 'commons/utils';

function MateriEntrypoint() {
    const { profile, isLoadingProfile } = useAuth();

    const { isLoading: isPublicCoursesLoading, data: publicCourses } =
        useGetPublicListCoursesV2Query(
            { type: 'UTBK' },
            {
                skip:
                    !!profile ||
                    isLoadingProfile === undefined ||
                    isLoadingProfile
            }
        );

    const { isLoading: isPrivateCoursesLoading, data: privateCourses } =
        useGetPrivateListCoursesV2Query({}, { skip: !profile });

    const courses = publicCourses
        ? publicCourses.data
        : privateCourses
        ? privateCourses.data
        : [];

    return (
        <div className={cn('w-full max-w-lg mx-auto', 'lg:max-w-5xl')}>
            <h1 className="text-white font-bold text-2xl leading-tight mb-6">
                Materi
            </h1>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
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
                            href={`/utbk/materi/${course.slug}/${course.latest_chapter_slug}/${course.latest_subchapter_slug}`}
                            course_name={course.course_name}
                            cover={course.cover}
                            tags={course.tags}
                            latest_subchapter_name={
                                course.latest_subchapter_name
                            }
                            percentage_progress={course.percentage_progress}
                            is_coming_soon={course.is_coming_soon}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export { MateriEntrypoint };
