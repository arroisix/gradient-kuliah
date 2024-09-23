import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { MdInfoOutline } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { cn } from 'commons/utils';
import CourseCTA from './CourseCTA';
import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import FreeBadge from 'commons/components/elements/FreeBadge';

const CENTERED_HERO = [
    'kimdas1',
    'persamaan-diferensial',
    'kalkulus2',
    'probstat'
];

const LearningProgress = ({
    slug,
    course
}: Pick<GradientBaseComponentWithSlug, 'slug'> & {
    course: CourseLandingPageData;
}): JSX.Element => {
    const { is_subscribed, expiryDay, latest_watch_video } =
        useCourseSubscription(slug);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    return (
        <div
            className={cn(
                'flex flex-col gap-2 relative',
                isLandingPageRevampOn
                    ? 'justify-end sm:justify-center'
                    : 'justify-center',
                course?.is_coming_soon && !course.cover
                    ? 'mx-5 lg:w-10/12 lg:mx-auto bg-zinc-900 rounded-xl mt-20'
                    : 'h-[70vh]'
            )}>
            <Breadcrumb
                className="absolute top-[72px] lg:top-20 z-10 px-4 md:px-8 lg:px-24"
                nextItem={{ name: course?.course_name } as BreadcrumbItemProps}
            />
            <div
                className={cn(
                    'absolute bottom-0 flex w-screen h-full',
                    !course?.cover && 'hidden'
                )}>
                <img
                    src={course?.cover}
                    className={cn(
                        'object-cover w-screen',
                        CENTERED_HERO.includes(slug)
                            ? 'object-top'
                            : 'object-right md:object-top'
                    )}
                    alt="Cover"
                />
                <div className="absolute self-end w-screen h-40 outline-none border-hidden bg-gradient-to-b from-transparent to-[#101010] lg:h-32" />
            </div>
            {!course?.cover && (
                <div className="flex items-center justify-center mt-6 md:justify-end md:absolute md:w-full md:pr-5">
                    <Image
                        src={`${CDN_URL}/assets/dashboard-subscribe.png`}
                        alt="Kelas segera hadir"
                        width={198}
                        height={183}
                        className="object-contain saturate-0 opacity-20"
                    />
                </div>
            )}
            <div
                className={cn(
                    course?.is_coming_soon && !course.cover
                        ? 'md:px-5 md:max-w-[50vw]'
                        : 'md:px-[7.5rem] lg:max-w-[60vw]',
                    'px-4 py-4 z-10  flex flex-col gap-2'
                )}>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 mb-1">
                        <div
                            className={cn(
                                'badge w-max px-3 bg-gradient-to-r from-[#F2C04C] via-[#E48E0D] to-[#E4B50D] font-bold text-white border-none',
                                !course?.is_coming_soon && 'hidden'
                            )}>
                            Segera Hadir
                        </div>
                        {course.is_free && <FreeBadge />}
                    </div>
                    <h1
                        className={`font-bold text-balance ${
                            isAuthenticated
                                ? 'text-xl lg:text-base'
                                : 'text-4xl'
                        }`}>
                        Kelas {course?.course_name}
                    </h1>
                    <div className="w-full h-px bg-gray-500 lg:ml-3 lg:w-9/12" />
                    {isAuthenticated && !course?.is_coming_soon && (
                        <>
                            <div className="text-xs text-gray-500 lg:ml-3">
                                TERAKHIR DIPELAJARI
                            </div>
                            <p className="text-xl font-bold lg:ml-3 lg:text-2xl">
                                {latest_watch_video?.subchapter
                                    .subchapter_name ??
                                    'Belum ada progress belajar'}
                            </p>
                        </>
                    )}
                </div>
                <CourseCTA slug={slug} />
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
