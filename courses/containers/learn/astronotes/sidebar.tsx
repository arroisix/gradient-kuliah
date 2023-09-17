import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useThemeContext } from 'commons/contexts/ThemeProvider';
import {
    useGetBookmarksQuery,
    useGetHighlightQuery,
    useGetTableContentSubchaptersQuery,
    useGetTableContentsQuery,
    usePostBookProgressMutation,
    usePostFeedbackMutation,
    usePostRatingMutation
} from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiOutlineFontColors } from 'react-icons/ai';
import { FaChevronRight, FaToggleOn } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import {
    MdFormatListBulleted,
    MdLibraryBooks,
    MdStarPurple500
} from 'react-icons/md';
import { RiQuestionLine } from 'react-icons/ri';
import Modal from 'commons/components/modules/Modal';
import Button from 'commons/components/elements/Button';
import TextareaAutosize from 'react-textarea-autosize';
import Spinner from 'commons/components/elements/Spinner';
import Skeleton from 'commons/components/elements/Skeleton';

export type NavigationTypes = 'CLOSE' | 'LIST_CONTENT' | 'BOOKMARK' | 'SETTING';

export const AstronotesSidebar = ({
    fontStyle,
    setFontStyle,
    smallText,
    setSmallText
}: {
    fontStyle: 'DEFAULT' | 'SERIF' | 'MONO';
    setFontStyle: Dispatch<SetStateAction<'DEFAULT' | 'SERIF' | 'MONO'>>;
    smallText: boolean;
    setSmallText: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
    const [navigation, setNavigation] = useState<NavigationTypes>('CLOSE');
    return (
        <div className="flex gap-[10px]">
            <SidebarNav
                navigation={navigation}
                setNavigation={setNavigation}
                className="h-[calc(100vh-88px)]"
            />
            {navigation === 'LIST_CONTENT' && (
                <ListOfContent setNavigation={setNavigation} />
            )}
            {navigation === 'BOOKMARK' && (
                <BookmarkSidebar setNavigation={setNavigation} />
            )}
            {navigation === 'SETTING' && (
                <SidebarSetting
                    fontStyle={fontStyle}
                    setFontStyle={setFontStyle}
                    setNavigation={setNavigation}
                    smallText={smallText}
                    setSmallText={setSmallText}
                />
            )}
        </div>
    );
};

export const SidebarNav = ({
    navigation,
    setNavigation,
    className
}: {
    navigation: NavigationTypes;
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
    className?: string;
}): JSX.Element => {
    const [isModalRatingOpen, setIsModalRatingOpen] = useState<0 | 1>(0);
    const [isModalFeedbackOpen, setIsModalFeedbackOpen] = useState<0 | 1>(0);

    return (
        <div
            className={`flex flex-col gap-3 bg-[#F6F5F8] dark:bg-[#121212] rounded-[20px] px-1 py-[15px] text-black dark:text-[#999999] ${className}`}>
            <Modal
                isOpen={isModalRatingOpen}
                setOpen={setIsModalRatingOpen}
                variant="dark"
                className="!bg-[#1D1D1D] sm:!w-[500px] !max-w-[500px]">
                <ModalRatingBook setOpen={setIsModalRatingOpen} />
            </Modal>
            <Modal
                isOpen={isModalFeedbackOpen}
                setOpen={setIsModalFeedbackOpen}
                variant="dark"
                className="!bg-[#1D1D1D]">
                <ModalFeedbackBook setOpen={setIsModalFeedbackOpen} />
            </Modal>
            <div
                className={`hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer rounded-full p-1 ${
                    navigation === 'LIST_CONTENT'
                        ? 'text-black dark:text-white'
                        : 'text-[#999999]'
                }`}
                onClick={() =>
                    setNavigation((prev) =>
                        prev === 'LIST_CONTENT' ? 'CLOSE' : 'LIST_CONTENT'
                    )
                }
                aria-hidden>
                <MdFormatListBulleted size={18} />
            </div>
            <div
                className={`hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer rounded-full p-1 ${
                    navigation === 'BOOKMARK'
                        ? 'text-black dark:text-white'
                        : 'text-[#999999]'
                }`}
                onClick={() =>
                    setNavigation((prev) =>
                        prev === 'BOOKMARK' ? 'CLOSE' : 'BOOKMARK'
                    )
                }
                aria-hidden>
                <MdLibraryBooks size={18} />
            </div>
            <div
                className={`hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer rounded-full p-1 ${
                    navigation === 'SETTING'
                        ? 'text-black dark:text-white'
                        : 'text-[#999999]'
                }`}
                onClick={() =>
                    setNavigation((prev) =>
                        prev === 'SETTING' ? 'CLOSE' : 'SETTING'
                    )
                }
                aria-hidden>
                <AiOutlineFontColors size={18} />
            </div>
            <div
                className={`hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer rounded-full p-1 text-[#999999]`}
                onClick={() => {
                    setNavigation('CLOSE');
                    setIsModalRatingOpen(1);
                }}
                aria-hidden>
                <MdStarPurple500 size={18} />
            </div>
            <div
                className={`hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer rounded-full p-1 text-[#999999]`}
                onClick={() => {
                    setNavigation('CLOSE');
                    setIsModalFeedbackOpen(1);
                }}
                aria-hidden>
                <RiQuestionLine size={18} />
            </div>
        </div>
    );
};

const ListOfContent = ({
    setNavigation
}: {
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
}): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;
    const { data, isLoading } = useGetTableContentsQuery(
        { slug: slug as string },
        { skip: !slug }
    );

    return (
        <div className="relative w-[230px] h-[calc(100vh-88px)] bg-[#F6F5F8] dark:bg-[#121212] rounded-lg text-black dark:text-white">
            <div className="flex justify-between p-2 border-b border-[#c0c0c0] dark:border-[#2D2D2D]">
                <span className="inline-block font-body text-xs pt-[2px]">
                    Daftar Isi
                </span>
                <IoMdClose
                    size={18}
                    className="text-[#333333] hover:text-black dark:hover:text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="h-[calc(100vh-126px)] overflow-y-auto px-2 py-[10px] flex flex-col gap-2">
                {isLoading && (
                    <>
                        <Skeleton className="h-[20px] p-0 mb-0" />
                        <Skeleton className="h-[20px] p-0 mb-0" />
                        <Skeleton className="h-[20px] p-0 mb-0" />
                        <Skeleton className="h-[20px] p-0 mb-0" />
                    </>
                )}
                {data?.data?.map((value) => (
                    <Content key={value.id} value={value} />
                ))}
            </div>
        </div>
    );
};

export const SubChapterContent = ({
    chapterId
}: {
    chapterId: string;
}): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;
    const { data: subchapters } = useGetTableContentSubchaptersQuery(
        {
            slug: slug as string,
            chapter_id: chapterId
        },
        { skip: !slug }
    );

    return (
        <>
            {subchapters?.data.map((subchapter: BookSubchapter) => (
                <span
                    onClick={() =>
                        router.push(
                            `/astronotes/${slug}/${subchapter.page_order}/#${subchapter.id}`
                        )
                    }
                    key={subchapter.id}
                    className="text-black dark:text-[#CCCCCC] p-1 cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded"
                    aria-hidden>
                    <ReactMarkdown
                        className="markdown-body-xs markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height"
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                        linkTarget={'_blank'}>
                        {subchapter.title}
                    </ReactMarkdown>
                </span>
            ))}
        </>
    );
};

export const Content = ({ value }: { value: BookChapter }): JSX.Element => {
    const [isShow, setIsShow] = useState(false);

    return (
        <div key={value.id}>
            <div
                className="flex gap-[6px] cursor-pointer"
                onClick={() => setIsShow((prev) => !prev)}
                aria-hidden>
                <FaChevronRight
                    size={12}
                    className={`text-black dark:text-[#CCCCCC] mt-[2px] ${
                        isShow && 'rotate-[-90deg]'
                    }`}
                />
                <span className="inline-block font-body text-xs text-black dark:text-[#CCCCCC] pb-[1px]">
                    {value.title}
                </span>
            </div>
            {isShow && (
                <div className="flex flex-col gap-1 pt-2 pl-4">
                    <SubChapterContent chapterId={value.id} />
                </div>
            )}
        </div>
    );
};

const BookmarkSidebar = ({
    setNavigation
}: {
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
}): JSX.Element => {
    const [selected, setSelected] = useState<'HIGHLIGHT' | 'BOOKMARK'>(
        'HIGHLIGHT'
    );

    const router = useRouter();
    const { slug } = router.query;
    const { data: highlightData, isLoading: isLoadingHighlight } =
        useGetHighlightQuery({ slug: slug as string }, { skip: !slug });
    const { data: bookmarkData, isLoading: isLoadingBookmark } =
        useGetBookmarksQuery({ slug: slug as string }, { skip: !slug });

    return (
        <div className="w-[230px] h-[calc(100vh-88px)] bg-[#F6F5F8] dark:bg-[#121212] rounded-lg text-black dark:text-white">
            <div className="flex justify-around pl-4 pr-2 pt-[10px] dark:border-b dark:border-[#2D2D2D]">
                <div className="flex gap-4">
                    <span
                        className={`inline-block font-body text-xs pb-[7px] cursor-pointer ${
                            selected === 'HIGHLIGHT' &&
                            'text-[#7264EB] dark:text-[#B6A6F3] border-b-2 border-[#7264EB] dark:border-[#C4B9FF]'
                        }`}
                        onClick={() => setSelected('HIGHLIGHT')}
                        aria-hidden>
                        HIGHLIGHT
                    </span>
                    <span
                        className={`inline-block font-body text-xs pb-[7px] cursor-pointer ${
                            selected === 'BOOKMARK' &&
                            'text-[#7264EB] dark:text-[#B6A6F3] border-b-2 border-[#7264EB] dark:border-[#C4B9FF]'
                        }`}
                        onClick={() => setSelected('BOOKMARK')}
                        aria-hidden>
                        BOOKMARK
                    </span>
                </div>
                <IoMdClose
                    size={18}
                    className="text-[#333333] hover:text-black dark:hover:text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="h-[calc(100vh-126px)] overflow-y-auto px-2 py-[10px] flex flex-col gap-2">
                {((selected === 'HIGHLIGHT' && isLoadingHighlight) ||
                    (selected === 'BOOKMARK' && isLoadingBookmark)) && (
                    <>
                        <Skeleton className="h-[20px] p-0 mb-0" />
                        <Skeleton className="h-[20px] p-0 mb-0" />
                        <Skeleton className="h-[20px] p-0 mb-0" />
                        <Skeleton className="h-[20px] p-0 mb-0" />
                    </>
                )}
                {selected === 'HIGHLIGHT' &&
                    highlightData?.data?.map((value) => (
                        <Highlight key={value.book_chapter_id} data={value} />
                    ))}
                {selected === 'BOOKMARK' &&
                    bookmarkData?.bookmarks?.map((value, index) => (
                        <Bookmark key={index} data={value} />
                    ))}
            </div>
        </div>
    );
};

export const Highlight = ({
    data
}: {
    data: HighlightsInterface;
}): JSX.Element => {
    const [postBookProgress] = usePostBookProgressMutation();
    const router = useRouter();
    const { slug } = router.query;

    const [isShow, setIsShow] = useState(false);

    return (
        <div>
            <div
                key={data.book_chapter_id}
                className="flex gap-[6px] cursor-pointer"
                onClick={() => setIsShow((prev) => !prev)}
                aria-hidden>
                <FaChevronRight
                    size={12}
                    className={`text-black dark:text-[#CCCCCC] mt-[2px] ${
                        isShow && 'rotate-90'
                    }`}
                />
                <span className="inline-block font-body text-xs text-black dark:text-[#CCCCCC]">
                    {data.title}
                </span>
            </div>
            {data.blocks?.map((block, index) => (
                <div
                    key={index}
                    className={`flex flex-col gap-1 pt-2 pl-4 ${
                        isShow ? '' : 'hidden'
                    }`}>
                    <span className="inline-block font-body text-[10px] text-[#666666] dark:text-[#999999]">
                        {block.block_heading}
                    </span>
                    {block.highlights.map((highlight, index) => (
                        <span
                            onClick={() =>
                                postBookProgress({
                                    slug: slug as string,
                                    next_page_order: highlight.page_order
                                })
                            }
                            key={index}
                            className="inline-block font-body text-xs pl-2 border-l-2 cursor-pointer"
                            style={{ borderColor: highlight.color }}
                            aria-hidden>
                            {highlight.text}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
};

export const Bookmark = ({
    data
}: {
    data: BookmarkInterface;
}): JSX.Element => {
    const [postBookProgress] = usePostBookProgressMutation();
    const router = useRouter();
    const { slug } = router.query;

    const [isShow, setIsShow] = useState(false);

    return (
        <div>
            <div
                className="flex gap-[6px] cursor-pointer"
                onClick={() => setIsShow((prev) => !prev)}
                aria-hidden>
                <FaChevronRight
                    size={12}
                    className={`text-black dark:text-[#CCCCCC] mt-[2px] ${
                        isShow && 'rotate-[-90deg]'
                    }`}
                />
                <span className="inline-block font-body text-xs text-black dark:text-[#CCCCCC]">
                    {data.title}
                </span>
            </div>
            <div
                className={`flex flex-col gap-1 pt-2 pl-4 ${
                    isShow ? '' : 'hidden'
                }`}>
                {data.block_headings?.map((block, index) => (
                    <span
                        key={index}
                        className="text-[#666666] dark:text-[#999999] cursor-pointer"
                        onClick={() =>
                            postBookProgress({
                                slug: slug as string,
                                next_page_order: data.page_order
                            })
                        }
                        aria-hidden>
                        <ReactMarkdown
                            className="markdown-body-xs markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height"
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex, rehypeRaw]}
                            linkTarget={'_blank'}>
                            {block}
                        </ReactMarkdown>
                    </span>
                ))}
            </div>
        </div>
    );
};

const SidebarSetting = ({
    fontStyle,
    setFontStyle,
    setNavigation,
    smallText,
    setSmallText
}: {
    fontStyle: 'DEFAULT' | 'SERIF' | 'MONO';
    setFontStyle: Dispatch<SetStateAction<'DEFAULT' | 'SERIF' | 'MONO'>>;
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
    smallText: boolean;
    setSmallText: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
    return (
        <div className="w-[230px] h-[calc(100vh-88px)] bg-[#F6F5F8] dark:bg-[#121212] rounded-lg text-black dark:text-white">
            <div className="flex justify-between p-2 border-b border-[#c0c0c0] dark:border-[#2D2D2D]">
                <span className="inline-block font-body text-xs pt-[2px]">
                    Opsi Tampilan
                </span>
                <IoMdClose
                    size={18}
                    className="text-[#333333] hover:text-black dark:hover:text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="px-2 py-[10px] flex flex-col gap-2">
                <Settings
                    fontStyle={fontStyle}
                    setFontStyle={setFontStyle}
                    smallText={smallText}
                    setSmallText={setSmallText}
                />
            </div>
        </div>
    );
};

export const Settings = ({
    fontStyle,
    setFontStyle,
    smallText,
    setSmallText
}: {
    fontStyle: 'DEFAULT' | 'SERIF' | 'MONO';
    setFontStyle: Dispatch<SetStateAction<'DEFAULT' | 'SERIF' | 'MONO'>>;
    smallText: boolean;
    setSmallText: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
    const { theme, toggleTheme } = useThemeContext();

    return (
        <>
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={toggleTheme}
                aria-hidden>
                <span className="inline-block font-body text-xs text-black dark:text-[#CCCCCC]">
                    Tampilan Gelap
                </span>
                <div className="relative w-max h-max">
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[20px] h-[10px] bg-[#D9D9D9]" />
                    <FaToggleOn
                        size={24}
                        className={`relative text-[#333333] ${
                            theme === 'light' && 'rotate-180'
                        }`}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <span className="inline-block font-body text-xs text-black dark:text-[#CCCCCC]">
                    Style
                </span>
                <div className="flex gap-2">
                    <div
                        className={`flex flex-col items-center gap-[2px] w-[55px] pt-[5px] pb-[7px] hover:bg-neutral-200 dark:hover:bg-[#2D2D2D] rounded-lg cursor-pointer ${
                            fontStyle === 'DEFAULT' &&
                            'bg-white dark:bg-[#212121]'
                        }`}
                        onClick={() => setFontStyle('DEFAULT')}
                        aria-hidden>
                        <span
                            className={`inline-block font-body ${
                                fontStyle === 'DEFAULT' && 'text-[#B6A6F3]'
                            }`}>
                            Ag
                        </span>
                        <span className="inline-block font-body text-[10px] text-[#999999] dark:text-[#CCCCCC]">
                            Default
                        </span>
                    </div>
                    <div
                        className={`flex flex-col items-center gap-[2px] w-[55px] pt-[5px] pb-[7px] hover:bg-neutral-200 dark:hover:bg-[#2D2D2D] rounded-lg cursor-pointer ${
                            fontStyle === 'SERIF' &&
                            'bg-white dark:bg-[#212121]'
                        }`}
                        onClick={() => setFontStyle('SERIF')}
                        aria-hidden>
                        <span
                            className={`inline-block font-serif ${
                                fontStyle === 'SERIF' && 'text-[#B6A6F3]'
                            }`}>
                            Ag
                        </span>
                        <span className="inline-block font-body text-[10px] text-[#999999] dark:text-[#CCCCCC]">
                            Serif
                        </span>
                    </div>
                    <div
                        className={`flex flex-col items-center gap-[2px] w-[55px] pt-[5px] pb-[7px] hover:bg-neutral-200 dark:hover:bg-[#2D2D2D] rounded-lg cursor-pointer ${
                            fontStyle === 'MONO' && 'bg-white dark:bg-[#212121]'
                        }`}
                        onClick={() => setFontStyle('MONO')}
                        aria-hidden>
                        <span
                            className={`inline-block font-mono ${
                                fontStyle === 'MONO' && 'text-[#B6A6F3]'
                            }`}>
                            Ag
                        </span>
                        <span className="inline-block font-body text-[10px] text-[#999999] dark:text-[#CCCCCC]">
                            Mono
                        </span>
                    </div>
                </div>
            </div>
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setSmallText((prev) => !prev)}
                aria-hidden>
                <span className="inline-block font-body text-xs text-black dark:text-[#CCCCCC]">
                    Small text
                </span>
                <div className="relative w-max h-max">
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[20px] h-[10px] bg-[#D9D9D9]" />
                    <FaToggleOn
                        size={24}
                        className={`relative text-[#333333] ${
                            !smallText && 'rotate-180'
                        }`}
                    />
                </div>
            </div>
        </>
    );
};

const ModalRatingBook = ({
    setOpen
}: {
    setOpen: (status: 1 | 0) => void;
}): JSX.Element => {
    const [rating, setRating] = useState(0);
    const CONSTANT_RATING = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const router = useRouter();
    const { slug } = router.query;
    const [postRating, { isLoading, isSuccess }] = usePostRatingMutation();

    useEffect(() => {
        if (isSuccess) {
            setOpen(0);
        }
    }, [isSuccess, setOpen]);

    return (
        <div className="flex flex-col gap-8">
            <span className="inline-block font-extrabold mr-5">
                Seberapa membantu buku ini dalam pelajaranmu?
            </span>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                    {CONSTANT_RATING.map((value) => (
                        <span
                            key={value}
                            className={`w-[22px] h-[22px] sm:w-[32px] sm:h-[32px] flex justify-center items-center hover:bg-white font-bold text-[#333333] rounded-full cursor-pointer ${
                                rating === value ? 'bg-white' : 'bg-neutral-400'
                            }`}
                            onClick={() => setRating(value)}
                            aria-hidden>
                            {value}
                        </span>
                    ))}
                </div>
                <div className="flex justify-between">
                    <span className="inline-block font-body text-[10px]">
                        Tidak membantu
                    </span>
                    <span className="inline-block font-body text-[10px]">
                        Sangat membantu
                    </span>
                </div>
            </div>
            <Button
                variant="custom"
                className="bg-white text-black text-xs"
                onClick={() =>
                    postRating({ slug: slug as string, rate: rating / 2 })
                }>
                {isLoading ? (
                    <Spinner size="small" className="border-black" />
                ) : (
                    'Kirim'
                )}
            </Button>
        </div>
    );
};

const ModalFeedbackBook = ({
    setOpen
}: {
    setOpen: (status: 1 | 0) => void;
}): JSX.Element => {
    const [content, setContent] = useState('');

    const router = useRouter();
    const { slug } = router.query;
    const [postFeedback, { isLoading, isSuccess }] = usePostFeedbackMutation();

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
        setContent(event.target.value);
    }

    useEffect(() => {
        if (isSuccess) {
            setOpen(0);
        }
    }, [isSuccess, setOpen]);

    return (
        <div className="flex flex-col gap-8">
            <span className="inline-block font-extrabold mr-5">
                Bantuan dan Masukan
            </span>
            <div>
                <TextareaAutosize
                    value={content}
                    name="feedback"
                    onChange={handleChange}
                    placeholder="Kirim masukan ke Buku Gradient"
                    className="w-full h-full min-h-[124px] p-[10px] font-body text-xs bg-[#242424] border-none rounded-[8px] focus:outline-none focus:ring-0 focus:appearance-none placeholder:text-neutral-400"
                />
            </div>
            <Button
                variant="custom"
                className="bg-white text-black text-xs"
                onClick={() =>
                    postFeedback({ slug: slug as string, feedback: content })
                }>
                {isLoading ? (
                    <Spinner size="small" className="border-black" />
                ) : (
                    'Kirim'
                )}
            </Button>
        </div>
    );
};
