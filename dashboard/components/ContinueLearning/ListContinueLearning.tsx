import Image from 'next/image';
import Link from 'next/link';
import { useTracker } from 'tracker/tracker';
import ProgressBar from '../ProgressBar';

export const ListContinueLearning = ({
    learningProgress
}: {
    learningProgress?: StudentLearningProgress[];
}): JSX.Element => {
    const tracker = useTracker();

    return (
        <div className="relative flex flex-col gap-[18px] lg:gap-6">
            {learningProgress?.map(
                ({
                    course_slug,
                    chapter_id,
                    subchapter_id,
                    subchapter_thumbnail,
                    subchapter_name,
                    course_name,
                    progress_percentage
                }) => (
                    <Link
                        href={`/kelas/${course_slug}/belajar/video/${chapter_id}/${subchapter_id}`}
                        onClick={() => {
                            tracker?.genericTrack(
                                'Click Latest Watch Progress Card',
                                {
                                    'Course Name': course_name,
                                    'Video Title': subchapter_name
                                }
                            );
                        }}
                        key={`${course_slug}-${chapter_id}-${subchapter_id}`}>
                        <div className="flex gap-[18px] md:gap-[30px] items-center justify-start md:justify-center cursor-pointer">
                            <div className="relative min-w-[120px] sm:min-w-[160px] lg:min-w-[220px] w-1/2 min-h-[83px] sm:h-[120px] lg:h-[150px] max-w-[260px]">
                                <Image
                                    src={subchapter_thumbnail}
                                    alt={subchapter_name}
                                    layout="fill"
                                    className="object-cover object-top rounded-lg"
                                />
                            </div>
                            <div className="flex flex-col gap-[2px] w-full overflow-hidden">
                                <p className="p-0 font-body line-clamp-1">
                                    {subchapter_name}
                                </p>
                                <p className="text-xs font-body text-neutral-200 line-clamp-1">
                                    {course_name}
                                </p>
                                <ProgressBar
                                    className="pt-3"
                                    percent={progress_percentage}
                                />
                            </div>
                        </div>
                    </Link>
                )
            )}
        </div>
    );
};
