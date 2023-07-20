import { useRef, useState } from 'react';
import ProgressBar from './ProgressBar';
import { MdStarPurple500 } from 'react-icons/md';
import { IoIosSearch, IoMdClose } from 'react-icons/io';
import Collapse from './Collapse';
import Image from 'next/image';
import { AiFillStar } from 'react-icons/ai';
import useElementSize from 'commons/hooks/useElementSize';
import useOnScreen from 'commons/hooks/useOnScreen';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useRouter } from 'next/router';
import { useGetCourseContentQuery } from 'courses/redux/api/courseApi';
import { useGetLearningProgressQuery } from 'courses/redux/api/learningExperienceApi';
import Skeleton from 'commons/components/elements/Skeleton';

const AccordionVideo = ({
    chapters,
    isLoading
}: {
    chapters: CourseChapter[];
    isLoading: boolean;
}): JSX.Element => {
    return (
        <div className="flex flex-col gap-3 lg:pb-[18px]">
            {isLoading && (
                <>
                    <Skeleton className="h-[40px] !m-0" />
                    <Skeleton className="h-[40px] !m-0" />
                    <Skeleton className="h-[40px] !m-0" />
                </>
            )}
            {chapters?.map(({ chapter_id, chapter_name, is_finished }) => (
                <Collapse
                    key={chapter_id}
                    title={chapter_name}
                    chapter_id={chapter_id}
                    is_finished={is_finished ?? false}
                />
            ))}
        </div>
    );
};

export const ListBooks = ({
    books,
    isLoading
}: {
    books: Book[];
    isLoading: boolean;
}): JSX.Element => {
    return (
        <div className="flex flex-col gap-[14px]">
            {isLoading && (
                <>
                    <Skeleton className="h-[60px] !m-0" />
                    <Skeleton className="h-[60px] !m-0" />
                    <Skeleton className="h-[60px] !m-0" />
                </>
            )}
            {books?.map(
                ({ book_id, title, authors, rating, book_cover_url }) => (
                    <div className="flex gap-5" key={book_id}>
                        <div>
                            <Image
                                src={book_cover_url ?? '/'} // ! foto dummy
                                width={79}
                                height={113}
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col gap-[6px]">
                            <span className="inline-block font-body text-lg text-neutral-200">
                                {title}
                            </span>
                            <div>
                                <span className="inline-block font-body text-base text-neutral-600">
                                    {`oleh ${authors}`}
                                </span>
                                <span className="flex items-center gap-[2px] font-body text-xs text-neutral-600">
                                    <AiFillStar />
                                    {rating}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

const CourseDetailBox = (): JSX.Element => {
    const [navigation, setNavigation] = useState<
        'VIDEO' | 'BOOK' | 'ON_SEARCH'
    >('VIDEO');
    const [isSearch, setIsSearch] = useState(false);
    const [search, setSearch] = useState('');

    const { checkCustomBreakpoints } = useWindowBreakpoints();
    const anchor = useRef<HTMLDivElement>({} as HTMLDivElement);
    const { height: boxHeight, ref: boxRef } = useElementSize<HTMLDivElement>();
    const { height: headerBoxHeight, ref: headerBoxRef } =
        useElementSize<HTMLDivElement>();
    const isOnScreen = useOnScreen(anchor);

    const router = useRouter();
    const { id } = router.query;

    const { data: courseContent, isLoading: isLoadingCourse } =
        useGetCourseContentQuery(
            {
                slug: id as string
            },
            { skip: !id }
        );
    const { data: learningProgress } = useGetLearningProgressQuery(
        id as string,
        { skip: !id }
    );

    function handleSearch(): void {
        // logic search
    }

    return (
        <div
            className="relative w-full h-full bg-[#121212] lg:rounded-lg lg:overflow-hidden"
            ref={boxRef}>
            {!isOnScreen && !checkCustomBreakpoints(1024) && (
                <div className="w-full h-[40px] absolute bottom-0 bg-gradient-to-b from-transparent to-[#121212] z-[1]"></div>
            )}
            <div
                className="flex flex-col gap-[14px] px-5 md:px-16 lg:px-[18px] py-[18px] bg-[#1D1D1D]"
                ref={headerBoxRef}>
                <div className="flex justify-between items-center">
                    <h4 className="font-sans font-extrabold text-base xl:text-lg">
                        Dasar Integral{' '}
                        <span className="font-body text-[#FFFFFF80]">
                            (6h 42m)
                        </span>
                    </h4>
                    <MdStarPurple500 size={20} className="text-neutral-400" />
                </div>
                <ProgressBar
                    total_finished_video={
                        learningProgress?.completion_percentage
                            ?.total_finished_video
                    }
                    total_video_count={
                        learningProgress?.completion_percentage
                            ?.total_video_count
                    }
                />
            </div>
            <div
                className="flex flex-col gap-[18px] px-5 md:px-16 lg:px-[14px] pt-[14px]"
                style={{
                    height: !checkCustomBreakpoints(1024)
                        ? boxHeight - headerBoxHeight
                        : '100%'
                }}>
                {isSearch ? (
                    <div className="flex items-center px-3 bg-[#212121] rounded-[100px] border-[1px] border-neutral-400">
                        <IoIosSearch
                            size={20}
                            className="text-[#DADADA] cursor-pointer"
                            onClick={handleSearch}
                        />
                        <input
                            className="w-full bg-transparent border-none font-body text-xs focus:outline-none focus:ring-0 focus:appearance-none"
                            type="text"
                            value={search}
                            name="search"
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyDown={(event) => {
                                event.key === 'Enter' ? handleSearch() : null;
                            }}
                        />
                        <IoMdClose
                            size={16}
                            className="text-white cursor-pointer"
                            onClick={() => {
                                setIsSearch(false);
                                setNavigation('VIDEO');
                            }}
                        />
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                            <span
                                className={`inline-block font-bold text-sm pb-[6px] cursor-pointer ${
                                    navigation === 'VIDEO'
                                        ? 'border-b-2 border-accent-purple'
                                        : 'text-neutral-600 border-none hover:text-neutral-500'
                                }`}
                                onClick={() => setNavigation('VIDEO')}
                                aria-hidden>
                                VIDEO
                            </span>
                            <span
                                className={`inline-block font-bold text-sm pb-[6px] cursor-pointer ${
                                    navigation === 'BOOK'
                                        ? 'border-b-2 border-accent-purple'
                                        : 'text-neutral-600 border-none hover:text-neutral-500'
                                }`}
                                onClick={() => setNavigation('BOOK')}
                                aria-hidden>
                                BUKU
                            </span>
                        </div>
                        <IoIosSearch
                            size={20}
                            className="text-[#DADADA] hover:text-white cursor-pointer"
                            onClick={() => setIsSearch(true)}
                        />
                    </div>
                )}
                <div className="h-full lg:overflow-y-auto">
                    {navigation === 'VIDEO' && (
                        <AccordionVideo
                            chapters={
                                courseContent?.chapters as CourseChapter[]
                            }
                            isLoading={isLoadingCourse}
                        />
                    )}
                    {navigation === 'BOOK' && (
                        <ListBooks
                            books={courseContent?.books as Book[]}
                            isLoading={isLoadingCourse}
                        />
                    )}
                    <div ref={anchor}></div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailBox;
