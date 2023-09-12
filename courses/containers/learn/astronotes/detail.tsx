import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useState } from 'react';
import { useRouter } from 'next/router';
import useElementSize from 'commons/hooks/useElementSize';
import { AstronotesSidebar } from './sidebar';
import { AstronotesFooter } from './footer';
import {
    useGetBookProgressQuery,
    usePostHighlightMutation
} from 'courses/redux/api/astronotesApi';
import Skeleton from 'commons/components/elements/Skeleton';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import NeedSubscribe from 'courses/components/NeedSubscribe';

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
    const { is_subscribed } = useCourseSubscription();

    const { data, isLoading, isFetching } = useGetBookProgressQuery(
        { slug: slug as string },
        { skip: !slug }
    );

    const [highlighted, setHighlighted] = useState(false);
    const [dataHighlighted, setDataHighlighted] =
        useState<DataHighlightedInterface>();
    const [points, setPoints] = useState({ x: 0, y: 0, width: 0 });
    const [fontStyle, setFontStyle] = useState<'DEFAULT' | 'SERIF' | 'MONO'>(
        'DEFAULT'
    );
    const [smallText, setSmallText] = useState(false);
    // const [zoom, setZoom] = useState(100);

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
                    smallText={smallText}
                    setSmallText={setSmallText}
                />
            </div>
            <div
                className="w-full md:ml-7 mt-5 mb-[55px] overflow-y-auto"
                ref={notebookRef}>
                <div
                    className={`w-[80%] mx-auto ${
                        fontStyle === 'DEFAULT'
                            ? 'font-body'
                            : fontStyle === 'SERIF'
                            ? 'font-serif'
                            : 'font-mono'
                    }`}>
                    {!is_subscribed ? (
                        <NeedSubscribe />
                    ) : isLoading || isFetching ? (
                        <>
                            <Skeleton className="w-[30%] h-[26px] p-0 !mb-2" />
                            <Skeleton className="h-[26px] p-0 !mb-2" />
                            <Skeleton className="h-[26px] p-0 !mb-2" />
                            <Skeleton className="h-[26px] p-0 !mb-2" />
                            <Skeleton className="w-[30%] h-[26px] p-0 !mb-2" />
                            <Skeleton className="h-[26px] p-0 !mb-2" />
                            <Skeleton className="h-[26px] p-0 !mb-2" />
                            <Skeleton className="h-[26px] p-0 !mb-2" />
                            <Skeleton className="h-[26px] p-0 !mb-2" />
                        </>
                    ) : (
                        data && (
                            <div onMouseUp={handleHighlight} aria-hidden>
                                <ReactMarkdown
                                    className={`markdown-table markdown-overflow-break-word markdown-blue-link markdown-img-max-height ${
                                        smallText
                                            ? 'markdown-body-very-small'
                                            : 'markdown-body-xs'
                                    }`}
                                    remarkPlugins={[remarkMath, remarkGfm]}
                                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                                    linkTarget={'_blank'}>
                                    {data?.page_content?.replaceAll('\t', '')}
                                </ReactMarkdown>
                            </div>
                        )
                    )}
                </div>
            </div>
            <div
                className="fixed bottom-0 md:right-[17px] pt-2 pb-6 bg-white dark:bg-black"
                style={{ width: notebookWidth }}>
                <AstronotesFooter
                    fontStyle={fontStyle}
                    setFontStyle={setFontStyle}
                    smallText={smallText}
                    setSmallText={setSmallText}
                />
            </div>
        </section>
    );
};

export default AstronoteDetail;
