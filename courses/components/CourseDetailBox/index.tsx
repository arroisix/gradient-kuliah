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
import {
    useGetCourseContentQuery,
    useGetCourseQuery,
    useLazyGetSearchCourseContentQuery
} from 'courses/redux/api/courseApi';
import { useGetLearningProgressQuery } from 'courses/redux/api/learningExperienceApi';
import Skeleton from 'commons/components/elements/Skeleton';
import moment from 'moment';
import Modal from 'commons/components/modules/Modal';
import ModalCourseFeedback from './ModalCourseFeedback';
import SearchList from './SearchList';
import { useTracker } from 'tracker/tracker';

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
            {chapters?.map(
                ({
                    chapter_id,
                    chapter_name,
                    is_finished,
                    subchapter_counts
                }) => (
                    <Collapse
                        key={chapter_id}
                        title={`${chapter_name} (${subchapter_counts})`}
                        chapter_id={chapter_id}
                        is_finished={is_finished ?? false}
                    />
                )
            )}
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
    const router = useRouter();
    const tracker = useTracker();
    // const { id } = router.query;

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
                ({ book_id, title, authors, rating, book_cover_url, slug }) => (
                    <div
                        className="flex items-center gap-5 cursor-pointer"
                        key={book_id}
                        onClick={() => {
                            tracker?.genericTrack('Click Book Item', {
                                'Course Slug': slug,
                                'Book Title': title
                            });
                            router.push(`/astronotes/${slug}/1`);
                        }}
                        aria-hidden>
                        <Image
                            src={
                                book_cover_url ||
                                'https://assets.gradient.academy/assets/astronotes-kalkulus2-placeholder.jpg'
                            }
                            width={79}
                            height={113}
                            className="object-contain rounded"
                        />
                        <div className="flex flex-col gap-[6px]">
                            <span className="inline-block text-lg font-body text-neutral-200">
                                {title}
                            </span>
                            <div>
                                {authors && (
                                    <span className="inline-block text-base font-body text-neutral-600">
                                        {`oleh ${authors}`}
                                    </span>
                                )}
                                {rating !== 0 && (
                                    <span className="flex items-center gap-[2px] font-body text-xs text-neutral-600">
                                        <AiFillStar />
                                        {+rating.toFixed(1)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

const CourseDetailBox = (): JSX.Element => {
    const tracker = useTracker();

    const [navigation, setNavigation] = useState<
        'VIDEO' | 'BOOK' | 'ON_SEARCH'
    >('VIDEO');
    const [isSearch, setIsSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [isModalFeedbackOpen, setIsModalFeedbackOpen] =
        useState<boolean>(false);

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
    const { data: learningProgress, isLoading: isLoadingLearning } =
        useGetLearningProgressQuery(id as string, { skip: !id });
    const { data: course } = useGetCourseQuery(undefined, {
        selectFromResult: ({ data, isLoading }) => ({
            data: data?.courses.find(({ slug }) => slug === id),
            isLoading: isLoading
        })
    });
    const [
        triggerSearch,
        {
            data: searchResult,
            isLoading: isSearchingLoading,
            isFetching: isSearchingFetching
        }
    ] = useLazyGetSearchCourseContentQuery();

    function handleSearch({
        type,
        page = 1
    }: {
        type?: 'BOOK' | 'CHAPTER' | 'SUBCHAPTER';
        page?: number;
    }): void {
        tracker?.genericTrack('Search Class Material', {
            'Course Slug': id,
            Query: search
        });
        setNavigation('ON_SEARCH');
        triggerSearch({
            slug: id as string,
            content: search,
            type,
            page
        });
    }

    return (
        <>
            <Modal
                isOpen={isModalFeedbackOpen}
                setOpen={setIsModalFeedbackOpen}
                variant="dark"
                className="!bg-[#1D1D1D]">
                <ModalCourseFeedback setOpen={setIsModalFeedbackOpen} />
            </Modal>
            <div
                className="relative w-full h-full bg-[#121212] lg:rounded-lg lg:overflow-hidden"
                ref={boxRef}>
                {!isOnScreen && !checkCustomBreakpoints(1024) && (
                    <div className="w-full h-[40px] absolute bottom-0 bg-gradient-to-b from-transparent to-[#121212] z-[1]"></div>
                )}
                <div
                    className="flex flex-col gap-[14px] px-5 md:px-16 lg:px-[18px] py-[18px] bg-[#1D1D1D]"
                    ref={headerBoxRef}>
                    <div className="flex items-center justify-between">
                        <h4 className="overflow-hidden font-sans text-base font-extrabold xl:text-lg whitespace-nowrap text-ellipsis">
                            {course?.course_name}
                        </h4>
                        <span className="min-w-[100px] font-body font-extrabold text-base xl:text-lg text-[#FFFFFF80] pl-1">
                            {isLoadingLearning ? (
                                <Skeleton className="h-[20px] !m-0 !p-0" />
                            ) : (
                                `(${moment
                                    .utc(
                                        learningProgress?.total_duration as number
                                    )
                                    .format('H')}h ${moment
                                    .utc(
                                        learningProgress?.total_duration as number
                                    )
                                    .format('mm')}m)`
                            )}
                        </span>
                        <div className="w-[20px] grow">
                            <MdStarPurple500
                                size={20}
                                className="ml-auto mr-0 cursor-pointer text-neutral-400 hover:text-white"
                                onClick={() => {
                                    tracker?.genericTrack(
                                        'Click Give Rating Button',
                                        { 'Course Slug': id }
                                    );
                                    setIsModalFeedbackOpen(true);
                                }}
                            />
                        </div>
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
                        isLoading={isLoadingLearning}
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
                                onClick={() => handleSearch({})}
                            />
                            <input
                                className="w-full text-xs bg-transparent border-none font-body focus:outline-none focus:ring-0 focus:appearance-none"
                                type="text"
                                value={search}
                                name="search"
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    event.key === 'Enter'
                                        ? handleSearch({})
                                        : null;
                                }}
                            />
                            <IoMdClose
                                size={16}
                                className="text-white cursor-pointer"
                                onClick={() => {
                                    setIsSearch(false);
                                    setSearch('');
                                    setNavigation('VIDEO');
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                                <span
                                    className={`inline-block font-bold text-sm pb-[6px] cursor-pointer ${
                                        navigation === 'VIDEO'
                                            ? 'border-b-2 border-accent-purple'
                                            : 'text-neutral-600 border-none hover:text-neutral-500'
                                    }`}
                                    onClick={() => {
                                        tracker?.genericTrack(
                                            'Click Video Tab - LMS',
                                            { 'Course Slug': id }
                                        );
                                        setNavigation('VIDEO');
                                    }}
                                    aria-hidden>
                                    VIDEO
                                </span>
                                {courseContent?.books.length !== 0 ? (
                                    <span
                                        className={`inline-block font-bold text-sm pb-[6px] cursor-pointer ${
                                            navigation === 'BOOK'
                                                ? 'border-b-2 border-accent-purple'
                                                : 'text-neutral-600 border-none hover:text-neutral-500'
                                        }`}
                                        onClick={() => {
                                            tracker?.genericTrack(
                                                'Click Book Tab - LMS',
                                                { 'Course Slug': id }
                                            );
                                            setNavigation('BOOK');
                                        }}
                                        aria-hidden>
                                        BUKU
                                    </span>
                                ) : (
                                    <></>
                                )}
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
                        {navigation === 'ON_SEARCH' && (
                            <SearchList
                                searchQuery={search}
                                searchResult={searchResult}
                                handleSearch={handleSearch}
                                isLoading={isSearchingLoading}
                                isFetching={isSearchingFetching}
                            />
                        )}
                        <div ref={anchor}></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetailBox;
