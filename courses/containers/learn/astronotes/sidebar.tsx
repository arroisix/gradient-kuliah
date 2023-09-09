import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useThemeContext } from 'commons/contexts/ThemeProvider';
import {
    useGetBookmarksQuery,
    useGetHighlightQuery,
    useGetTableContentsQuery,
    usePostBookProgressMutation
} from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { AiOutlineFontColors } from 'react-icons/ai';
import { FaChevronRight, FaToggleOn } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import {
    MdFormatListBulleted,
    MdLibraryBooks,
    MdStarPurple500
} from 'react-icons/md';
import { RiQuestionLine } from 'react-icons/ri';

export type NavigationTypes = 'CLOSE' | 'LIST_CONTENT' | 'BOOKMARK' | 'SETTING';

export const AstronotesSidebar = ({
    fontStyle,
    setFontStyle
}: {
    fontStyle: 'DEFAULT' | 'SERIF' | 'MONO';
    setFontStyle: Dispatch<SetStateAction<'DEFAULT' | 'SERIF' | 'MONO'>>;
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
    return (
        <div
            className={`flex flex-col gap-3 bg-[#121212] rounded-[20px] px-1 py-[15px] text-[#999999] ${className}`}>
            <div
                className={`hover:bg-neutral-700 cursor-pointer rounded-full p-1 ${
                    navigation === 'LIST_CONTENT'
                        ? 'text-white'
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
                className={`hover:bg-neutral-700 cursor-pointer rounded-full p-1 ${
                    navigation === 'BOOKMARK' ? 'text-white' : 'text-[#999999]'
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
                className={`hover:bg-neutral-700 cursor-pointer rounded-full p-1 ${
                    navigation === 'SETTING' ? 'text-white' : 'text-[#999999]'
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
                className={`hover:bg-neutral-700 cursor-pointer rounded-full p-1 text-[#999999]`}
                onClick={() => setNavigation('CLOSE')}
                aria-hidden>
                <MdStarPurple500 size={18} />
            </div>
            <div
                className={`hover:bg-neutral-700 cursor-pointer rounded-full p-1 text-[#999999]`}
                onClick={() => setNavigation('CLOSE')}
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
    const { data } = useGetTableContentsQuery(
        { slug: slug as string },
        { skip: !slug }
    );

    return (
        <div className="relative w-[230px] h-[calc(100vh-88px)] bg-[#121212] rounded-lg text-white">
            <div className="flex justify-between p-2 border-b border-[#2D2D2D]">
                <span className="inline-block font-body text-xs pt-[2px]">
                    Daftar Isi
                </span>
                <IoMdClose
                    size={18}
                    className="text-[#333333] hover:text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="h-[calc(100vh-126px)] overflow-y-auto px-2 py-[10px] flex flex-col gap-2">
                {data?.contents?.map((value) => (
                    <Content key={value.book_chapter_id} value={value} />
                ))}
            </div>
        </div>
    );
};

export const Content = ({
    value
}: {
    value: tableContentInterface;
}): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;
    const [isShow, setIsShow] = useState(false);
    const [postBookProgress] = usePostBookProgressMutation();

    return (
        <div key={value.book_chapter_id}>
            <div
                className="flex gap-[6px] cursor-pointer"
                onClick={() => setIsShow((prev) => !prev)}
                aria-hidden>
                <FaChevronRight
                    size={12}
                    className={`text-[#CCCCCC] mt-[2px] ${
                        isShow && 'rotate-[-90deg]'
                    }`}
                />
                <span className="inline-block font-body text-xs text-[#CCCCCC] pb-[1px]">
                    {value.title}
                </span>
            </div>
            <div
                className={`flex flex-col gap-1 pt-2 pl-4 ${
                    isShow ? '' : 'hidden'
                }`}>
                {value.blocks?.map((block) => (
                    <span
                        key={block.block_id}
                        className="text-[#CCCCCC] p-1 cursor-pointer hover:bg-neutral-700 rounded"
                        onClick={() =>
                            postBookProgress({
                                slug: slug as string,
                                next_page_order: block.page_order
                            })
                        }
                        aria-hidden>
                        <ReactMarkdown
                            className="markdown-body-xs markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height"
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex, rehypeRaw]}
                            linkTarget={'_blank'}>
                            {block.block_heading}
                        </ReactMarkdown>
                    </span>
                ))}
            </div>
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
    const { data: highlightData } = useGetHighlightQuery(
        { slug: slug as string },
        { skip: !slug }
    );
    const { data: bookmarkData } = useGetBookmarksQuery(
        { slug: slug as string },
        { skip: !slug }
    );

    return (
        <div className="w-[230px] h-[calc(100vh-88px)] bg-[#121212] rounded-lg text-white">
            <div className="flex justify-around pl-4 pr-2 pt-[10px] border-b border-[#2D2D2D]">
                <div className="flex gap-4">
                    <span
                        className={`inline-block font-body text-xs pb-[7px] cursor-pointer ${
                            selected === 'HIGHLIGHT' &&
                            'text-[#B6A6F3] border-b-2 border-[#C4B9FF]'
                        }`}
                        onClick={() => setSelected('HIGHLIGHT')}
                        aria-hidden>
                        HIGHLIGHT
                    </span>
                    <span
                        className={`inline-block font-body text-xs pb-[7px] cursor-pointer ${
                            selected === 'BOOKMARK' &&
                            'text-[#B6A6F3] border-b-2 border-[#C4B9FF]'
                        }`}
                        onClick={() => setSelected('BOOKMARK')}
                        aria-hidden>
                        BOOKMARK
                    </span>
                </div>
                <IoMdClose
                    size={18}
                    className="text-[#333333] hover:text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="h-[calc(100vh-126px)] overflow-y-auto px-2 py-[10px] flex flex-col gap-2">
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
                    className={`text-[#CCCCCC] mt-[2px] ${
                        isShow && 'rotate-90'
                    }`}
                />
                <span className="inline-block font-body text-xs text-[#CCCCCC]">
                    {data.title}
                </span>
            </div>
            {data.blocks?.map((block, index) => (
                <div
                    key={index}
                    className={`flex flex-col gap-1 pt-2 pl-4 ${
                        isShow ? '' : 'hidden'
                    }`}>
                    <span className="inline-block font-body text-[10px] text-[#999999]">
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
                    className={`text-[#CCCCCC] mt-[2px] ${
                        isShow && 'rotate-[-90deg]'
                    }`}
                />
                <span className="inline-block font-body text-xs text-[#CCCCCC]">
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
                        className="text-[#999999] cursor-pointer"
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
    setNavigation
}: {
    fontStyle: 'DEFAULT' | 'SERIF' | 'MONO';
    setFontStyle: Dispatch<SetStateAction<'DEFAULT' | 'SERIF' | 'MONO'>>;
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
}): JSX.Element => {
    return (
        <div className="w-[230px] h-[calc(100vh-88px)] bg-[#121212] rounded-lg text-white">
            <div className="flex justify-between p-2 border-b border-[#2D2D2D]">
                <span className="inline-block font-body text-xs pt-[2px]">
                    Opsi Tampilan
                </span>
                <IoMdClose
                    size={18}
                    className="text-[#333333] hover:text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="px-2 py-[10px] flex flex-col gap-2">
                <Settings fontStyle={fontStyle} setFontStyle={setFontStyle} />
            </div>
        </div>
    );
};

export const Settings = ({
    fontStyle,
    setFontStyle
}: {
    fontStyle: 'DEFAULT' | 'SERIF' | 'MONO';
    setFontStyle: Dispatch<SetStateAction<'DEFAULT' | 'SERIF' | 'MONO'>>;
}): JSX.Element => {
    const { theme, toggleTheme } = useThemeContext();
    const [smallText, setSmallText] = useState(false);

    return (
        <>
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={toggleTheme}
                aria-hidden>
                <span className="inline-block font-body text-xs text-[#CCCCCC]">
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
                <span className="inline-block font-body text-xs text-[#CCCCCC]">
                    Style
                </span>
                <div className="flex gap-2">
                    <div
                        className={`flex flex-col items-center gap-[2px] w-[55px] pt-[5px] pb-[7px] hover:bg-[#2D2D2D] rounded-lg cursor-pointer ${
                            fontStyle === 'DEFAULT' && 'bg-[#212121]'
                        }`}
                        onClick={() => setFontStyle('DEFAULT')}
                        aria-hidden>
                        <span
                            className={`inline-block font-body ${
                                fontStyle === 'DEFAULT' && 'text-[#B6A6F3]'
                            }`}>
                            Ag
                        </span>
                        <span className="inline-block font-body text-[10px] text-[#CCCCCC]">
                            Default
                        </span>
                    </div>
                    <div
                        className={`flex flex-col items-center gap-[2px] w-[55px] pt-[5px] pb-[7px] hover:bg-[#2D2D2D] rounded-lg cursor-pointer ${
                            fontStyle === 'SERIF' && 'bg-[#212121]'
                        }`}
                        onClick={() => setFontStyle('SERIF')}
                        aria-hidden>
                        <span
                            className={`inline-block font-serif ${
                                fontStyle === 'SERIF' && 'text-[#B6A6F3]'
                            }`}>
                            Ag
                        </span>
                        <span className="inline-block font-body text-[10px] text-[#CCCCCC]">
                            Serif
                        </span>
                    </div>
                    <div
                        className={`flex flex-col items-center gap-[2px] w-[55px] pt-[5px] pb-[7px] hover:bg-[#2D2D2D] rounded-lg cursor-pointer ${
                            fontStyle === 'MONO' && 'bg-[#212121]'
                        }`}
                        onClick={() => setFontStyle('MONO')}
                        aria-hidden>
                        <span
                            className={`inline-block font-mono ${
                                fontStyle === 'MONO' && 'text-[#B6A6F3]'
                            }`}>
                            Ag
                        </span>
                        <span className="inline-block font-body text-[10px] text-[#CCCCCC]">
                            Mono
                        </span>
                    </div>
                </div>
            </div>
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setSmallText((prev) => !prev)}
                aria-hidden>
                <span className="inline-block font-body text-xs text-[#CCCCCC]">
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
