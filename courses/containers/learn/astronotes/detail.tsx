import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useState } from 'react';
import { useRouter } from 'next/router';
// import NeedSubscribe from 'courses/components/NeedSubscribe';
// import { useAuth } from 'authentication/contexts/AuthProvider';
// import { AUTHENTICATION_ROUTE } from 'commons/constants';
import useElementSize from 'commons/hooks/useElementSize';
import { AstronotesSidebar } from './sidebar';
import { AstronotesFooter } from './footer';
import {
    useGetBookProgressQuery,
    usePostHighlightMutation
} from 'courses/redux/api/astronotesApi';

export const customMapPageUrl =
    (rootPageId: string, notionId: string) => () => {
        return `/astronotes/${rootPageId}/${notionId}`;
    };

interface DataHighlightedInterface {
    block_content_id: string;
    text: string;
    anchor_offset: number;
    focus_offset: number;
}

const AstronotesContextMenu = ({
    points,
    setHighlighted,
    dataHighlighted
}: {
    points: { x: number; y: number; width: number };
    setHighlighted: React.Dispatch<React.SetStateAction<boolean>>;
    dataHighlighted: DataHighlightedInterface;
}): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;
    const [postHighlight] = usePostHighlightMutation();

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
                <div
                    className="w-5 h-5 rounded-full bg-[#F1BF42] cursor-pointer"
                    onClick={() => {
                        postHighlight({
                            ...dataHighlighted,
                            slug: slug as string,
                            color: '#F1BF42'
                        });
                        setHighlighted(false);
                    }}
                    aria-hidden
                />
                <div
                    className="w-5 h-5 rounded-full bg-[#D85140] cursor-pointer"
                    onClick={() => {
                        postHighlight({
                            ...dataHighlighted,
                            slug: slug as string,
                            color: '#D85140'
                        });
                        setHighlighted(false);
                    }}
                    aria-hidden
                />
                <div
                    className="w-5 h-5 rounded-full bg-[#58A65C] cursor-pointer"
                    onClick={() => {
                        postHighlight({
                            ...dataHighlighted,
                            slug: slug as string,
                            color: '#58A65C'
                        });
                        setHighlighted(false);
                    }}
                    aria-hidden
                />
                <div
                    className="w-5 h-5 rounded-full bg-[#3C89E4] cursor-pointer"
                    onClick={() => {
                        postHighlight({
                            ...dataHighlighted,
                            slug: slug as string,
                            color: '#3C89E4'
                        });
                        setHighlighted(false);
                    }}
                    aria-hidden
                />
            </div>
        </>
    );
};

const AstronoteDetail = (): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;
    const { width: notebookWidth, ref: notebookRef } =
        useElementSize<HTMLDivElement>();
    // const { isAuthenticated } = useAuth();

    const { data } = useGetBookProgressQuery(
        { slug: slug as string },
        { skip: !slug }
    );

    // const { is_subscribed } = useCourseSubscription(slug as string);
    // const [showSubscribe, setShowSubscribe] = useState(false);
    // const [showContent, setShowContent] = useState(false);
    const [highlighted, setHighlighted] = useState(false);
    const [dataHighlighted, setDataHighlighted] =
        useState<DataHighlightedInterface>();
    const [points, setPoints] = useState({ x: 0, y: 0, width: 0 });
    const [fontStyle, setFontStyle] = useState<'DEFAULT' | 'SERIF' | 'MONO'>(
        'DEFAULT'
    );

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
        const selectedNode = objectSelection?.anchorNode?.parentElement;
        const selectedId = selectedNode?.id;
        const isHighlighted = !!selectedNode?.getAttribute('data-highlight');

        if (objectSelection?.anchorNode !== objectSelection?.focusNode) return;
        if (objectSelection?.anchorOffset === objectSelection?.focusOffset)
            return;
        if (isHighlighted) return;

        setPoints({
            x: objectSelection?.getRangeAt(0).getBoundingClientRect()
                .x as number,
            y: objectSelection?.getRangeAt(0).getBoundingClientRect()
                .y as number,
            width: objectSelection?.getRangeAt(0).getBoundingClientRect()
                .width as number
        });
        setHighlighted(true);
        setDataHighlighted({
            block_content_id: selectedId as string,
            text: selectedNode?.textContent as string,
            anchor_offset: objectSelection?.anchorOffset as number,
            focus_offset: objectSelection?.focusOffset as number
        });
    };

    // useEffect(() => {
    //     // setShowContent(renderNotebook());
    // }, [data, is_subscribed, isAuthenticated]);

    return (
        <section className="pt-[65px] flex flex-col md:flex-row relative md:overflow-hidden md:h-[100vh] bg-white dark:bg-black text-black dark:text-white">
            {highlighted && (
                <AstronotesContextMenu
                    points={points}
                    setHighlighted={setHighlighted}
                    dataHighlighted={
                        dataHighlighted as DataHighlightedInterface
                    }
                />
            )}
            <div className="hidden md:block h-[calc(100vh-88px)] my-auto pl-5">
                <AstronotesSidebar
                    fontStyle={fontStyle}
                    setFontStyle={setFontStyle}
                />
            </div>
            <div className="w-full overflow-y-auto" ref={notebookRef}>
                <div
                    className={`w-[80%] mx-auto ${
                        fontStyle === 'DEFAULT'
                            ? 'font-body'
                            : fontStyle === 'SERIF'
                            ? 'font-serif'
                            : 'font-mono'
                    }`}>
                    {/* <div onMouseUp={handleHighlight} aria-hidden>
                        <ReactMarkdown
                            className="markdown-body-xs markdown-overflow-break-word markdown-blue-link markdown-img-max-height"
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex, rehypeRaw]}
                            linkTarget={'_blank'}>
                            {text
                                ?.replaceAll('\n', '\n\n')
                                ?.replaceAll(/\\/g, '\\\\')
                                ?.replaceAll(/\textup/g, '9unix9')
                                ?.replaceAll(/\t/g, '')
                                ?.replaceAll('9unix9', '\\textup')}
                        </ReactMarkdown>
                    </div> */}
                    {data && (
                        <div onMouseUp={handleHighlight} aria-hidden>
                            <ReactMarkdown
                                className="markdown-body-xs markdown-overflow-break-word markdown-blue-link markdown-img-max-height"
                                remarkPlugins={[remarkMath, remarkGfm]}
                                rehypePlugins={[rehypeKatex, rehypeRaw]}
                                linkTarget={'_blank'}>
                                {data?.page_content
                                    ?.replaceAll('\n', '\n\n')
                                    ?.replaceAll('\t', '')}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
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
                <AstronotesFooter
                    fontStyle={fontStyle}
                    setFontStyle={setFontStyle}
                />
            </div>
        </section>
    );
};

export default AstronoteDetail;
