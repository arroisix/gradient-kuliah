import Button from 'commons/components/elements/Button';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaRegCalendar, FaRegClock } from 'react-icons/fa6';
import Modal from 'commons/components/modules/Modal';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { BiSolidStar } from 'react-icons/bi';
import {
    useRegisterLiveClassMutation,
    useUnregisterLiveClassMutation
} from 'liveClasses/redux/liveClassApi';
import Spinner from 'commons/components/elements/Spinner';
import { toast } from 'react-toastify';
import { cn } from 'commons/utils';
import AddToCalendarModal from './AddToCalendarModal';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const formatLiveClassDate = (dateString: string): string => {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date);
};

function LiveClassCard(
    liveClass: LiveClass | LiveClassAuthenticated
): JSX.Element {
    const lecture = liveClass.lecturers[0];
    const [showLiveClassDetailModal, setShowLiveClassDetailModal] =
        useState<boolean>(false);
    const [showAddToCalendarModal, setShowAddToCalendarModal] =
        useState<boolean>(false);
    const { is_subscribed, subscribedFeatures } = useCourseSubscription();
    const [register, { isLoading, isSuccess }] = useRegisterLiveClassMutation();
    const [isRegistered, setIsRegistered] = useState<boolean>(
        'is_registered' in liveClass ? liveClass.is_registered : false
    );

    const handleRegister = async () => {
        if (!isRegistered) {
            register({ slug: liveClass.slug });
        } else {
            setShowAddToCalendarModal(true);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setIsRegistered(true);
            toast.success('Daftar Live Class berhasil.', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true
            });
        }
    }, [isSuccess]);

    return (
        <>
            <div className="p-4 rounded-2xl bg-violet-2 flex flex-col gap-6 h-full relative">
                {/* Lecture */}
                <div className="flex flex-row gap-3 items-center">
                    <div className="rounded-full w-16 h-16 overflow-hidden relative">
                        <Image
                            src={lecture.photo}
                            alt={lecture.name}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-white font-semibold text-sm">
                            {lecture.name}
                        </span>
                        <span className="text-neutral-400 text-xs">
                            {lecture.role}
                        </span>
                    </div>
                </div>

                {/* Live Class Detail */}
                <div className="flex flex-col gap-1">
                    <h2 className="text-white font-semibold">
                        {liveClass.name}
                    </h2>

                    <span className="text-neutral-400 text-sm font-semibold">
                        {liveClass.related_courses}
                    </span>

                    <div className="flex flex-row gap-1 items-center">
                        <FaRegCalendar className="text-neutral-400" />
                        <span className="text-neutral-400 text-xs">
                            {formatLiveClassDate(liveClass.starts_at)} •{' '}
                            {liveClass.duration} menit
                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-row gap-2 mt-auto">
                    <Button
                        variant="custom"
                        className="font-semibold border-[2px] border-[#333333] text-sm text-white"
                        onClick={() => setShowLiveClassDetailModal(true)}>
                        Detail
                    </Button>

                    <Button
                        variant="primary"
                        className="w-full flex flex-row items-center gap-2 justify-center"
                        disabled={
                            !is_subscribed ||
                            !subscribedFeatures?.includes('live_class') ||
                            isLoading
                        }
                        onClick={handleRegister}>
                        {isLoading ? (
                            <Spinner size="small" />
                        ) : isRegistered ? (
                            <FaRegCalendar className="text-white" />
                        ) : (
                            <></>
                        )}
                        {isLoading
                            ? 'Mendaftar...'
                            : isRegistered
                            ? 'Reminder'
                            : 'Daftar Live Class'}
                    </Button>
                </div>
            </div>

            <Modal
                isOpen={showLiveClassDetailModal}
                setOpen={setShowLiveClassDetailModal}
                variant="dark"
                containerClassName="modal modal-open modal-bottom md:modal-middle min-h-[100px] z-[9999]">
                <LiveClassDetailModal
                    liveClass={liveClass}
                    isRegistered={isRegistered}
                    setIsRegistered={setIsRegistered}
                />
            </Modal>

            <Modal
                isOpen={showAddToCalendarModal}
                setOpen={setShowAddToCalendarModal}
                variant="dark"
                containerClassName="modal modal-open modal-bottom md:modal-middle min-h-[100px] z-[9999]">
                <AddToCalendarModal
                    liveClassName={liveClass.name}
                    liveClassDescription={liveClass.description}
                    startTime={new Date(liveClass.starts_at)}
                    duration={liveClass.duration}
                    meetLink={
                        'meet_link' in liveClass ? liveClass.meet_link : ''
                    }
                />
            </Modal>
        </>
    );
}

type LiveClassDetailModalProps = {
    liveClass: LiveClass | LiveClassAuthenticated;
    isRegistered: boolean;
    setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>;
};

function LiveClassDetailModal({
    liveClass,
    isRegistered,
    setIsRegistered
}: LiveClassDetailModalProps): JSX.Element {
    const router = useRouter();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed, subscribedFeatures } = useCourseSubscription();
    const lecture = liveClass.lecturers[0];
    const formattedStartDate = formatLiveClassDate(liveClass.starts_at);
    const [datePart, timePart] = formattedStartDate.split(', ');
    const [
        showUnregisterConfirmationModal,
        setShowUnregisterConfirmationModal
    ] = useState<boolean>(false);
    const [showAddToCalendarModal, setShowAddToCalendarModal] =
        useState<boolean>(false);
    const [
        register,
        { isLoading: isRegistering, isSuccess: isRegisterSuccess }
    ] = useRegisterLiveClassMutation();
    const [
        unregister,
        { isLoading: isUnregistering, isSuccess: isUnregisterSuccess }
    ] = useUnregisterLiveClassMutation();

    const handleRegister = async () => {
        if (!isAuthenticated) {
            router.push('/langganan');
        } else if (!isRegistered) {
            register({ slug: liveClass.slug });
        } else {
            setShowAddToCalendarModal(true);
        }
    };

    const handlerUnregister = async () => {
        unregister({ slug: liveClass.slug });
    };

    useEffect(() => {
        if (isRegisterSuccess) {
            setIsRegistered(true);
            toast.success('Daftar Live Class berhasil.', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true
            });
        }
    }, [isRegisterSuccess]);

    useEffect(() => {
        if (isUnregisterSuccess) {
            setShowUnregisterConfirmationModal(false);
            setIsRegistered(false);
            toast.success('Pembatalan daftar Live Class berhasil.', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true
            });
        }
    }, [isUnregisterSuccess]);

    return (
        <>
            <div className="w-full flex flex-col gap-6">
                <span className="text-neutral-400 text-sm font-semibold">
                    {liveClass.related_courses}
                </span>

                <div className="flex flex-col gap-3">
                    <h2 className="text-white font-semibold text-xl">
                        {liveClass.name}
                    </h2>
                    <span className="text-white text-sm">
                        {liveClass.description}
                    </span>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="p-4 rounded-2xl bg-[#282B3C] flex flex-col gap-4">
                        <h3 className="text-white font-semibold text-sm">
                            Pengajar
                        </h3>

                        <div className="flex flex-row gap-3 items-center">
                            <div className="rounded-full w-16 h-16 overflow-hidden relative">
                                <Image
                                    src={lecture.photo}
                                    alt={lecture.name}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-white font-semibold text-sm">
                                    {lecture.name}
                                </span>
                                <span className="text-neutral-400 text-xs">
                                    {lecture.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row gap-4">
                        <div className="w-1/2 p-3 rounded-xl bg-[#282B3C] flex flex-col gap-1 items-center">
                            <FaRegCalendar className="text-purple-7 text-sm" />
                            <span className="text-neutral-400 text-xs">
                                {datePart} • {timePart}
                            </span>
                        </div>

                        <div className="w-1/2 p-3 rounded-xl bg-[#282B3C] flex flex-col gap-1 items-center">
                            <FaRegClock className="text-purple-7 text-sm" />
                            <span className="text-neutral-400 text-xs">
                                {liveClass.duration} Menit
                            </span>
                        </div>
                    </div>

                    <div
                        className={cn(
                            'w-full',
                            isRegistered ? 'flex flex-row gap-2' : ''
                        )}>
                        {isRegistered && (
                            <Button
                                variant="custom"
                                size="large"
                                disabled={isUnregistering}
                                className="font-semibold border-[2px] border-[#333333] w-[240px] flex flex-row gap-2 items-center justify-center"
                                onClick={() =>
                                    setShowUnregisterConfirmationModal(true)
                                }>
                                Batal Daftar
                            </Button>
                        )}

                        <Button
                            variant="primary"
                            size="large"
                            className="flex flex-row gap-3 items-center justify-center w-full"
                            disabled={isRegistering}
                            onClick={handleRegister}>
                            {isRegistering ? (
                                <Spinner size="small" />
                            ) : isRegistered ? (
                                <FaRegCalendar className="text-white" />
                            ) : (
                                <></>
                            )}
                            {isRegistering ? (
                                'Mendaftar...'
                            ) : is_subscribed &&
                              subscribedFeatures?.includes('live_class') ? (
                                isRegistered ? (
                                    'Tambah ke Kalendar'
                                ) : (
                                    'Daftar Live Class'
                                )
                            ) : (
                                <>
                                    <BiSolidStar size={20} />
                                    <span>Langganan Premium</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showUnregisterConfirmationModal}
                setOpen={setShowUnregisterConfirmationModal}
                variant="dark"
                dialog
                className="bg-[#1D1D1D]"
                containerClassName="modal modal-open modal-bottom md:modal-middle min-h-[100px] z-[9999]">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3 items-center">
                        <h2 className="text-white text-xl font-bold">
                            Batalkan pendaftaran Live Class?
                        </h2>

                        <span className="text-center text-[#999999]">
                            Kamu tidak akan lagi terdaftar di Live Class ini.
                            Yakin ingin melanjutkan?
                        </span>
                    </div>

                    <div className="flex flex-row gap-4">
                        <Button
                            variant="custom"
                            size="large"
                            onClick={() =>
                                setShowUnregisterConfirmationModal(false)
                            }
                            className="w-full bg-[#333540]"
                            disabled={isUnregistering}>
                            Kembali
                        </Button>
                        <Button
                            variant="custom"
                            size="large"
                            className="bg-[#EA5C49] w-full flex flex-row gap-2 items-center justify-center"
                            disabled={isUnregistering}
                            onClick={handlerUnregister}>
                            {isUnregistering && <Spinner size="small" />}
                            {isUnregistering
                                ? 'Membatalkan...'
                                : 'Ya, batalkan'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showAddToCalendarModal}
                setOpen={setShowAddToCalendarModal}
                variant="dark"
                containerClassName="modal modal-open modal-bottom md:modal-middle min-h-[100px] z-[9999]">
                <div className="flex flex-col gap-4">
                    <AddToCalendarModal
                        liveClassName={liveClass.name}
                        liveClassDescription={liveClass.description}
                        startTime={new Date(liveClass.starts_at)}
                        duration={liveClass.duration}
                        meetLink={
                            'meet_link' in liveClass ? liveClass.meet_link : ''
                        }
                    />
                </div>
            </Modal>
        </>
    );
}

export { LiveClassCard };