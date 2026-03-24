import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import CopilotSidebarContainer from '../containers/CopilotSidebarContainer';
import CopilotAuthPrompt from '../components/AuthPrompt/AuthPrompt';
import ReferenceModal from '../components/Reference/ReferenceModal';
import ReferenceContentModal from '../components/Reference/ReferenceContentModal';
import { ReferenceContentType, SelectedReference } from '../types/copilot';
import { cn } from 'commons/utils';
import { useRouter } from 'next/router';

interface CopilotModalProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    sessionId?: string;
    xlWidth?: string;
    currentContext?: SelectedReference;
    bookSlug?: string;
    chapterId?: string;
}

const CopilotModal = ({
    isOpen,
    setOpen,
    sessionId,
    xlWidth,
    currentContext,
    bookSlug,
    chapterId
}: CopilotModalProps): JSX.Element => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
    const [isReferenceContentModalOpen, setIsReferenceContentModalOpen] =
        useState(false);
    const [isUsedReferencesModalOpen, setIsUsedReferencesModalOpen] =
        useState(false);
    const [selectedReferences, setSelectedReferences] = useState<
        SelectedReference[]
    >([]);
    const [viewingUsedReferences, setViewingUsedReferences] = useState<
        SelectedReference[]
    >([]);
    const [isMobile, setIsMobile] = useState(false);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const router = useRouter();
    const currentPath = (router.asPath || router.pathname || '').split('?')[0];
    const isKelasRoute = currentPath.startsWith('/kelas');

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setIsCollapsed(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (currentContext) {
            setSelectedReferences((prev) => {
                const exists = prev.find(
                    (ref) =>
                        ref.id === currentContext.id &&
                        ref.contentType === currentContext.contentType
                );

                if (!exists) {
                    return [currentContext];
                }

                return prev;
            });
        }
    }, [currentContext]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenReferenceModal = () => {
        setIsReferenceModalOpen(true);
    };

    const handleCloseReferenceModal = () => {
        setIsReferenceModalOpen(false);
    };

    const handleOpenReferenceContentModal = () => {
        setIsReferenceContentModalOpen(true);
    };

    const handleCloseReferenceContentModal = () => {
        setIsReferenceContentModalOpen(false);
    };

    const handleOpenUsedReferencesModal = (references: SelectedReference[]) => {
        setViewingUsedReferences(references);
        setIsUsedReferencesModalOpen(true);
    };

    const handleCloseUsedReferencesModal = () => {
        setIsUsedReferencesModalOpen(false);
        setViewingUsedReferences([]);
    };

    const getContextName = () => {
        if (!currentContext) return undefined;

        if (currentContext.contentType === 'course') {
            return { courseName: currentContext.title };
        } else {
            return { bookName: currentContext.title };
        }
    };

    const contextNames = getContextName();

    const handleReferenceSelect = (
        referenceId: string,
        referenceTitle: string,
        referenceSubtitle: string,
        referenceHeader: string,
        contentType: ReferenceContentType
    ) => {
        const newReference: SelectedReference = {
            id: referenceId,
            title: referenceTitle,
            subtitle: referenceSubtitle,
            header: referenceHeader,
            contentType
        };

        setSelectedReferences((prev) => {
            const exists = prev.find(
                (ref) =>
                    ref.id === referenceId && ref.contentType === contentType
            );
            return exists ? prev : [...prev, newReference];
        });
    };

    const handleRemoveReference = (
        referenceId: string,
        contentType: ReferenceContentType
    ) => {
        setSelectedReferences((prev) =>
            prev.filter(
                (ref) =>
                    !(ref.id === referenceId && ref.contentType === contentType)
            )
        );
    };

    const getCurrentContentType = () => {
        return currentContext?.contentType === 'course'
            ? 'course_video'
            : currentContext?.contentType;
    };

    const getModalHeight = () => {
        if (isMobile && isCollapsed) {
            return 'h-screen h-[100dvh]';
        } else if (isCollapsed) {
            return 'h-[68px]';
        } else {
            return 'h-[70vh] h-[70dvh] xl:h-[90vh] xl:h-[90dvh]';
        }
    };

    const getModalWidth = () => {
        if (isMobile && isCollapsed) {
            return 'w-screen';
        } else {
            return 'w-full sm:w-full md:w-full lg:w-full';
        }
    };

    return (
        <>
            {!isKelasRoute ||
                (isKelasRoute && isAuthenticated) ? (
                <div
                    className={cn(
                        'fixed bottom-0 right-0 z-50 shadow-lg font-inter',
                        getModalWidth(),
                        xlWidth,
                        !isMobile && 'xl:pr-4',
                        isMobile && isCollapsed ? '' : 'rounded-t-lg',
                        getModalHeight(),
                        'transition-all duration-300 ease-in-out',
                        isOpen ? 'translate-y-0' : 'translate-y-full',
                        !isOpen && 'pointer-events-none',
                        'flex flex-col overflow-hidden'
                    )}>
                    <CopilotSidebarContainer
                        currentContext={currentContext}
                        sessionId={sessionId}
                        isCollapsed={isCollapsed}
                        isMobile={isMobile}
                        selectedReferences={selectedReferences}
                        onCollapsedChange={setIsCollapsed}
                        onClose={handleClose}
                        onOpenReferenceModal={handleOpenReferenceModal}
                        onOpenReferenceContentModal={
                            handleOpenReferenceContentModal
                        }
                        onRemoveReference={handleRemoveReference}
                        onOpenUsedReferencesModal={
                            handleOpenUsedReferencesModal
                        }
                        contentType={getCurrentContentType()}
                        bookSlug={bookSlug}
                        chapterId={chapterId}
                    />
                </div>
            ) : null}

            <ReferenceModal
                isOpen={isReferenceModalOpen}
                onClose={handleCloseReferenceModal}
                onReferenceSelect={handleReferenceSelect}
                {...contextNames}
            />

            <ReferenceContentModal
                isOpen={isReferenceContentModalOpen}
                onClose={handleCloseReferenceContentModal}
                selectedReferences={selectedReferences}
                onRemoveReference={handleRemoveReference}
                onOpenReferenceModal={() => {
                    setIsReferenceContentModalOpen(false);
                    setIsReferenceModalOpen(true);
                }}
                isViewOnly={false}
            />

            <ReferenceContentModal
                isOpen={isUsedReferencesModalOpen}
                onClose={handleCloseUsedReferencesModal}
                selectedReferences={viewingUsedReferences}
                isViewOnly={true}
            />

            {isOpen && !isAuthenticated && <CopilotAuthPrompt />}
        </>
    );
};

export default CopilotModal;
