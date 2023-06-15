import Image from 'next/image';
import { useRouter } from 'next/router';
import ProgressBar from './ProgressBar';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetStudentLearningProgressQuery } from 'dashboard/redux/api/dashboardApi';
import Button from 'commons/components/elements/Button';

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
    learning_progress?: StudentLearningProgress[];
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
        <div className="flex flex-col gap-[64px] relative w-full md:max-w-[633px] bg-[#1D1D1D] p-10 rounded-xl overflow-hidden">
            <div>
                <h6 className="font-extrabold text-[24px] pb-[10px]">
                    Belum ada progress belajar
                </h6>
                <span className="inline-block font-body sm:max-w-[70%] md:max-w-full lg:max-w-[70%]">
                    {is_subscribed
                        ? 'Anda sudah memiliki kelas. Mulai belajar sekarang'
                        : 'Anda belum memiliki kelas apapun. Mulai dengan  memilih kelas yang tepat umtuk anda'}
                </span>
            </div>
            <div>
                <Button
                    variant="custom"
                    className="bg-white font-sans font-bold text-black text-xs"
                    onClick={() =>
                        router.push(
                            `${is_subscribed ? '/kelas' : '/langganan'}`
                        )
                    }>
                    {is_subscribed ? 'Mulai Belajar' : 'Beli Kelas'}
                </Button>
            </div>
            <div className="absolute w-[252px] h-[230px] bottom-0 right-0">
                <Image
                    src={
                        is_subscribed
                            ? 'https://assets.gradient.academy/assets/globe.png'
                            : 'https://assets.gradient.academy/assets/book-shelf.png'
                    }
                    alt={'subchapter_name'}
                    layout="fill"
                    className="object-contain"
                />
            </div>
        </div>
    );
};

export default ContinueLearning;
