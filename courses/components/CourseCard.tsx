import { cn } from 'commons/utils';
import Link from 'next/link';
import { IoCheckmarkCircle, IoTime } from 'react-icons/io5';
import { useTracker } from 'tracker/tracker';

type CourseCardProps = {
    course: Course;
    latestSubChapter?: SubChapter;
    latestWatchProgress?: WatchProgress;
    eventName?: string;
    eventPayload?: { [key: string]: string };
} & PropsWithClassName;

const CourseCard = ({
    course,
    latestSubChapter,
    latestWatchProgress,
    eventName = 'Click Class Card',
    eventPayload,
    className
}: CourseCardProps): JSX.Element => {
    const tracker = useTracker();

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
    const CourseLabel = latestWatchProgress ? 'p' : 'h2';

    return (
        <Link
            href={decideUrl()}
            onClick={() =>
                tracker?.genericTrack(eventName, {
                    ...eventPayload,
                    'Course Slug': course.slug
                })
            }>
            <div
                className={cn(
                    'relative flex items-end overflow-hidden rounded-lg cursor-pointer h-56 bg-neutral-800 border-[0.5px] border-[#666666]',
                    className
                )}
                style={{
                    background: `url(${
                        !latestSubChapter
                            ? course.thumbnail
                            : latestSubChapter.thumbnail
                    }) center / cover no-repeat, #333333`
                }}>
                <div className="bg-[#121212] w-full md:px-4 px-3 pt-2 pb-3">
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
                    <CourseLabel className="mt-1 font-semibold line-clamp-2 text-ellipsis">
                        {course.course_name}
                    </CourseLabel>
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
