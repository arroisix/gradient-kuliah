import Button from 'commons/components/elements/Button';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import SubscribeButton from '../LandingPage/Common/SubscribeButton';
import { MdInfoOutline } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

export const PercentageProgess = ({
    slug
}: GradientBaseComponentWithSlug): JSX.Element => {
    const { completion_percentage } = useCourseSubscription(slug);
    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="h-2 bg-gray-500 rounded-full w-full relative overflow-hidden">
                <div
                    style={{
                        width: `${
                            (completion_percentage?.total_finished_video /
                                completion_percentage?.total_video_count) *
                            100
                        }%`
                    }}
                    className={`h-2 absolute rounded-full left-0 z-10 bg-[#D9B8FF]`}
                />
            </div>
            <div>
                Progress Belajar:
                <span className="font-semibold text-green-500 ml-2">
                    {Math.round(
                        (completion_percentage?.total_finished_video /
                            completion_percentage?.total_video_count) *
                            100
                    )}
                    %
                </span>
            </div>
        </div>
    );
};

const LearningProgress = ({
    slug
}: GradientBaseComponentWithSlug): JSX.Element => {
    const { data } = useGetLandingCourseDataQuery(slug);
    const {
        is_subscribed,
        expiryDay,
        latest_watch_video,
        isLoading,
        first_video_in_course
    } = useCourseSubscription(slug);
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <div className="flex flex-col gap-2 h-[70vh] justify-center relative">
            <div className="flex absolute bottom-0 h-full w-screen">
                <img
                    src={data?.cover}
                    className="object-cover object-top w-screen"
                    alt="Cover"
                />
                <div className="absolute h-20 w-screen self-end border-hidden outline-none mix-blend-multiply bg-gradient-to-b from-transparent to-black lg:h-40" />
            </div>
            <div className="px-4 md:px-[7.5rem] py-4 z-10 lg:max-w-[60vw] flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <h1
                        className={`font-bold ${
                            isAuthenticated
                                ? 'text-sm lg:text-base'
                                : 'text-4xl'
                        }`}>
                        {data?.course_name}
                    </h1>
                    <div className="h-px bg-gray-500 w-full lg:ml-3 lg:w-9/12" />
                    {isAuthenticated && (
                        <>
                            <div className="text-xs text-gray-500 lg:ml-3">
                                TERAKHIR DIPELAJARI
                            </div>
                            <h1 className="text-xl font-bold lg:ml-3 lg:text-2xl">
                                {latest_watch_video?.subchapter
                                    .subchapter_name ??
                                    'Belum ada progress belajar'}
                            </h1>
                        </>
                    )}
                </div>
                <div className="flex flex-col gap-3 lg:flex-row-reverse lg:justify-end lg:items-center lg:ml-3">
                    {isAuthenticated &&
                        latest_watch_video?.subchapter.subchapter_name && (
                            <PercentageProgess slug={slug} />
                        )}
                    {is_subscribed && !isLoading ? (
                        latest_watch_video?.subchapter.subchapter_name ? (
                            <Button
                                className="md:w-fit text-center mt-4 min-w-[200px]"
                                variant="primary"
                                href={`/kelas/${slug}/belajar/video/${latest_watch_video?.chapter_id}/${latest_watch_video?.subchapter.id}`}>
                                Lanjut Belajar
                            </Button>
                        ) : (
                            <Button
                                className="md:w-fit text-center mt-4 min-w-[200px]"
                                variant="primary"
                                href={`/kelas/${slug}/belajar/video/${first_video_in_course?.chapter_id}/${first_video_in_course?.subchapter_id}`}>
                                Mulai Belajar
                            </Button>
                        )
                    ) : (
                        <SubscribeButton slug={slug} />
                    )}
                </div>
                {is_subscribed &&
                    (expiryDay <= 7 || new Date() <= new Date('2022-10-14')) &&
                    expiryDay < 30 && (
                        <div className="flex mt-2 items-center gap-2">
                            <MdInfoOutline className="text-xl" />
                            <h4 className="font-body">
                                Waktu berlanggangan kamu akan segera habis dalam{' '}
                                {expiryDay} hari
                            </h4>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default LearningProgress;
