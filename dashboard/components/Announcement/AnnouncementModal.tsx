import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import Coupon from 'commons/components/elements/Icons/Coupon';
import Horn from 'commons/components/elements/Icons/Horn';
import Modal from 'commons/components/modules/Modal';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import Sparkles from 'courses/assets/Sparkles';
import {
    useGetAnnouncementsQuery,
    useStoreUserAnnouncementMutation
} from 'dashboard/redux/api/dashboardApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { useSelector } from 'react-redux';
import { useTracker } from 'tracker/tracker';
import Spinner from 'commons/components/elements/Spinner';

const NewFeatureBadge = () => (
    <span
        className="flex items-center gap-2 py-1 px-3 rounded-md bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56] font-semibold text-xs text-white tooltip tooltip-left"
        data-tip="Copilot AI gratis selama versi Beta!">
        <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
        Baru
    </span>
);

const AnnouncementBadge = () => (
    <span
        className="flex items-center gap-2 py-1 px-3 rounded-md bg-gradient-to-r from-[#DC6D0D] to-[#C5550F] via-[#DC6D0D] font-semibold text-xs text-white tooltip tooltip-left"
        data-tip="Copilot AI gratis selama versi Beta!">
        <Horn />
        Pengumuman
    </span>
);

const PromoBadge = () => (
    <span
        className="flex items-center gap-2 py-1 px-3 rounded-md bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56] font-semibold text-xs text-white tooltip tooltip-left"
        data-tip="Copilot AI gratis selama versi Beta!">
        <Coupon />
        Promo
    </span>
);

const AnnouncementModal = ({
    isOpen,
    setOpen
}: ModalBaseProps): JSX.Element => {
    const tracker = useTracker();
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: announcements } = useGetAnnouncementsQuery(undefined, {
        skip: !isAuthenticated
    });
    const [storeUserAnnouncement, { isLoading }] =
        useStoreUserAnnouncementMutation();
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<number>(0);
    const [viewedAnnouncements, setViewedAnnouncements] = useState<string[]>(
        []
    );

    useEffect(() => {
        if (
            announcements &&
            announcements.data.length > 0 &&
            !viewedAnnouncements.includes(
                announcements.data[selectedAnnouncement].id
            )
        ) {
            setViewedAnnouncements((prev) => [
                ...prev,
                announcements.data[selectedAnnouncement].id
            ]);
        }
    }, [announcements, selectedAnnouncement, viewedAnnouncements]);

    useEffect(() => {
        if (isOpen) tracker?.genericTrack('View Announcement Modal');
    }, [isOpen]);

    const renderBadge = (
        type: 'GENERAL' | 'NEW_FEATURE' | 'PROMO',
        title?: string
    ) => {
        switch (type) {
            case 'NEW_FEATURE':
                return (
                    <div className="flex flex-row gap-2 items-center">
                        <span className="font-semibold text-xs">{title}</span>
                        <NewFeatureBadge />
                    </div>
                );
            case 'GENERAL':
                return <AnnouncementBadge />;
            case 'PROMO':
                return <PromoBadge />;
            default:
                return null;
        }
    };

    const onClose = async () => {
        if (announcements && viewedAnnouncements.length > 0 && !isLoading) {
            await storeUserAnnouncement({
                announcement_ids: viewedAnnouncements
            });
        }
        setOpen(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            setOpen={setOpen}
            permanent={true}
            variant="dark"
            className="text-center md:!max-w-xl flex flex-col gap-6">
            <div className="w-full flex justify-center items-center relative">
                {renderBadge(
                    announcements?.data[selectedAnnouncement]?.type ??
                        'GENERAL',
                    announcements?.data[selectedAnnouncement]?.feature_name
                )}
                <button
                    className="absolute top-0 right-0 cursor-pointer"
                    onClick={onClose}>
                    {isLoading ? (
                        <Spinner size="small" />
                    ) : (
                        <MdClose size={24} />
                    )}
                </button>
            </div>
            <div className="aspect-[16/9] overflow-hidden rounded-xl w-full">
                <Image
                    src={
                        announcements?.data[selectedAnnouncement]?.banners[0] ??
                        ''
                    }
                    width={160 * (isMobileBreakpoints ? 2 : 3)}
                    height={90 * (isMobileBreakpoints ? 2 : 3)}
                    layout="responsive"
                    className="w-full h-full object-contain"
                    alt={`Announcement ${selectedAnnouncement + 1} ${
                        announcements?.data[selectedAnnouncement]?.title
                    }`}
                />
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold">
                    {announcements?.data[selectedAnnouncement]?.title ?? ''}
                </h1>
                <div className="max-h-[30vh] overflow-auto">
                    <ReactMarkdown
                        className="markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height markdown-body math-display-overflow text-white text-center"
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}>
                        {announcements?.data[selectedAnnouncement]?.content ??
                            ''}
                    </ReactMarkdown>
                </div>
            </div>
            <div className="w-full items-center justify-center flex flex-row gap-3">
                <Button
                    eventName="Click Go To Referral Page"
                    onClick={() => setSelectedAnnouncement((prev) => prev - 1)}
                    disabled={selectedAnnouncement === 0}
                    variant="custom"
                    className="text-white bg-neutral-700 w-full flex flex-row items-center gap-2 justify-center disabled:bg-neutral-900 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                </Button>
                <Button
                    onClick={() => setSelectedAnnouncement((prev) => prev + 1)}
                    eventName="Click Ignore Referral Modal"
                    variant="custom"
                    disabled={
                        selectedAnnouncement ===
                        (announcements?.data.length ?? 1) - 1
                    }
                    className="text-white bg-neutral-700 w-full flex flex-row items-center gap-2 justify-center disabled:bg-neutral-900 disabled:cursor-not-allowed">
                    Next
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </Modal>
    );
};

export default AnnouncementModal;
