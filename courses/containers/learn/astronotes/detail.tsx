import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import useElementSize from 'commons/hooks/useElementSize';
import { AstronotesSidebar } from './sidebar';
import { AstronotesFooter } from './footer';
import {
    useDeleteHighlightMutation,
    useGetBookProgressQuery,
    usePostHighlightMutation
} from 'courses/redux/api/astronotesApi';
import Skeleton from 'commons/components/elements/Skeleton';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import NeedSubscribe from 'courses/components/NeedSubscribe';
import { AiFillDelete } from 'react-icons/ai';
import { isNotNullAndUndefined } from 'commons/utils';

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
    transform = '',
    children
}: {
    points: { x: number; y: number; width: number };
    setHighlighted: React.Dispatch<React.SetStateAction<boolean>>;
    transform?: string;
    children: ReactNode;
}): JSX.Element => {
    return (
        <>
            <div
                className="absolute w-screen h-screen top-0 left-0 bg-transparent z-[1]"
                onClick={() => setHighlighted(false)}
                aria-hidden
            />
            <div
                style={{
                    position: 'absolute',
                    zIndex: '2',
                    top: points.y + 24,
                    left: points.x,
                    transform: transform
                }}>
                {children}
            </div>
        </>
    );
};

const HighlightContextMenu = ({
    setHighlighted,
    dataHighlighted
}: {
    setHighlighted: React.Dispatch<React.SetStateAction<boolean>>;
    dataHighlighted: DataHighlightedInterface;
}): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;
    const [postHighlight] = usePostHighlightMutation();

    return (
        <div className="flex gap-6 p-4 bg-[#242424] rounded-xl">
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
    );
};

const RemoveHighlightContextMenu = ({
    setRemoveHighlighted,
    highlightId,
    setHighlightId,
    points
}: {
    setRemoveHighlighted: React.Dispatch<React.SetStateAction<boolean>>;
    highlightId: string;
    setHighlightId: React.Dispatch<string>;
    points: { x: number; y: number; width: number };
}): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;

    const [deleteHighlight] = useDeleteHighlightMutation();

    function handleDeleteHighlight(): void {
        deleteHighlight({ slug: slug as string, highlight_id: highlightId });
        setHighlightId('');
        setRemoveHighlighted(false);
    }

    return (
        <div
            className="pt-[30px] flex justify-center"
            style={{ width: `${points.width}px` }}
            onMouseLeave={() => setRemoveHighlighted(false)}>
            <div className="w-max flex items-center py-3 px-4 bg-neutral-200 dark:bg-[#242424] rounded-xl">
                <AiFillDelete
                    className="mr-3 hover:text-error cursor-pointer"
                    onClick={handleDeleteHighlight}
                />
                <span className="inline-block text-xs border-l border-black dark:border-white pl-3 whitespace-nowrap">
                    You highlighted
                </span>
            </div>
        </div>
    );
};

const AstronoteDetail = (): JSX.Element => {
    const router = useRouter();
    const { slug, page } = router.query;
    const { width: notebookWidth, ref: notebookRef } =
        useElementSize<HTMLDivElement>();
    const { is_subscribed } = useCourseSubscription();

    const { data, isLoading, isFetching } = useGetBookProgressQuery(
        { slug: slug as string, page: page as unknown as number },
        { skip: !isNotNullAndUndefined(slug) || !isNotNullAndUndefined(page) }
    );

    const [highlighted, setHighlighted] = useState(false);
    const [removeHighlighted, setRemoveHighlighted] = useState(false);
    const [highlightId, setHighlightId] = useState('');
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

    const handleHover = (event: React.MouseEvent<HTMLDivElement>): void => {
        const selectedNode = event.target as HTMLDivElement;
        const isHighlighted = !!selectedNode?.getAttribute('data-highlight');
        const highlightId = selectedNode.getAttribute('id');

        if (isHighlighted) {
            setPoints({
                x: selectedNode.getBoundingClientRect().x as number,
                y: selectedNode.getBoundingClientRect().y as number,
                width: selectedNode.getBoundingClientRect().width as number
            });
            setHighlightId(highlightId as string);
            setRemoveHighlighted(true);
        }
    };

    return (
        <section className="pt-[65px] flex flex-col md:flex-row relative md:overflow-hidden md:h-[100vh] bg-white dark:bg-black text-black dark:text-white">
            {highlighted && (
                <AstronotesContextMenu
                    points={points}
                    setHighlighted={setHighlighted}
                    transform={`translateX(${points.width / 2 - 92}px)`}>
                    <HighlightContextMenu
                        dataHighlighted={
                            dataHighlighted as DataHighlightedInterface
                        }
                        setHighlighted={setHighlighted}
                    />
                </AstronotesContextMenu>
            )}
            {removeHighlighted && (
                <AstronotesContextMenu
                    points={points}
                    setHighlighted={setRemoveHighlighted}
                    transform={`translateY(-30px)`}>
                    <RemoveHighlightContextMenu
                        points={points}
                        setRemoveHighlighted={setRemoveHighlighted}
                        highlightId={highlightId}
                        setHighlightId={setHighlightId}
                    />
                </AstronotesContextMenu>
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
                            <div
                                onMouseUp={handleHighlight}
                                onMouseOverCapture={handleHover}
                                aria-hidden>
                                <ReactMarkdown
                                    className={`markdown-table markdown-overflow-break-word markdown-blue-link markdown-img-max-height astronotes ${
                                        smallText
                                            ? 'markdown-body-very-small'
                                            : 'markdown-body-xs'
                                    }`}
                                    remarkPlugins={[remarkMath, remarkGfm]}
                                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                                    linkTarget={'_blank'}>
                                    {data?.page_content}
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
