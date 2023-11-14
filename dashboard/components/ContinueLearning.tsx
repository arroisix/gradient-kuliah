import Image from 'next/image';
import { useRouter } from 'next/router';
import ProgressBar from './ProgressBar';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetStudentLearningProgressQuery } from 'dashboard/redux/api/dashboardApi';
import Button from 'commons/components/elements/Button';
import { useTracker } from 'tracker/tracker';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { skipToken } from '@reduxjs/toolkit/dist/query';

const ContinueLearning = ({
    className
}: {
    className?: string;
}): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data, isLoading } = useGetStudentLearningProgressQuery(
        !isAuthenticated ? skipToken : undefined
    );

    return (
        <div className={`flex flex-col gap-3 md:gap-5 ${className}`}>
            <h3 className="text-lg font-extrabold">Lanjut Belajar</h3>
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    <div className="w-full p-4 rounded-lg h-44 bg-neutral-800 animate-pulse" />
                    <div className="w-full p-4 rounded-lg h-44 bg-neutral-800 animate-pulse" />
                    <div className="w-full p-4 rounded-lg h-44 bg-neutral-800 animate-pulse" />
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
    const tracker = useTracker();

    return (
        <div className="relative flex flex-col gap-[18px] lg:gap-6">
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
                        className="flex gap-[18px] md:gap-[30px] items-center justify-start md:justify-center cursor-pointer"
                        onClick={() => {
                            router.push(
                                `/kelas/${course_slug}/belajar/video/${chapter_id}/${subchapter_id}`
                            );
                            tracker?.genericTrack(
                                'Click Latest Watch Progress Card',
                                {
                                    'Course Name': course_name,
                                    'Video Title': subchapter_name
                                }
                            );
                        }}
                        aria-hidden>
                        <div className="relative min-w-[120px] sm:min-w-[160px] lg:min-w-[220px] w-1/2 min-h-[83px] sm:h-[120px] lg:h-[150px] max-w-[260px]">
                            <Image
                                src={subchapter_thumbnail}
                                alt={subchapter_name}
                                layout="fill"
                                className="object-cover object-top rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col gap-[2px] w-full overflow-hidden">
                            <span className="inline-block overflow-hidden font-body whitespace-nowrap text-ellipsis">
                                {subchapter_name}
                            </span>
                            <span className="inline-block pb-3 overflow-hidden text-xs font-body text-neutral-200 whitespace-nowrap text-ellipsis">
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
                    className="font-sans text-xs font-bold text-black bg-white"
                    onClick={() =>
                        router.push(
                            `${is_subscribed ? '/kelas' : '/langganan'}`
                        )
                    }
                    eventName="Start Learning Button">
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
