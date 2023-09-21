import Skeleton from 'commons/components/elements/Skeleton';
import useElementSize from 'commons/hooks/useElementSize';
import { isNotNullAndUndefined } from 'commons/utils';
import AstronotesContextMenu from 'courses/components/LearningExperience/AstroNotes/AstronotesContextMenu';
import HighlightContextMenu from 'courses/components/LearningExperience/AstroNotes/Highlights/HighlightContextMenu';
import RemoveHighlightContextMenu from 'courses/components/LearningExperience/AstroNotes/Highlights/RemoveHighlightContextMenu';
import NeedSubscribe from 'courses/components/NeedSubscribe';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetBookProgressQuery } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import AstronotesNavigation from 'courses/components/LearningExperience/AstroNotes/Navigation/AstronotesNavigation';
import AstronotesSidebar from 'courses/components/LearningExperience/AstroNotes/Sidebar/AstronotesSidebar';

const Astronotes = (): JSX.Element => {
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
    const [fontStyle, setFontStyle] = useState<AstronotesFontStyle>('DEFAULT');
    const [smallText, setSmallText] = useState(false);

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
                <AstronotesNavigation
                    fontStyle={fontStyle}
                    setFontStyle={setFontStyle}
                    smallText={smallText}
                    setSmallText={setSmallText}
                />
            </div>
        </section>
    );
};

export default Astronotes;
