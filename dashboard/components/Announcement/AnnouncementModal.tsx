import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import Coupon from 'commons/components/elements/Icons/Coupon';
import Horn from 'commons/components/elements/Icons/Horn';
import Modal from 'commons/components/modules/Modal';
import Sparkles from 'courses/assets/Sparkles';
import {
    useGetAnnouncementsQuery,
    useStoreUserAnnouncementMutation
} from 'dashboard/redux/api/dashboardApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { useSelector } from 'react-redux';
import { useTracker } from 'tracker/tracker';
import Spinner from 'commons/components/elements/Spinner';
import { cn } from 'commons/utils';
import Carousel from 'commons/components/elements/Carousel';

const NewFeatureBadge = () => (
    <span className="flex items-center gap-2 py-1 px-3 rounded-md bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56] font-semibold text-xs text-white">
        <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
        Baru
    </span>
);

const AnnouncementBadge = () => (
    <span className="flex items-center gap-2 py-1 px-3 rounded-md bg-gradient-to-r from-[#DC6D0D] to-[#C5550F] via-[#DC6D0D] font-semibold text-xs text-white">
        <Horn />
        Pengumuman
    </span>
);

const PromoBadge = () => (
    <span className="flex items-center gap-2 py-1 px-3 rounded-md bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56] font-semibold text-xs text-white">
        <Coupon />
        Promo
    </span>
);

const AnnouncementModal = ({
    isOpen,
    setOpen
}: ModalBaseProps): JSX.Element => {
    const tracker = useTracker();
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
            className="text-center md:!max-w-[800px] md:w-[800px] md:h-[400px] max-h-[70vh] flex flex-col md:flex-row p-4 md:p-0 gap-6 md:gap-0 relative overflow-hidden">
            <div className="w-full flex justify-start relative md:hidden">
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
            <div className="flex flex-col md:flex-row overflow-auto gap-6 md:gap-0 w-full h-full pb-20 md:pb-0">
                <Carousel
                    key={`carousel-${selectedAnnouncement}`}
                    className="aspect-square overflow-hidden rounded-xl md:rounded-r-none md:rounded-l-xl flex items-center justify-center relative min-h-[300px] w-full md:w-[400px] md:h-[400px] md:min-w-[400px]"
                    imageLayout={'fixed'}
                    images={
                        announcements?.data[selectedAnnouncement]?.banners.map(
                            (banner) => ({
                                src: banner,
                                alt: `Announcement ${
                                    selectedAnnouncement + 1
                                } ${
                                    announcements?.data[selectedAnnouncement]
                                        ?.title
                                }`,
                                width: 400,
                                height: 400
                            })
                        ) ?? []
                    }
                />
                <div className="flex flex-col gap-2 p-0 md:p-4 text-left h-full">
                    <div className="w-full justify-start relative hidden md:flex">
                        {renderBadge(
                            announcements?.data[selectedAnnouncement]?.type ??
                                'GENERAL',
                            announcements?.data[selectedAnnouncement]
                                ?.feature_name
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
                    <div
                        className="flex flex-col gap-2 text-left h-full overflow-auto"
                        key={`content-${selectedAnnouncement}`}>
                        <h1 className="text-base font-semibold">
                            {announcements?.data[selectedAnnouncement]?.title ??
                                ''}
                        </h1>
                        <ReactMarkdown
                            className="markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height markdown-body math-display-overflow text-white text-sm"
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}>
                            {announcements?.data[selectedAnnouncement]
                                ?.content ?? ''}
                        </ReactMarkdown>
                    </div>
                    <div className="hidden md:flex w-full justify-between items-center">
                        <div
                            className={cn(
                                announcements?.data?.length === 1 && 'w-full'
                            )}>
                            {announcements?.data[selectedAnnouncement]
                                ?.cta_label && (
                                <Button
                                    variant="primary"
                                    className={cn(
                                        'my-0 text-center',
                                        announcements?.data?.length === 1 &&
                                            'w-full'
                                    )}
                                    href={
                                        announcements?.data[
                                            selectedAnnouncement
                                        ]?.href_web
                                    }
                                    target="_blank">
                                    {
                                        announcements?.data[
                                            selectedAnnouncement
                                        ]?.cta_label
                                    }
                                </Button>
                            )}
                        </div>
                        {announcements?.data &&
                            announcements?.data?.length > 1 && (
                                <div className="items-center justify-end flex flex-row gap-3">
                                    <button
                                        onClick={() =>
                                            setSelectedAnnouncement(
                                                (prev) => prev - 1
                                            )
                                        }
                                        disabled={selectedAnnouncement === 0}
                                        className="text-white bg-neutral-700 disabled:bg-neutral-700/50 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center rounded-full">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setSelectedAnnouncement(
                                                (prev) => prev + 1
                                            )
                                        }
                                        disabled={
                                            selectedAnnouncement ===
                                            (announcements?.data.length ?? 1) -
                                                1
                                        }
                                        className="text-white bg-neutral-700 disabled:bg-neutral-700/50 disabled:cursor-not-allowed h-8 w-8 text-center flex items-center justify-center rounded-full">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                    </div>
                </div>
            </div>
            <div className="md:hidden absolute bottom-0 left-0 flex w-full justify-between items-center p-4 bg-neutral-800">
                <div
                    className={cn(
                        announcements?.data?.length === 1 && 'w-full'
                    )}>
                    {announcements?.data[selectedAnnouncement]?.cta_label && (
                        <Button
                            variant="primary"
                            className={cn(
                                'my-0 text-center',
                                announcements?.data?.length === 1 && 'w-full'
                            )}
                            href={
                                announcements?.data[selectedAnnouncement]
                                    ?.href_web
                            }
                            target="_blank">
                            {
                                announcements?.data[selectedAnnouncement]
                                    ?.cta_label
                            }
                        </Button>
                    )}
                </div>
                {announcements?.data && announcements?.data?.length > 1 && (
                    <div className="items-center justify-end flex flex-row gap-3">
                        <button
                            onClick={() =>
                                setSelectedAnnouncement((prev) => prev - 1)
                            }
                            disabled={selectedAnnouncement === 0}
                            className="text-white bg-neutral-700 disabled:bg-neutral-900 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center rounded-full">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() =>
                                setSelectedAnnouncement((prev) => prev + 1)
                            }
                            disabled={
                                selectedAnnouncement ===
                                (announcements?.data.length ?? 1) - 1
                            }
                            className="text-white bg-neutral-700 disabled:bg-neutral-900 disabled:cursor-not-allowed h-8 w-8 text-center flex items-center justify-center rounded-full">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AnnouncementModal;
