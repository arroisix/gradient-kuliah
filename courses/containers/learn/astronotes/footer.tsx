import { useState, useRef, Dispatch, SetStateAction } from 'react';
import { BiMenu } from 'react-icons/bi';
import { FaChevronRight } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import {
    Bookmark,
    Content,
    Highlight,
    NavigationTypes,
    Settings,
    SidebarNav
} from './sidebar';
import {
    useGetHighlightQuery,
    useGetTableContentsQuery
} from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';

export const AstronotesFooter = ({
    fontStyle,
    setFontStyle
}: {
    fontStyle: 'DEFAULT' | 'SERIF' | 'MONO';
    setFontStyle: Dispatch<SetStateAction<'DEFAULT' | 'SERIF' | 'MONO'>>;
}): JSX.Element => {
    return (
        <div className="relative flex">
            <div className="md:hidden pl-5">
                <MobileSideBar
                    fontStyle={fontStyle}
                    setFontStyle={setFontStyle}
                />
            </div>
            <div className="w-full px-5">
                <Pagination />
            </div>
            <div className="hidden md:flex items-center px-5 border-l-2 border-[#333333]">
                <ZoomPercentage />
            </div>
        </div>
    );
};

const MobileSideBar = ({
    fontStyle,
    setFontStyle
}: {
    fontStyle: 'DEFAULT' | 'SERIF' | 'MONO';
    setFontStyle: Dispatch<SetStateAction<'DEFAULT' | 'SERIF' | 'MONO'>>;
}): JSX.Element => {
    const [isShow, setIsShow] = useState(false);
    const [navigation, setNavigation] = useState<NavigationTypes>('CLOSE');

    return (
        <div className="relative">
            {isShow ? (
                <MdClose size={24} onClick={() => setIsShow((prev) => !prev)} />
            ) : (
                <BiMenu size={24} onClick={() => setIsShow((prev) => !prev)} />
            )}
            {isShow && (
                <SidebarNav
                    navigation={navigation}
                    setNavigation={setNavigation}
                    className="absolute left-[-5px] bottom-[30px] z-[2]"
                />
            )}
            {navigation === 'LIST_CONTENT' && (
                <MobileListOfContent setNavigation={setNavigation} />
            )}
            {navigation === 'BOOKMARK' && (
                <MobileBookmarkSidebar setNavigation={setNavigation} />
            )}
            {navigation === 'SETTING' && (
                <MobileSetting
                    fontStyle={fontStyle}
                    setFontStyle={setFontStyle}
                    setNavigation={setNavigation}
                />
            )}
            {navigation !== 'CLOSE' ||
                (isShow && (
                    <div
                        className="absolute left-[-20px] bottom-[-25px] w-screen h-screen bg-transparent z-[1]"
                        onClick={() => {
                            setIsShow(false);
                            setNavigation('CLOSE');
                        }}
                        aria-hidden
                    />
                ))}
        </div>
    );
};

const MobileListOfContent = ({
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
        <div className="absolute left-[-20px] bottom-[-24px] w-screen h-[calc(100vh-200px)] bg-[#1D1D1D] z-10">
            <div className="flex justify-between p-5">
                <span className="inline-block font-extrabold text-base pt-[2px]">
                    Daftar Isi
                </span>
                <MdClose
                    size={24}
                    className="text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="px-5 py-3 flex flex-col gap-2">
                {data?.contents?.map((value) => (
                    <Content key={value.page_id} value={value} />
                ))}
            </div>
        </div>
    );
};

const MobileBookmarkSidebar = ({
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

    return (
        <div className="absolute left-[-20px] bottom-[-24px] w-screen h-[calc(100vh-200px)] bg-[#1D1D1D] z-10">
            <div className="flex justify-between p-5">
                <div className="flex gap-8">
                    <span
                        className={`inline-block font-extrabold text-base pb-[6px] cursor-pointer ${
                            selected === 'HIGHLIGHT' &&
                            'text-[#B6A6F3] border-b-2 border-[#C4B9FF]'
                        }`}
                        onClick={() => setSelected('HIGHLIGHT')}
                        aria-hidden>
                        Highlight
                    </span>
                    <span
                        className={`inline-block font-extrabold text-base pb-[6px] cursor-pointer ${
                            selected === 'BOOKMARK' &&
                            'text-[#B6A6F3] border-b-2 border-[#C4B9FF]'
                        }`}
                        onClick={() => setSelected('BOOKMARK')}
                        aria-hidden>
                        Bookmark
                    </span>
                </div>
                <MdClose
                    size={24}
                    className="text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="px-5 py-3 flex flex-col gap-2">
                {selected === 'HIGHLIGHT' &&
                    highlightData?.data?.map((value) => (
                        <Highlight key={value.book_chapter_id} data={value} />
                    ))}
                {selected === 'BOOKMARK' && <Bookmark />}
            </div>
        </div>
    );
};

const MobileSetting = ({
    fontStyle,
    setFontStyle,
    setNavigation
}: {
    fontStyle: 'DEFAULT' | 'SERIF' | 'MONO';
    setFontStyle: Dispatch<SetStateAction<'DEFAULT' | 'SERIF' | 'MONO'>>;
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
}): JSX.Element => {
    return (
        <div className="absolute left-[-20px] bottom-[-24px] w-screen h-[calc(100vh-200px)] bg-[#1D1D1D] z-10">
            <div className="flex justify-between p-5">
                <span className="inline-block font-extrabold text-base pt-[2px]">
                    Opsi Tampilan
                </span>
                <MdClose
                    size={24}
                    className="text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="px-5 py-3 flex flex-col gap-2">
                <Settings fontStyle={fontStyle} setFontStyle={setFontStyle} />
            </div>
        </div>
    );
};

const Pagination = (): JSX.Element => {
    const MAX_VALUE = 10;
    const ref = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState(1);
    const [percent, setPercent] = useState(0);
    const [isHoldClick, setIsHoldClick] = useState(false);

    function handleMouseDown(
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): void {
        setIsHoldClick(true);
        handleMouse(event);
    }

    function handleMouseUp(): void {
        setIsHoldClick(false);
    }

    function handleMouseMove(
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): void {
        if (isHoldClick) {
            handleMouse(event);
        }
    }

    function handleMouse(
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): void {
        const clicked = event.pageX;
        const left = ref.current?.getBoundingClientRect().left || 0;
        const width = ref.current?.clientWidth || -1;
        const percent = ((clicked - left) / width) * 100;
        const multiple = MAX_VALUE / 100;
        const barValue = (percent * multiple).toFixed(0);
        const barPercent = ((percent * multiple) / MAX_VALUE) * 100;

        setValue(
            parseInt(barValue) < 1
                ? 1
                : parseInt(barValue) > MAX_VALUE
                ? MAX_VALUE
                : parseInt(barValue)
        );

        setPercent(barPercent < 0 ? 0 : barPercent > 100 ? 100 : barPercent);
    }

    function handlePrev(): void {
        setValue((prev) => (prev - 1 < 1 ? 1 : prev - 1));
        const multiple = MAX_VALUE / 100;
        const barPercent = ((percent * multiple - 1) / MAX_VALUE) * 100;
        setPercent(barPercent < 0 ? 0 : barPercent > 100 ? 100 : barPercent);
    }

    function handleNext(): void {
        setValue((prev) => (prev + 1 > MAX_VALUE ? MAX_VALUE : prev + 1));
        const multiple = MAX_VALUE / 100;
        const barPercent = ((percent * multiple + 1) / MAX_VALUE) * 100;
        setPercent(barPercent < 0 ? 0 : barPercent > 100 ? 100 : barPercent);
    }

    return (
        <div className="flex gap-6">
            <div
                className="relative flex items-center w-full pt-6 px-2 cursor-pointer"
                ref={ref}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
                aria-hidden>
                <div className="absolute top-[50%] left-0 translate-y-[-50%] w-full h-[3px] bg-[#999999]" />
                <div
                    style={{ width: `${percent}%` }}
                    className="absolute top-[50%] left-0 translate-y-[-50%] w-full h-[3px] bg-accent-purple"
                />
                <div
                    style={{ left: `${percent}%` }}
                    className="absolute top-[50%] translate-y-[-50%] translate-x-[-50%] w-[10px] h-[10px] bg-accent-purple rounded-full"
                />
            </div>
            <div className="flex items-center gap-[10px]">
                <FaChevronRight
                    size={12}
                    className="text-[#666666] hover:text-white rotate-180 cursor-pointer transition-all"
                    onClick={handlePrev}
                />
                <span className="inline-block font-body text-xs select-none">
                    {value}/{MAX_VALUE}
                </span>
                <FaChevronRight
                    size={12}
                    className="text-[#666666] hover:text-white cursor-pointer transition-all"
                    onClick={handleNext}
                />
            </div>
        </div>
    );
};

const ZoomPercentage = (): JSX.Element => {
    const [zoom, setZoom] = useState(100);

    function handleZoomIn(): void {
        setZoom((prev) => (prev + 25 > 500 ? 500 : prev + 25));
    }

    function handleZoomOut(): void {
        setZoom((prev) => (prev - 25 < 25 ? 25 : prev - 25));
    }
    return (
        <div className="flex items-center gap-[10px]">
            <div
                className="w-[16px] h-[16px] pb-[2px] flex items-center justify-center font-body leading-[0] bg-[#666666] rounded-full cursor-pointer select-none"
                onClick={handleZoomOut}
                aria-hidden>
                -
            </div>
            <span className="inline-block font-body text-xs select-none">
                {zoom}%
            </span>
            <div
                className="w-[16px] h-[16px] pb-[1px] flex items-center justify-center font-body leading-[0] bg-[#666666] rounded-full cursor-pointer select-none"
                onClick={handleZoomIn}
                aria-hidden>
                +
            </div>
        </div>
    );
};
