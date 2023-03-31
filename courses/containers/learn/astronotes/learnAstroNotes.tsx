import { NotionRenderer } from 'react-notion-x';
import dynamic from 'next/dynamic';
import { ExtendedRecordMap } from 'notion-types';
import ListOfAstroNotes from 'courses/components/LearningExperience/AstroNotes/ListOfAstroNotes';
import { useEffect, useMemo, useState } from 'react';
import { FaChevronRight, FaList } from 'react-icons/fa';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import usePublicCourseNotebook from 'courses/hooks/usePublicCourseNotebook';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useAuth } from 'authentication/contexts/AuthProvider';
import NeedSubscribe from 'courses/components/NeedSubscribe';

const Code = dynamic(() =>
    import('react-notion-x/build/third-party/code').then((m) => m.Code)
);
const Collection = dynamic(() =>
    import('react-notion-x/build/third-party/collection').then(
        (m) => m.Collection
    )
);
const Equation = dynamic(() =>
    import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
);
const Pdf = dynamic(
    () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
    {
        ssr: false
    }
);
const Modal = dynamic(
    () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
    {
        ssr: false
    }
);

export const customMapPageUrl =
    (rootPageId: string, notionId: string) => () => {
        return `/kelas/${rootPageId}/astronotes/${notionId}`;
    };

const LearnAstroNotes = ({
    notes,
    id,
    notionId
}: {
    notes: ExtendedRecordMap;
    notionId: string;
    id: string;
}): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const { isAuthenticated, setModalAuthOpen } = useAuth();
    const { data, loading, getNotebook } = usePublicCourseNotebook(
        id as string
    );
    const [showMaterial, setShowMaterial] = useState(false);
    const notebook = useMemo(() => getNotebook(notionId), [notionId, data]);
    const { is_subscribed } = useCourseSubscription(id);
    const [showSubscribe, setShowSubscribe] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const renderNotebook = (): boolean => {
        console.log(notebook);

        if (notebook?.is_public && notebook.is_free) {
            return true;
        }

        if (notebook?.is_public && !notebook.is_free) {
            if (!is_subscribed) {
                setShowSubscribe(true);
            }

            return false;
        }

        if (!notebook?.is_public && notebook?.is_free) {
            if (isAuthenticated) {
                return true;
            }
            setModalAuthOpen(1, true);
            return false;
        }

        if (isAuthenticated && is_subscribed) {
            return true;
        }

        if (!is_subscribed) {
            setShowSubscribe(true);
        }

        return false;
    };

    useEffect(() => {
        setShowContent(renderNotebook());
    }, [data, notebook]);

    return (
        <section className="pt-[65px] flex flex-col md:flex-row relative md:overflow-hidden md:h-[100vh] bg-white">
            <div className="w-[20vw] hidden md:block md:border-r md:border-neutral-200 h-[calc(100vh-64px)] overflow-auto">
                <ListOfAstroNotes />
            </div>
            <div
                className="md:hidden bg-neutral-800 border-4 border-neutral-600 text-neutral-200 top-[70px] right-0 w-8 rounded-l-xl h-16 z-10 fixed flex justify-center items-center"
                onClick={() => setShowMaterial(true)}
                aria-hidden>
                <FaList />
            </div>
            {isMobileBreakpoints && showMaterial && (
                <div className="fixed z-[100] top-0 right-0 w-screen h-screen bg-white">
                    <header className="w-full px-4 md:px-8 py-4 flex items-center justify-between text-black">
                        <span className="text-2xl font-bold cursor-pointer font-[Urbanist]">
                            G
                        </span>
                        <div
                            className="flex items-center"
                            onClick={() => setShowMaterial(false)}
                            aria-hidden>
                            <FaChevronRight />
                            <FaChevronRight className="-ml-2" />
                            <span className="text-bold">Tutup</span>
                        </div>
                    </header>
                    <div className="px-4">
                        <h1 className="text-2xl md:text-4xl font-bold break-word flex gap-1 items-center text-black">
                            AstroNotes:{' '}
                            {loading ? (
                                <div className="p-4 w-64 bg-neutral-300 animate-pulse rounded-lg" />
                            ) : (
                                data?.course_name
                            )}
                        </h1>
                        <ListOfAstroNotes
                            extraCallback={() => setShowMaterial(false)}
                        />
                    </div>
                </div>
            )}
            <div className="w-full overflow-y-auto">
                {showContent ? (
                    <NotionRenderer
                        mapPageUrl={customMapPageUrl(id, notionId)}
                        recordMap={notes}
                        fullPage={true}
                        darkMode={false}
                        disableHeader
                        components={{
                            Code,
                            Collection,
                            Equation,
                            Modal,
                            Pdf
                        }}
                    />
                ) : (
                    <></>
                )}
                {showSubscribe ? (
                    <div className="w-full h-screen p-4">
                        <NeedSubscribe />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </section>
    );
};

export default LearnAstroNotes;
