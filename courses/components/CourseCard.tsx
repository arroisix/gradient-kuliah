import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import useTransition from 'commons/hooks/useTransition';
import { useGrid } from 'courses/contexts/GridProvider';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { IoCheckmarkCircle, IoTime } from 'react-icons/io5';

type CourseCardProps = {
    course: Course;
    latestSubChapter?: SubChapter;
    latestWatchProgress?: WatchProgress;
    isInGrid?: boolean;
    isFirstInGrid?: boolean;
    onClick?: () => void;
};

const CourseCard = ({
    course,
    latestSubChapter,
    latestWatchProgress,
    isInGrid,
    isFirstInGrid,
    onClick
}: CourseCardProps): JSX.Element => {
    const router = useRouter();
    const loadingTransition = useTransition(router);

    useEffect(() => {
        if (course && !course.is_only_notebook)
            router.prefetch(`/kelas/${course.slug}`);
    }, [course]);

    const decideUrl = (): string => {
        if (course.is_only_notebook) {
            return `/kelas/${course.slug}/astronotes`;
        }
        if (latestSubChapter) {
            return `/kelas/${course.slug}/belajar/video/${latestSubChapter.chapter_id}/${latestSubChapter.id}`;
        }
        return `/kelas/${course.slug}`;
    };

    const { cellRef, cellWidth, screenWidth } = useGrid();

    return (
        <Link href={decideUrl()} onClick={() => onClick?.()}>
            <div
                className={`relative flex items-end overflow-hidden rounded-lg cursor-pointer h-[300px] bg-neutral-800`}
                style={{
                    width: !isInGrid
                        ? `${
                              screenWidth! < 768 ? cellWidth! - 150 : cellWidth
                          }px`
                        : 'auto',
                    background: `url(${course.thumbnail}) center / cover no-repeat, #333333`
                }}
                {...(isInGrid && isFirstInGrid ? { ref: cellRef } : {})}>
                <div className="bg-[#121212] w-full p-4">
                    {latestWatchProgress &&
                        (!latestWatchProgress.is_finished ? (
                            <div className="flex items-center text-[#F2C04C]">
                                <IoTime />
                                <p className="ml-2 text-xs">In Progress</p>
                            </div>
                        ) : (
                            <div className="flex items-center text-[#43B75D]">
                                <IoCheckmarkCircle />
                                <p className="ml-2 text-xs">Completed</p>
                            </div>
                        ))}
                    <p className="mt-1 font-semibold">{course.course_name}</p>
                    {latestSubChapter && (
                        <p className="text-sm text-[#999999] mt-1">
                            Bab: {latestSubChapter.subchapter_name}
                        </p>
                    )}
                </div>
                {course.is_coming_soon && (
                    <div
                        className="px-4 rounded-full py-1 absolute top-4 left-4 font-bold"
                        style={{
                            background:
                                'linear-gradient(90deg, #F2B04C 0%, #E4B50D 68.5%, #E48E0D 100%)'
                        }}>
                        Segera hadir
                    </div>
                )}
                {!course.is_coming_soon && course.is_new && (
                    <div className="bg-[#E9202A] px-4 rounded-full py-1 absolute top-4 left-4 font-bold">
                        Baru
                    </div>
                )}
            </div>
            {loadingTransition && <LoadingBackdrop />}
        </Link>
    );
};

export default CourseCard;
