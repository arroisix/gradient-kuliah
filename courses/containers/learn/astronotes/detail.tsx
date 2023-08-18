import { NotionRenderer } from 'react-notion-x';
import dynamic from 'next/dynamic';
import { ExtendedRecordMap } from 'notion-types';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { FaChevronRight, FaList, FaToggleOn } from 'react-icons/fa';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import NeedSubscribe from 'courses/components/NeedSubscribe';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { AUTHENTICATION_ROUTE } from 'commons/constants';
import { useGetBookContentQuery } from 'courses/redux/api/courseApi';
import { AstroNotesItem } from './home';
import {
    MdFormatListBulleted,
    MdLibraryBooks,
    MdStarPurple500
} from 'react-icons/md';
import { AiOutlineFontColors } from 'react-icons/ai';
import { RiQuestionLine } from 'react-icons/ri';
import { IoMdClose } from 'react-icons/io';
import useElementSize from 'commons/hooks/useElementSize';

const Code = dynamic(() =>
    import('react-notion-x/build/third-party/code').then((m) => m.Code)
);
const Collection = dynamic(() =>
    import('react-notion-x/build/third-party/collection').then(
        (m) => m.Collection
    )
);
const Equation = dynamic(() =>
    import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
);
const Pdf = dynamic(
    () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
    {
        ssr: false
    }
);
const Modal = dynamic(
    () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
    {
        ssr: false
    }
);

type NavigationTypes = 'CLOSE' | 'LIST_CONTENT' | 'BOOKMARK' | 'SETTING';

export const customMapPageUrl =
    (rootPageId: string, notionId: string) => () => {
        return `/astronotes/${rootPageId}/${notionId}`;
    };

const ListOfAstroNotes = ({
    data,
    setShowMaterial
}: {
    data: BookResponse;
    setShowMaterial?: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
    return (
        <div className="py-4">
            {data?.book.chapters?.map((astro: BookChapter) => (
                <AstroNotesItem
                    astro={astro}
                    key={astro.id}
                    book={data.book}
                    extraCallback={
                        setShowMaterial
                            ? () => setShowMaterial(false)
                            : undefined
                    }
                />
            ))}
        </div>
    );
};

const AstronotesSidebar = ({ data }: { data: BookResponse }): JSX.Element => {
    const [navigation, setNavigation] = useState<NavigationTypes>('CLOSE');
    return (
        <div className="flex gap-[10px]">
            <div className="h-[calc(100vh-88px)] flex flex-col gap-3 bg-[#121212] rounded-[20px] px-1 py-[15px] text-[#999999]">
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
                        navigation === 'BOOKMARK'
                            ? 'text-white'
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
                    className={`hover:bg-neutral-700 cursor-pointer rounded-full p-1 ${
                        navigation === 'SETTING'
                            ? 'text-white'
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

const Subchapter = ({ value }: { value: BookChapter }): JSX.Element => {
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
                    className={`${isShow && 'rotate-[-90deg]'}`}
                />
                <span className="inline-block font-body text-xs pb-[1px]">
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
                        className="inline-block font-body text-xs p-1 cursor-pointer hover:bg-neutral-700 rounded"
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

const AstronotesFooter = (): JSX.Element => {
    return (
        <div className="flex">
            <div className="w-full px-5">
                <Pagination />
            </div>
            <div className="flex items-center px-5 border-l-2 border-[#333333]">
                <ZoomPercentage />
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

const AstronoteDetail = ({
    notes
}: {
    notes: ExtendedRecordMap | null;
}): JSX.Element => {
    const router = useRouter();
    const { slug, id } = router.query;
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const { width: notebookWidth, ref: notebookRef } =
        useElementSize<HTMLDivElement>();
    const { isAuthenticated } = useAuth();
    const [showMaterial, setShowMaterial] = useState(false);
    const { data, isLoading } = useGetBookContentQuery(
        {
            slug: slug as string,
            book_id: id as string
        },
        { skip: !slug || !id }
    );
    const { is_subscribed } = useCourseSubscription(slug as string);
    const [showSubscribe, setShowSubscribe] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const renderNotebook = (): boolean => {
        if (data?.book?.is_public && data?.book.is_free) {
            return true;
        }

        if (data?.book?.is_public && !data?.book.is_free) {
            if (!is_subscribed) {
                setShowSubscribe(true);
            }

            return false;
        }

        if (!data?.book?.is_public && data?.book?.is_free) {
            setShowSubscribe(false);
            if (isAuthenticated) {
                return true;
            }
            router.push(AUTHENTICATION_ROUTE);
            return false;
        }

        if (isAuthenticated && is_subscribed) {
            return true;
        }

        if (!is_subscribed) {
            setShowSubscribe(true);
        }

        return false;
    };

    useEffect(() => {
        setShowContent(renderNotebook());
    }, [data, is_subscribed, isAuthenticated]);

    return (
        <section className="pt-[65px] flex flex-col md:flex-row relative md:overflow-hidden md:h-[100vh] bg-black">
            <div className="hidden md:block h-[calc(100vh-88px)] my-auto pl-5">
                <AstronotesSidebar data={data as BookResponse} />
            </div>
            <div
                className="md:hidden bg-neutral-800 border-4 border-neutral-600 text-neutral-200 top-[70px] right-0 w-8 rounded-l-xl h-16 z-10 fixed flex justify-center items-center"
                onClick={() => setShowMaterial(true)}
                aria-hidden>
                <FaList />
            </div>
            {isMobileBreakpoints && showMaterial && (
                <div className="fixed z-[100] top-0 right-0 w-screen h-screen bg-white">
                    <header className="flex items-center justify-between w-full px-4 py-4 text-black md:px-8">
                        <span className="text-2xl font-bold cursor-pointer font-[Urbanist]">
                            G
                        </span>
                        <div
                            className="flex items-center"
                            onClick={() => setShowMaterial(false)}
                            aria-hidden>
                            <FaChevronRight />
                            <FaChevronRight className="-ml-2" />
                            <span className="text-bold">Tutup</span>
                        </div>
                    </header>
                    <div className="px-4">
                        <h1 className="flex items-center gap-1 text-2xl font-bold text-black md:text-4xl break-word">
                            {isLoading ? (
                                <div className="w-64 p-4 rounded-lg bg-neutral-300 animate-pulse" />
                            ) : (
                                data?.book.title
                            )}
                        </h1>
                        <div className="h-[calc(95vh-100px)] overflow-auto">
                            <ListOfAstroNotes
                                data={data as BookResponse}
                                setShowMaterial={setShowMaterial}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full overflow-y-auto" ref={notebookRef}>
                {!!notes && showContent ? (
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
                )}
                {showSubscribe ? (
                    <div className="w-full h-screen p-4">
                        <NeedSubscribe />
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <div
                className="fixed bottom-0 right-0 pt-2 pb-6 bg-black"
                style={{ width: notebookWidth }}>
                <AstronotesFooter />
            </div>
        </section>
    );
};

export default AstronoteDetail;
