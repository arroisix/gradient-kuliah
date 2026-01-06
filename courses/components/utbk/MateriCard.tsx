import { useAuth } from 'authentication/contexts/AuthProvider';
import {
    useGetCourseContentQuery,
    useGetSubchapterQuery
} from 'courses/redux/api/courseApi';
import { useGetLearningProgressQuery } from 'courses/redux/api/learningExperienceApi';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { IoMdTime } from 'react-icons/io';

type MateriCardProps = Pick<
    Course,
    | 'course_name'
    | 'cover'
    | 'tags'
    | 'latest_subchapter_name'
    | 'percentage_progress'
    | 'slug'
>;

function MateriCard({
    course_name,
    cover,
    tags,
    latest_subchapter_name,
    percentage_progress,
    slug
}: MateriCardProps): JSX.Element {
    const { isAuthenticated } = useAuth();
    const progress = Math.min(
        Math.max(((percentage_progress ?? 0) / 100) * 100, 0),
        100
    );

    const { data: learningProgress, isLoading: isLoadingProgress } =
        useGetLearningProgressQuery(slug, {
            skip: !isAuthenticated || !slug
        });

    const { data: courseContent, isLoading: isLoadingCourse } =
        useGetCourseContentQuery({ slug }, { skip: isAuthenticated || !slug });

    const firstChapter = useMemo((): CourseChapter | undefined => {
        return (courseContent?.chapters.length ?? 0) > 0
            ? courseContent?.chapters[0]
            : undefined;
    }, [courseContent]);

    const { data: subchapter, isLoading: isLoadingSubchapter } =
        useGetSubchapterQuery(
            { chapterId: firstChapter?.chapter_id ?? '' },
            { skip: isAuthenticated || !firstChapter }
        );

    const firstSubchapter = useMemo((): SubChapter | undefined => {
        return (subchapter?.subchapters.length ?? 0) > 0
            ? subchapter?.subchapters[0]
            : undefined;
    }, [subchapter?.subchapters]);

    const isLoading =
        isLoadingProgress || isLoadingCourse || isLoadingSubchapter;

    const chapterSlug = isAuthenticated
        ? learningProgress?.latest_watch_video
            ? learningProgress.latest_watch_video.chapter_id
            : learningProgress?.first_video_in_course?.chapter_id
        : firstChapter?.chapter_id;

    const subChapterSlug = isAuthenticated
        ? learningProgress?.latest_watch_video
            ? learningProgress.latest_watch_video.subchapter.subchapter_slug
            : learningProgress?.first_video_in_course?.subchapter_slug
        : firstSubchapter?.subchapter_slug;

    return (
        <Link
            href={`/utbk/materi/${slug}/${chapterSlug}/${subChapterSlug}`}
            className={`${
                isLoading ? 'pointer-events-none' : ''
            } bg-[#222222] w-full rounded-lg p-4 flex gap-4 items-center`}>
            <div className="bg-[#333333] rounded-full p-2 flex">
                <Image
                    src={cover}
                    alt={course_name}
                    width={32}
                    height={32}
                    className="object-cover object-center"
                />
            </div>

            <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                    <h2 className="text-white font-semibold text-sm">
                        {course_name}
                    </h2>

                    {percentage_progress ? (
                        <span
                            className={`${
                                percentage_progress === 100
                                    ? 'text-[#03AC5C]'
                                    : 'text-[#B6A6F3]'
                            } font-semibold`}>
                            {percentage_progress}%
                        </span>
                    ) : (
                        <span className="text-[#999999] font-semibold">0%</span>
                    )}
                </div>

                {tags ? (
                    <p className="text-[#999999] text-sm mb-2">
                        {tags.join(', ')}.
                    </p>
                ) : (
                    <></>
                )}

                <div className="bg-[#4B4E5F] rounded-full overflow-hidden w-full h-2 mb-4">
                    <div
                        className="bg-[#B6A6F3] rounded-full transition-all duration-500 ease-out h-full"
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={percentage_progress ?? 0}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    />
                </div>

                {latest_subchapter_name ? (
                    <p
                        className={`${
                            percentage_progress
                                ? 'text-white'
                                : 'text-[#999999]'
                        } text-sm flex items-center gap-2`}>
                        {percentage_progress && percentage_progress < 100 ? (
                            <IoMdTime className="text-white w-4 h-4" />
                        ) : (
                            <></>
                        )}

                        {percentage_progress
                            ? percentage_progress === 100
                                ? 'Selesai'
                                : latest_subchapter_name
                            : 'Belum dimulai'}
                    </p>
                ) : (
                    <></>
                )}
            </div>
        </Link>
    );
}

export { MateriCard };
