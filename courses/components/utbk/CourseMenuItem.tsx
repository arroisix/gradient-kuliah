import { useAuth } from 'authentication/contexts/AuthProvider';
import { useGetLearningProgressQuery } from 'courses/redux/api/learningExperienceApi';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface CourseMenuItemProps {
    course: Course;
}

function CourseMenuItem({ course }: CourseMenuItemProps): JSX.Element {
    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const { isAuthenticated } = useAuth();
    const { data, isLoading } = useGetLearningProgressQuery(course.slug, {
        skip: !isAuthenticated || !course.slug
    });

    // TODO: change with chapter_slug
    const chapterSlug = isAuthenticated
        ? data?.latest_watch_video
            ? data.latest_watch_video.chapter_id
            : data?.first_video_in_course?.chapter_id
        : '';

    const subChapterSlug = isAuthenticated
        ? data?.latest_watch_video
            ? data.latest_watch_video.subchapter.subchapter_slug
            : data?.first_video_in_course?.subchapter_slug
        : '';

    return (
        <Link
            href={`/utbk/materi/${course.slug}/${chapterSlug}/${subChapterSlug}`}
            className={`${
                isAuthenticated && (!data || isLoading)
                    ? 'pointer-events-none'
                    : ''
            } ${
                course.slug === slug_subtest
                    ? 'bg-[#7D89CC]'
                    : 'bg-transparent hover:bg-[#333333]'
            } w-full rounded-lg p-3 flex gap-4 items-center transition-all duration-300`}>
            <div className="bg-[#333333] rounded-full p-2 flex">
                <Image
                    src={course.cover}
                    alt={course.course_name}
                    width={32}
                    height={32}
                    className="object-cover object-center"
                />
            </div>

            <div className="space-y-1">
                <h5 className="text-white font-semibold text-base leading-[140%]">
                    {course.course_name}
                </h5>

                <p
                    className={`${
                        course.slug === slug_subtest
                            ? 'text-white'
                            : 'text-[#999999]'
                    } text-sm leading-[160%]`}>
                    {course.tags?.join(', ')}.
                </p>
            </div>
        </Link>
    );
}

export { CourseMenuItem };
