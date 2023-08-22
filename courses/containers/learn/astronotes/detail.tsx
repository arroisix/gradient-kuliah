import { NotionRenderer } from 'react-notion-x';
import dynamic from 'next/dynamic';
import { ExtendedRecordMap } from 'notion-types';
import { useEffect, useState } from 'react';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import NeedSubscribe from 'courses/components/NeedSubscribe';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { AUTHENTICATION_ROUTE } from 'commons/constants';
import { useGetBookContentQuery } from 'courses/redux/api/courseApi';
import useElementSize from 'commons/hooks/useElementSize';
import { AstronotesSidebar } from './sidebar';
import { AstronotesFooter } from './footer';

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

const AstronoteDetail = ({
    notes
}: {
    notes: ExtendedRecordMap | null;
}): JSX.Element => {
    const router = useRouter();
    const { slug, id } = router.query;
    const { width: notebookWidth, ref: notebookRef } =
        useElementSize<HTMLDivElement>();
    const { isAuthenticated } = useAuth();
    const { data } = useGetBookContentQuery(
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
        <section className="pt-[65px] flex flex-col md:flex-row relative md:overflow-hidden md:h-[100vh] bg-black">
            <div className="hidden md:block h-[calc(100vh-88px)] my-auto pl-5">
                <AstronotesSidebar data={data as BookResponse} />
            </div>
            <div className="w-full overflow-y-auto" ref={notebookRef}>
                {!!notes && showContent ? (
                    <NotionRenderer
                        className="!bg-black"
                        mapPageUrl={customMapPageUrl(
                            id as string,
                            slug as string
                        )}
                        recordMap={notes}
                        fullPage={true}
                        darkMode={true}
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
            <div
                className="fixed bottom-0 right-0 pt-2 pb-6 bg-black"
                style={{ width: notebookWidth }}>
                <AstronotesFooter data={data as BookResponse} />
            </div>
        </section>
    );
};

export default AstronoteDetail;
