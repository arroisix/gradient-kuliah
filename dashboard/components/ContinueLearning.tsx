import Image from 'next/image';
import { useRouter } from 'next/router';
import { HiOutlinePlusSm } from 'react-icons/hi';
import ProgressBar from './ProgressBar';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import {
    LearningProgress,
    useGetStudentLearningProgressQuery
} from 'dashboard/redux/api/dashboardApi';

const ContinueLearning = ({
    className
}: {
    className?: string;
}): JSX.Element => {
    const { data, isLoading } = useGetStudentLearningProgressQuery();

    return (
        <div className={`flex flex-col gap-3 md:gap-5 ${className}`}>
            <h3 className="text-lg font-extrabold">Lanjut Belajar</h3>
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    <div className="p-4 h-44 w-full bg-neutral-800 animate-pulse rounded-lg" />
                    <div className="p-4 h-44 w-full bg-neutral-800 animate-pulse rounded-lg" />
                    <div className="p-4 h-44 w-full bg-neutral-800 animate-pulse rounded-lg" />
                </div>
            ) : (
                <>
                    {data?.learning_progress.length === 0 ? (
                        <NoLearningProgress />
                    ) : (
                        <ListContinueLearning
                            learning_progress={data?.learning_progress}
                        />
                    )}
                </>
            )}
        </div>
    );
};

const ListContinueLearning = ({
    learning_progress
}: {
    learning_progress?: LearningProgress[];
}): JSX.Element => {
    const router = useRouter();

    return (
        <div className="relative flex flex-col gap-4">
            {learning_progress?.map(
                ({
                    course_slug,
                    chapter_id,
                    subchapter_id,
                    subchapter_thumbnail,
                    subchapter_name,
                    course_name,
                    progress_percentage
                }) => (
                    <div
                        key={course_slug}
                        className="flex flex-col md:flex-row gap-[8px] md:gap-[30px] items-start justify-start md:items-center md:justify-center cursor-pointer"
                        onClick={() =>
                            router.push(
                                `/kelas/${course_slug}/belajar/video/${chapter_id}/${subchapter_id}`
                            )
                        }
                        aria-hidden>
                        <div className="relative w-[260px] md:w-[160px] lg:w-[260px] min-h-[150px] rounded-lg overflow-hidden">
                            <Image
                                src={subchapter_thumbnail}
                                alt={subchapter_name}
                                layout="fill"
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col gap-[5px] w-full">
                            <span className="inline-block font-body">
                                {subchapter_name}
                            </span>
                            <span className="inline-block font-body text-xs text-neutral-200">
                                {course_name}
                            </span>
                            <ProgressBar percent={progress_percentage} />
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

const NoLearningProgress = (): JSX.Element => {
    const router = useRouter();
    const { is_subscribed } = useCourseSubscription();

    return (
        <div
            className="flex flex-col md:flex-row gap-[8px] md:gap-[30px] items-start justify-start md:items-center md:justify-center cursor-pointer"
            onClick={() =>
                router.push(`${is_subscribed ? '/kelas' : '/langganan'}`)
            }
            aria-hidden>
            <div className="relative flex items-center justify-center w-[260px] md:w-[160px] lg:w-[260px] min-h-[150px] rounded-lg bg-[#242424]">
                <HiOutlinePlusSm size={24} className="text-[#373737]" />
            </div>
            <div className="flex flex-col gap-[5px] w-full">
                <span className="inline-block font-body">
                    Belum ada Progress Belajar
                </span>
                <ProgressBar percent={'0%'} />
            </div>
        </div>
    );
};

export default ContinueLearning;
