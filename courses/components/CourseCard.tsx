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

    useEffect(() => {
        if (course && !course.is_only_notebook)
            router.prefetch(`/kelas/${course.slug}`);
    }, [course]);

    const decideUrl = (): string => {
        if (course.is_coming_soon && !course.slug) {
            return '';
        }
        if (course.is_only_notebook) {
            return `/kelas/${course.slug}/astronotes`;
        }
        if (latestSubChapter) {
            return `/kelas/${course.slug}/${latestSubChapter.subchapter_slug}`;
        }
        return `/kelas/${course.slug}`;
    };

    const url = decideUrl();

    const { cellRef, cellWidth, screenWidth } = useGrid();

    return (
        <Link href={url} onClick={() => onClick?.()}>
            <div
                className={`relative flex items-end overflow-hidden rounded-lg cursor-pointer h-[224px] bg-neutral-800 border-[0.5px] border-[#666666]`}
                style={{
                    width: !isInGrid
                        ? `${
                              screenWidth! < 768 ? cellWidth! - 150 : cellWidth
                          }px`
                        : 'auto',
                    background: `url(${
                        !latestSubChapter
                            ? course.thumbnail
                            : latestSubChapter.thumbnail
                    }) center / cover no-repeat, #333333`
                }}
                {...(isInGrid && isFirstInGrid ? { ref: cellRef } : {})}>
                <div className="bg-[#121212] w-full md:px-[16px] px-[12px] pt-[8px] pb-[12px]">
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
                    <p className="mt-1 font-semibold line-clamp-2 text-ellipsis">
                        {course.course_name}
                    </p>
                    {latestSubChapter && (
                        <p className="text-sm text-[#999999] mt-1 line-clamp-2 text-ellipsis">
                            Bab: {latestSubChapter.subchapter_name}
                        </p>
                    )}
                </div>
                {course.is_coming_soon && (
                    <div
                        className="absolute px-4 py-1 font-bold rounded-full top-4 left-4"
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
        </Link>
    );
};

export default CourseCard;
