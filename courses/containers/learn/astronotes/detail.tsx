import { useEffect, useState } from 'react';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
// import NeedSubscribe from 'courses/components/NeedSubscribe';
import { useAuth } from 'authentication/contexts/AuthProvider';
// import { AUTHENTICATION_ROUTE } from 'commons/constants';
import { useGetBookContentQuery } from 'courses/redux/api/courseApi';
import useElementSize from 'commons/hooks/useElementSize';
import { AstronotesSidebar } from './sidebar';
import { AstronotesFooter } from './footer';

export const customMapPageUrl =
    (rootPageId: string, notionId: string) => () => {
        return `/astronotes/${rootPageId}/${notionId}`;
    };

const AstronotesContextMenu = ({
    points,
    setHighlighted
}: {
    points: { x: number; y: number; width: number };
    setHighlighted: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
    return (
        <>
            <div
                className="absolute w-screen h-screen top-0 left-0 bg-transparent z-[1]"
                onClick={() => setHighlighted(false)}
                aria-hidden
            />
            <div
                className="absolute flex gap-6 p-4 bg-[#242424] rounded-xl z-[2]"
                style={{
                    top: points.y + 24,
                    left: points.x,
                    transform: `translateX(${points.width / 2 - 92}px)`
                }}>
                <div className="w-5 h-5 rounded-full bg-[#F1BF42] cursor-pointer" />
                <div className="w-5 h-5 rounded-full bg-[#D85140] cursor-pointer" />
                <div className="w-5 h-5 rounded-full bg-[#58A65C] cursor-pointer" />
                <div className="w-5 h-5 rounded-full bg-[#3C89E4] cursor-pointer" />
            </div>
        </>
    );
};

const DUMMY_BOOK_PROGRESS = {
    page_id: 'askdjgh12319',
    is_bookmarked: false,
    slug: 'sataos',
    chapter_title: 'Probabilitas',
    total_page: 200,
    current_page: 1,
    blocks: [
        {
            id: 'askjdg17267',
            order: 1,
            contents: [
                {
                    id: 'asdkjh1491',
                    text: 'Suatu eksperimen secara natural melibatkan komponen acak. Komponen acak dapat bernilai sangat kecil sehingga dapat diabaikan. Namun, sebaik apapun eksperimen yang dilakukan, variasi pada hasil akan selalu ada. Maka, tujuan kita dari belajar probabilitas adalah untuk mengerti, mengkuantifikasi dan memodelkan variasi tersebut.',
                    type: 'TEXT',
                    annotation: {
                        anchor_offset: '20',
                        focus_offset: '40',
                        color: 'red'
                    }
                },
                {
                    id: 'aseiuqwwenas',
                    text: 'Pada awalnya, para ilmuwan seperti John Dalton menyatakan bahwa semua materi terdiri atas atom yang merupakan unit terkecil dan tidak dapat dibagi-bagi lagi. Akan tetapi, berbagai eksperimen lanjutan yang dilakukan pada abad ke-19 menunjukkan bahwa atom terdiri dari tiga jenis partikel subatom, yaitu proton, neutron, dan elektron. Atom memiliki inti atom (disebut sebagai nukleus) yang tersusun atas proton dan neutron. Elektron dalam atom mengelilingi inti dan mengisi sisa volume atom. Elektron memiliki muatan negatif (-1), proton memiliki muatan positif (+1), dan neutron memiliki muatan netral (0)',
                    type: 'TEXT',
                    annotation: {
                        anchor_offset: '0',
                        focus_offset: '12',
                        color: 'red'
                    }
                }
            ]
        }
    ]
};

const AstronoteDetail = (): JSX.Element => {
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
    // const [showSubscribe, setShowSubscribe] = useState(false);
    // const [showContent, setShowContent] = useState(false);
    const [highlighted, setHighlighted] = useState(false);
    const [points, setPoints] = useState({ x: 0, y: 0, width: 0 });

    // const renderNotebook = (): boolean => {
    //     if (data?.book?.is_public && data?.book.is_free) {
    //         return true;
    //     }

    //     if (data?.book?.is_public && !data?.book.is_free) {
    //         if (!is_subscribed) {
    //             setShowSubscribe(true);
    //         }

    //         return false;
    //     }

    //     if (!data?.book?.is_public && data?.book?.is_free) {
    //         setShowSubscribe(false);
    //         if (isAuthenticated) {
    //             return true;
    //         }
    //         router.push(AUTHENTICATION_ROUTE);
    //         return false;
    //     }

    //     if (isAuthenticated && is_subscribed) {
    //         return true;
    //     }

    //     if (!is_subscribed) {
    //         setShowSubscribe(true);
    //     }

    //     return false;
    // };

    const handleHighlight = (): void => {
        const objectSelection = window.getSelection();
        if (objectSelection?.anchorNode !== objectSelection?.focusNode) return;
        if (objectSelection?.anchorOffset === objectSelection?.focusOffset)
            return;
        setPoints({
            x: objectSelection?.getRangeAt(0).getBoundingClientRect()
                .x as number,
            y: objectSelection?.getRangeAt(0).getBoundingClientRect()
                .y as number,
            width: objectSelection?.getRangeAt(0).getBoundingClientRect()
                .width as number
        });
        setHighlighted(true);

        console.log(
            objectSelection?.getRangeAt(0).getBoundingClientRect(),
            'ANCHOT'
        );
    };

    useEffect(() => {
        // setShowContent(renderNotebook());
    }, [data, is_subscribed, isAuthenticated]);

    return (
        <section className="pt-[65px] flex flex-col md:flex-row relative md:overflow-hidden md:h-[100vh] bg-black">
            {highlighted && (
                <AstronotesContextMenu
                    points={points}
                    setHighlighted={setHighlighted}
                />
            )}
            <div className="hidden md:block h-[calc(100vh-88px)] my-auto pl-5">
                <AstronotesSidebar />
            </div>
            <div className="w-full overflow-y-auto" ref={notebookRef}>
                <div className="w-[80%] mx-auto">
                    {DUMMY_BOOK_PROGRESS.blocks?.map((block) => (
                        <>
                            {block.contents?.map((content) => (
                                <div
                                    key={content.id}
                                    onMouseUp={handleHighlight}
                                    aria-hidden>
                                    {content.text}
                                </div>
                            ))}
                        </>
                    ))}
                </div>
                {/* {!!notes && showContent ? (
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
                )} */}
                {/* {showSubscribe ? (
                    <div className="w-full h-screen p-4">
                        <NeedSubscribe />
                    </div>
                ) : (
                    <></>
                )} */}
            </div>
            <div
                className="fixed bottom-0 right-[17px] pt-2 pb-6 bg-black"
                style={{ width: notebookWidth - 17 }}>
                <AstronotesFooter />
            </div>
        </section>
    );
};

export default AstronoteDetail;
