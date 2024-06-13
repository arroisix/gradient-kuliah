import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PercentageProgess } from './PercentageProgress';
import SubscribeButton from 'courses/components/LandingPage/Common/SubscribeButton';
import { cn } from 'commons/utils';
import { BsFillBellFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { BaseButtonProps } from 'commons/components/elements/Button/button';
import { useAddToWaitingListMutation } from 'courses/redux/api/courseApi';

const CourseCTA = ({ slug }: GradientBaseComponentWithSlug): JSX.Element => {
    const { data } = useGetLandingCourseDataQuery(slug);
    const {
        is_subscribed,
        latest_watch_video,
        isLoading,
        first_video_in_course,
        coursePreview
    } = useCourseSubscription(slug);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    const [waitList] = useAddToWaitingListMutation();
    const [isWaitingList, setIsWaitingList] = useState<boolean>(
        data?.is_waiting_list ?? false
    );

    useEffect(() => {
        if (data) setIsWaitingList(data.is_waiting_list);
    }, [data]);

    const addToWaitingList: BaseButtonProps['onClick'] = (e): void => {
        e.preventDefault();
        if (isAuthenticated) {
            waitList({ slug }).then(() => {
                setIsWaitingList(true);
                toast.success('Berhasil masuk waiting list kelas');
            });
        }
    };

    return data?.is_coming_soon ? (
        <div className="flex p-3 gap-4 bg-[#F3C531]/25 rounded-lg items-center mt-8">
            <p className="text-sm grow">
                {isWaitingList
                    ? 'Kamu akan menerima notifikasi saat kelas tersedia'
                    : 'Dapatkan notifikasi saat kelas tersedia!'}
            </p>
            <Button
                variant="custom"
                href={isAuthenticated ? '/login' : '?'}
                onClick={addToWaitingList}
                className={cn(
                    isWaitingList
                        ? 'hidden'
                        : 'bg-[#EA9A2C] flex items-center gap-2 hover:brightness-90 transition'
                )}>
                <BsFillBellFill size={16} /> Ingatkan{' '}
                <span className="hidden lg:inline">Saya</span>
            </Button>
        </div>
    ) : (
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
                        href={`/kelas/${slug}/${latest_watch_video?.subchapter.subchapter_slug}`}
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
                        href={`/kelas/${slug}/${first_video_in_course?.subchapter_slug}`}
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
                        className={cn(
                            'whitespace-nowrap',
                            isLandingPageRevampOn && '!my-0 w-auto'
                        )}
                        eventName={
                            isLandingPageRevampOn
                                ? 'Click "Akses Sekarang" Button'
                                : undefined
                        }
                        label={`${
                            isLandingPageRevampOn ? 'Akses' : 'Gabung'
                        } Sekarang`}
                    />
                    {isLandingPageRevampOn && (
                        <Button
                            href={`/kelas/${slug}/${coursePreview?.subchapter_slug}`}
                            variant="custom"
                            eventName='Click "Tonton Preview" Button'
                            className="text-center bg-neutral-800 whitespace-nowrap">
                            Tonton Preview
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseCTA;
