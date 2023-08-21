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
    data
}: {
    data: BookResponse;
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
                <ListOfContent data={data} setNavigation={setNavigation} />
            )}
            {navigation === 'BOOKMARK' && (
                <Bookmark setNavigation={setNavigation} />
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

const ListOfContent = ({
    data,
    setNavigation
}: {
    data: BookResponse;
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
}): JSX.Element => {
    return (
        <div className="w-[230px] h-[calc(100vh-88px)] bg-[#121212] rounded-lg text-white">
            <div className="flex justify-between p-2 border-b border-[#2D2D2D]">
                <span className="inline-block font-body text-xs pt-[2px]">
                    DAFTAR ISI
                </span>
                <IoMdClose
                    size={18}
                    className="text-[#333333] hover:text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="px-2 py-[10px] flex flex-col gap-2">
                {data.book.chapters.map((value) => (
                    <Subchapter key={value.id} value={value} />
                ))}
            </div>
        </div>
    );
};

export const Subchapter = ({ value }: { value: BookChapter }): JSX.Element => {
    const router = useRouter();
    const { slug, id } = router.query;
    const [isShow, setIsShow] = useState(false);

    return (
        <div key={value.id}>
            <div
                className="flex items-center gap-[6px] cursor-pointer"
                onClick={() => setIsShow((prev) => !prev)}
                aria-hidden>
                <FaChevronRight
                    size={12}
                    className={`text-[#CCCCCC] ${isShow && 'rotate-[-90deg]'}`}
                />
                <span className="inline-block font-body text-xs text-[#CCCCCC] pb-[1px]">
                    {value.title}
                </span>
            </div>
            <div
                className={`flex flex-col gap-1 pt-2 pl-4 ${
                    isShow ? '' : 'hidden'
                }`}>
                {value.subsection.sections.map((subsection) => (
                    <span
                        key={subsection.key}
                        className="inline-block font-body text-xs text-[#CCCCCC] p-1 cursor-pointer hover:bg-neutral-700 rounded"
                        onClick={() =>
                            router.push(
                                `/astronotes/${slug}/${id}/${subsection.key}`
                            )
                        }
                        aria-hidden>
                        {subsection.title}
                    </span>
                ))}
            </div>
        </div>
    );
};

const Bookmark = ({
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
            <div className="px-2 py-[10px] flex flex-col gap-2">ISINYA</div>
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
                ISINYA
                <div className="relative w-max h-max">
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[20px] h-[10px] bg-[#D9D9D9]" />
                    <FaToggleOn size={24} className="relative text-[#333333]" />
                </div>
            </div>
        </div>
    );
};
