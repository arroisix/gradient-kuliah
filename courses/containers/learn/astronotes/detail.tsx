import { NotionRenderer } from 'react-notion-x';
import dynamic from 'next/dynamic';
import { ExtendedRecordMap } from 'notion-types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FaChevronRight, FaList } from 'react-icons/fa';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import NeedSubscribe from 'courses/components/NeedSubscribe';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { AUTHENTICATION_ROUTE } from 'commons/constants';
import { useGetBookContentQuery } from 'courses/redux/api/courseApi';
import { AstroNotesItem } from './home';

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
        return `/astronotes/${rootPageId}/${notionId}`;
    };

const ListOfAstroNotes = ({
    data,
    setShowMaterial
}: {
    data: BookResponse;
    setShowMaterial?: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
    return (
        <div className="py-4">
            {data?.book.chapters?.map((astro: BookChapter) => (
                <AstroNotesItem
                    astro={astro}
                    key={astro.id}
                    book={data.book}
                    extraCallback={
                        setShowMaterial
                            ? () => setShowMaterial(false)
                            : undefined
                    }
                />
            ))}
        </div>
    );
};

const AstronoteDetail = ({
    notes
}: {
    notes: ExtendedRecordMap | null;
}): JSX.Element => {
    const router = useRouter();
    const { slug, id } = router.query;
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const { isAuthenticated } = useAuth();
    const [showMaterial, setShowMaterial] = useState(false);
    const { data, isLoading } = useGetBookContentQuery(
        {
            slug: slug as string,
            book_id: id as string
        },
        { skip: !slug || !id }
    );
    const { is_subscribed } = useCourseSubscription(slug as string);
    const [showSubscribe, setShowSubscribe] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const renderNotebook = (): boolean => {
        if (data?.book?.is_public && data?.book.is_free) {
            return true;
        }

        if (data?.book?.is_public && !data?.book.is_free) {
            if (!is_subscribed) {
                setShowSubscribe(true);
            }

            return false;
        }

        if (!data?.book?.is_public && data?.book?.is_free) {
            setShowSubscribe(false);
            if (isAuthenticated) {
                return true;
            }
            router.push(AUTHENTICATION_ROUTE);
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
    }, [data, is_subscribed, isAuthenticated]);

    return (
        <section className="pt-[65px] flex flex-col md:flex-row relative md:overflow-hidden md:h-[100vh] bg-white">
            <div className="min-w-[300px] w-[20vw] hidden md:block md:border-r md:border-neutral-200 h-[calc(100vh-64px)] overflow-auto text-black">
                <ListOfAstroNotes data={data as BookResponse} />
            </div>
            <div
                className="md:hidden bg-neutral-800 border-4 border-neutral-600 text-neutral-200 top-[70px] right-0 w-8 rounded-l-xl h-16 z-10 fixed flex justify-center items-center"
                onClick={() => setShowMaterial(true)}
                aria-hidden>
                <FaList />
            </div>
            {isMobileBreakpoints && showMaterial && (
                <div className="fixed z-[100] top-0 right-0 w-screen h-screen bg-white">
                    <header className="flex items-center justify-between w-full px-4 py-4 text-black md:px-8">
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
                        <h1 className="flex items-center gap-1 text-2xl font-bold text-black md:text-4xl break-word">
                            {isLoading ? (
                                <div className="w-64 p-4 rounded-lg bg-neutral-300 animate-pulse" />
                            ) : (
                                data?.book.title
                            )}
                        </h1>
                        <div className="h-[calc(95vh-100px)] overflow-auto">
                            <ListOfAstroNotes
                                data={data as BookResponse}
                                setShowMaterial={setShowMaterial}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full overflow-y-auto">
                {!!notes && showContent ? (
                    <NotionRenderer
                        mapPageUrl={customMapPageUrl(
                            id as string,
                            slug as string
                        )}
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

export default AstronoteDetail;
