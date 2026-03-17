import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import {
    useGetListLiveClassPrivateQuery,
    useGetListLiveClassPublicQuery,
    useRegisterLiveClassMutation
} from 'liveClasses/redux/liveClassApi';
import Image from 'next/image';
import Button from 'commons/components/elements/Button';
import { LuArrowUpRight } from 'react-icons/lu';
import Live from 'commons/components/elements/Icons/Live';
import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from 'commons/components/elements/Spinner';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

function OngoingLiveClass(): JSX.Element {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const router = useRouter();
    const [register, { isLoading: isRegistering }] =
        useRegisterLiveClassMutation();
    const { is_subscribed, subscribedFeatures } = useCourseSubscription();
    const { data: liveClassPublicData, isLoading: isLoadingLiveClassPublic } =
        useGetListLiveClassPublicQuery(
            {
                limit: 1,
                page: 1,
                type: 'ongoing'
            },
            {
                skip: isAuthenticated
            }
        );
    const {
        data: liveClassPrivateData,
        isLoading: isLoadingLiveClassPrivate,
        refetch: refetchLiveClassPrivate
    } = useGetListLiveClassPrivateQuery(
        {
            limit: 1,
            page: 1,
            type: 'ongoing'
        },
        {
            skip: !isAuthenticated
        }
    );
    const liveClass = isAuthenticated
        ? liveClassPrivateData
        : liveClassPublicData;
    const isLoadingLiveClass = isAuthenticated
        ? isLoadingLiveClassPrivate
        : isLoadingLiveClassPublic;
    const initialIsRegistered: boolean =
        Array.isArray(liveClass?.data) &&
        liveClass.data.length > 0 &&
        'is_registered' in liveClass.data[0] &&
        typeof liveClass.data[0].is_registered === 'boolean'
            ? liveClass.data[0].is_registered
            : false;

    const [isRegistered, setIsRegistered] =
        useState<boolean>(initialIsRegistered);

    useEffect(() => {
        if (
            Array.isArray(liveClass?.data) &&
            liveClass.data.length > 0 &&
            'is_registered' in liveClass.data[0] &&
            typeof liveClass.data[0].is_registered === 'boolean'
        ) {
            setIsRegistered(liveClass.data[0].is_registered);
        }
    }, [liveClass]);

    const hasLiveClassAccess =
        isAuthenticated &&
        is_subscribed &&
        !!subscribedFeatures?.includes('live_class');

    const extractMeetLink = (payload?: {
        data?: Array<Record<string, unknown>>;
    }): string => {
        const firstItem = payload?.data?.[0];

        if (!firstItem || !('meet_link' in firstItem)) {
            return '';
        }

        const meetLink = firstItem.meet_link;

        return typeof meetLink === 'string' && meetLink ? meetLink : '';
    };

    const resolveMeetLink = async (): Promise<string> => {
        const currentMeetLink = extractMeetLink(liveClass);

        if (currentMeetLink || !isAuthenticated) {
            return currentMeetLink;
        }

        try {
            const refreshedLiveClass = await refetchLiveClassPrivate().unwrap();
            return extractMeetLink(refreshedLiveClass);
        } catch {
            return currentMeetLink;
        }
    };

    const redirectToMeetLink = async (): Promise<void> => {
        const meetLink = await resolveMeetLink();

        if (!meetLink) {
            toast.error('Link meeting belum tersedia.', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true
            });
            return;
        }

        window.open(meetLink, '_blank');
    };

    const handleRegister = async () => {
        if (!liveClass || liveClass.data.length === 0) {
            return;
        }

        if (isRegistered) {
            await redirectToMeetLink();
            return;
        }

        if (!hasLiveClassAccess) {
            router.push('/langganan');
            return;
        }

        try {
            await register({ slug: liveClass.data[0].slug }).unwrap();
            setIsRegistered(true);
            toast.success('Daftar Live Class berhasil.', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true
            });
            await redirectToMeetLink();
        } catch {
            toast.error('Daftar Live Class gagal.', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true
            });
        }
    };

    if (isLoadingLiveClass || !liveClass || liveClass.count_items === 0)
        return <></>;

    return (
        <>
            <div
                className={cn(
                    'my-6 w-full rounded-2xl bg-[linear-gradient(163.05deg,_#000000_44.47%,_#19015B_83.5%)] border-[1px] border-[#B6A6F3] p-6 flex items-center relative overflow-hidden',
                    isAuthenticated
                        ? 'flex-col lg:flex-row gap-6 lg:gap-0'
                        : 'flex-col md:flex-row gap-6 md:gap-0'
                )}>
                <div className="absolute aspect-[458/156] h-[140px] right-[-136px] top-0 z-0 opacity-[20%] rotate-[60deg]">
                    <Image
                        src={`${CDN_URL}/assets/ongoing-live-class-background-icon.png`}
                        alt={'Ongoing Live Class Background'}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <Live />

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-white text-2xl font-bold">
                                {liveClass.data[0].name}
                            </h2>
                            <h3 className="text-sm text-[#999999]">
                                {liveClass.data[0].related_courses}
                            </h3>
                        </div>

                        <div className="flex flex-row gap-3 items-center">
                            <div className="rounded-full w-16 h-16 overflow-hidden relative">
                                <Image
                                    src={liveClass.data[0].lecturers[0].photo}
                                    alt={liveClass.data[0].lecturers[0].name}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-white font-semibold text-sm">
                                    {liveClass.data[0].lecturers[0].name}
                                </span>
                                <span className="text-neutral-400 text-xs">
                                    {liveClass.data[0].lecturers[0].role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="large"
                    className={cn(
                        'flex flex-row gap-3 w-full lg:w-[324px] xl:w-[280px] items-center justify-center z-10',
                        !isAuthenticated && 'w-full md:w-[320px] lg:w-[288px]',
                        isRegistered && 'lg:w-[436px] xl:w-[354px]'
                    )}
                    onClick={handleRegister}>
                    {isRegistering ? <Spinner size="small" /> : <></>}
                    {isRegistering
                        ? 'Mendaftar...'
                        : isRegistered
                        ? 'Gabung Sekarang'
                        : 'Daftar Sekarang'}
                    {!isRegistering && <LuArrowUpRight className="w-5 h-5" />}
                </Button>
            </div>
        </>
    );
}

export { OngoingLiveClass };
