import Button from 'commons/components/elements/Button';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import SubscribeButton from '../LandingPage/Common/SubscribeButton';
import { MdInfoOutline } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { cn } from 'commons/utils';

export const PercentageProgess = ({
    slug
}: GradientBaseComponentWithSlug): JSX.Element => {
    const { completion_percentage } = useCourseSubscription(slug);
    return (
        <div className="flex flex-col w-full gap-2">
            <div className="relative w-full h-2 overflow-hidden bg-gray-500 rounded-full">
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
                <span className="ml-2 font-semibold text-green-500">
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
        first_video_in_course,
        coursePreview
    } = useCourseSubscription(slug);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    return (
        <div
            className={cn(
                'flex flex-col gap-2 h-[70vh] relative',
                isLandingPageRevampOn
                    ? 'justify-end sm:justify-center'
                    : 'justify-center'
            )}>
            <div className="absolute bottom-0 flex w-screen h-full">
                <img
                    src={data?.cover}
                    className="object-cover object-top w-screen"
                    alt="Cover"
                />
                <div className="absolute self-end w-screen h-20 outline-none border-hidden bg-gradient-to-b from-transparent to-[#101010] lg:h-32" />
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
                    <div className="w-full h-px bg-gray-500 lg:ml-3 lg:w-9/12" />
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
                        is_subscribed &&
                        latest_watch_video?.subchapter.subchapter_name && (
                            <PercentageProgess slug={slug} />
                        )}
                    {is_subscribed && !isLoading ? (
                        latest_watch_video?.subchapter.subchapter_name ? (
                            <Button
                                className="md:w-fit text-center mt-4 min-w-[200px]"
                                variant="primary"
                                href={`/kelas/${slug}/belajar/video/${latest_watch_video?.chapter_id}/${latest_watch_video?.subchapter.id}`}
                                eventName="Continue Learning Button on Course Landing Page"
                                eventPayload={{
                                    Position: 'HERO',
                                    'Course Slug': slug
                                }}>
                                Lanjut Belajar
                            </Button>
                        ) : (
                            <Button
                                className="md:w-fit text-center mt-4 min-w-[200px]"
                                variant="primary"
                                href={`/kelas/${slug}/belajar/video/${first_video_in_course?.chapter_id}/${first_video_in_course?.subchapter_id}`}
                                eventName="Start Learning Button on Course Landing Page"
                                eventPayload={{
                                    Position: 'HERO',
                                    'Course Slug': slug
                                }}>
                                Mulai Belajar
                            </Button>
                        )
                    ) : (
                        <div className="flex flex-col gap-2 sm:items-center sm:gap-4 sm:flex-row">
                            <SubscribeButton
                                slug={slug}
                                className={cn('whitespace-nowrap',
                                    isLandingPageRevampOn && '!my-0 w-auto'
                                )}
                                label={`${isLandingPageRevampOn ? 'Akses' : 'Gabung'} Sekarang`}
                            />
                            {isLandingPageRevampOn && (
                                <Button
                                    href={`/kelas/${slug}/belajar/video/${coursePreview?.chapter_id}/${coursePreview?.subchapter_id}`}
                                    variant="custom"
                                    className="text-center bg-neutral-800 whitespace-nowrap">
                                    Tonton Preview
                                </Button>
                            )}
                        </div>
                    )}
                </div>
                {is_subscribed &&
                    (expiryDay <= 7 || new Date() <= new Date('2022-10-14')) &&
                    expiryDay < 30 && (
                        <div className="flex items-center gap-2 mt-2">
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
