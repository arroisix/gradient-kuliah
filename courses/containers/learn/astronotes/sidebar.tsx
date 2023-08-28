import { useThemeContext } from 'commons/contexts/ThemeProvider';
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

export const AstronotesSidebar = (): JSX.Element => {
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
                <SidebarSetting setNavigation={setNavigation} />
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

export interface TABLE_CONTENT_INTERFACE {
    book_chapter_id: string;
    title: string;
    order: number;
    page_id: string;
    blocks: { block_id: string; block_heading: string; page_id: string }[];
}

export const DUMMY_TABLE_CONTENT: { contents: TABLE_CONTENT_INTERFACE[] } = {
    contents: [
        {
            book_chapter_id: 'asdhkg1k2938',
            title: 'Bab 1.  Unsur Molekul dan Tabel Periodik',
            order: 1,
            page_id: 'aksudg131h',
            blocks: [
                {
                    block_id: 'adkjg2i3169',
                    block_heading: 'Struktur Atom',
                    page_id: 'asdjkhq1236'
                }
            ]
        }
    ]
};

const ListOfContent = ({
    setNavigation
}: {
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
}): JSX.Element => {
    return (
        <div className="w-[230px] h-[calc(100vh-88px)] bg-[#121212] rounded-lg text-white">
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
            <div className="px-2 py-[10px] flex flex-col gap-2">
                {DUMMY_TABLE_CONTENT.contents?.map((value) => (
                    <Content key={value.page_id} value={value} />
                ))}
            </div>
        </div>
    );
};

export const Content = ({
    value
}: {
    value: TABLE_CONTENT_INTERFACE;
}): JSX.Element => {
    const router = useRouter();
    const { slug, id } = router.query;
    const [isShow, setIsShow] = useState(false);

    return (
        <div key={value.page_id}>
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
                        className="inline-block font-body text-xs text-[#CCCCCC] p-1 cursor-pointer hover:bg-neutral-700 rounded"
                        onClick={() =>
                            router.push(
                                `/astronotes/${slug}/${id}/${block.block_id}`
                            )
                        }
                        aria-hidden>
                        {block.block_heading}
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
            <div className="px-2 py-[10px] flex flex-col gap-2">
                {selected === 'HIGHLIGHT' && <Highlight />}
                {selected === 'BOOKMARK' && <Bookmark />}
            </div>
        </div>
    );
};

const DUMMY_HIGHLIGHTS = {
    data: [
        {
            book_chapter_id: 'asiqei12b31',
            title: 'Bab 1. Unsur Molekul dan Tabel Periodik',
            order: 1,
            blocks: [
                {
                    block_id: 'aslkdhj1q89741',
                    block_heading: '1.1 Struktur Atom',
                    highlights: [
                        {
                            text: 'tiga jenis partikel subatom, yaitu proton, neutron dan elektron',
                            page_id: 'asdkg1236192'
                        }
                    ]
                }
            ]
        }
    ]
};

export const Highlight = (): JSX.Element => {
    const [isShow, setIsShow] = useState(false);

    return (
        <div>
            {DUMMY_HIGHLIGHTS.data?.map((value) => (
                <>
                    <div
                        key={value.book_chapter_id}
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
                            {value.title}
                        </span>
                    </div>
                    {value.blocks?.map((block) => (
                        <div
                            key={block.block_id}
                            className={`flex flex-col gap-1 pt-2 pl-4 ${
                                isShow ? '' : 'hidden'
                            }`}>
                            <span className="inline-block font-body text-[10px] text-[#999999]">
                                {block.block_heading}
                            </span>
                            {block.highlights.map((highlight) => (
                                <span
                                    key={highlight.page_id}
                                    className="inline-block font-body text-xs pl-2 border-l-2"
                                    style={{ borderColor: '#D85140' }}>
                                    {highlight.text}
                                </span>
                            ))}
                        </div>
                    ))}
                </>
            ))}
        </div>
    );
};

const DUMMY_BOOKMARKS = {
    bookmarks: [
        {
            book_chapter_id: 'asdkhi1231',
            title: 'Bab 1. Unsur Molekul dan Tabel Periodik',
            order: 1,
            page_id: 'askjgd119gw',
            block_headings: ['1.1 Struktur Atom', '1.2 Struktur Molukel']
        }
    ]
};

export const Bookmark = (): JSX.Element => {
    const [isShow, setIsShow] = useState(false);

    return (
        <div>
            {DUMMY_BOOKMARKS.bookmarks?.map((value) => (
                <>
                    <div
                        key={value.book_chapter_id}
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
                            {value.title}
                        </span>
                    </div>
                    <div
                        className={`flex flex-col gap-1 pt-2 pl-4 ${
                            isShow ? '' : 'hidden'
                        }`}>
                        {value.block_headings?.map((block, index) => (
                            <span
                                key={index}
                                className="inline-block font-body text-[10px] text-[#999999]">
                                {block}
                            </span>
                        ))}
                    </div>
                </>
            ))}
        </div>
    );
};

const SidebarSetting = ({
    setNavigation
}: {
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
                <Settings />
            </div>
        </div>
    );
};

export const Settings = (): JSX.Element => {
    const { theme, toggleTheme } = useThemeContext();
    const [smallText, setSmallText] = useState(false);
    const [fontStyle, setFontStyle] = useState<'DEFAULT' | 'SERIF' | 'MONO'>(
        'DEFAULT'
    );

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
                        <span className="inline-block font-body text-[#B6A6F3]">
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
                        <span className="inline-block font-body text-[#B6A6F3]">
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
                        <span className="inline-block font-body text-[#B6A6F3]">
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
