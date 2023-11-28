import Accordion from 'commons/components/elements/Accordion';
import Skeleton from 'commons/components/elements/Skeleton';
import { useState } from 'react';
import { IoIosSearch, IoMdClose } from 'react-icons/io';
import {
    useGetCourseContentQuery,
    useLazyGetSearchCourseContentQuery
} from 'courses/redux/api/courseApi';
import SearchList from '../../CourseDetailBox/SearchList';
import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';
import SylabbusContent from './SylabbusContent';
import ListBooks from 'courses/components/CourseDetailBox/ListBooks';

const Sylabbus = ({ slug }: GradientBaseComponentWithSlug): JSX.Element => {
    const { data: courseContent, isLoading: isLoadingCourse } =
        useGetCourseContentQuery({
            slug: slug as string
        });
    const [
        triggerSearch,
        {
            data: searchResult,
            isLoading: isSearchingLoading,
            isFetching: isSearchingFetching
        }
    ] = useLazyGetSearchCourseContentQuery();

    const router = useRouter();
    const { id } = router.query;
    const [isSearch, setIsSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [navigation, setNavigation] = useState<
        'VIDEO' | 'BOOK' | 'EXAM' | 'ON_SEARCH'
    >('VIDEO');
    const tracker = useTracker();

    function handleSearch({
        type,
        page = 1
    }: {
        type?: 'BOOK' | 'CHAPTER' | 'SUBCHAPTER';
        page?: number;
    }): void {
        setNavigation('ON_SEARCH');
        triggerSearch({
            slug: id as string,
            content: search,
            type,
            page
        });
    }

    function keyDown(): void {
        setIsSearch(true);
        handleSearch({});
        tracker?.genericTrack('Search Class Material', {
            'Course Slug': slug,
            Query: search
        });
    }

    return (
        <div className="flex flex-col w-screen px-5 lg:w-5/12">
            <div className="flex items-center px-4 bg-[#212121] rounded-lg">
                <input
                    className="w-full px-0 bg-transparent border-none font-body text-sm md:text-base focus:outline-none focus:ring-0 focus:appearance-none placeholder:text-[#666666]"
                    type="text"
                    value={search}
                    name="search"
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => {
                        event.key === 'Enter' ? keyDown() : null;
                    }}
                    placeholder="Cari materi"
                />
                <IoIosSearch
                    size={20}
                    className="text-[#DADADA] cursor-pointer"
                    onClick={() => {
                        handleSearch({});
                        setIsSearch(true);
                    }}
                />
                {isSearch && (
                    <IoMdClose
                        size={16}
                        className="ml-2 text-white cursor-pointer"
                        onClick={() => {
                            setIsSearch(false);
                            setSearch('');
                            setNavigation('VIDEO');
                        }}
                    />
                )}
            </div>
            <div className="pt-[17px] md:pt-6 pb-[14px] md:pb-4">
                {!isSearch && (
                    <div className="flex">
                        <span
                            className={`inline-block w-full text-center text-sm pb-[6px] cursor-pointer ${
                                navigation === 'VIDEO'
                                    ? 'border-b-2 border-[#C4B9FF] font-extrabold text-[#C4B9FF]'
                                    : 'font-medium text-[#CCCCCC] border-b border-[#272727] hover:text-neutral-500'
                            }`}
                            onClick={() => {
                                tracker?.genericTrack('Click Video Tab');
                                setNavigation('VIDEO');
                            }}
                            aria-hidden>
                            VIDEO
                        </span>
                        {(courseContent?.books.length ?? 0) > 0 && (
                            <span
                                className={`inline-block w-full text-center text-sm pb-[6px] cursor-pointer ${
                                    navigation === 'BOOK'
                                        ? 'border-b-2 border-[#C4B9FF] font-extrabold text-[#C4B9FF]'
                                        : 'font-medium text-[#CCCCCC] border-b border-[#272727] hover:text-neutral-500'
                                }`}
                                onClick={() => {
                                    tracker?.genericTrack('Click Book Tab');
                                    setNavigation('BOOK');
                                }}
                                aria-hidden>
                                BUKU
                            </span>
                        )}
                    </div>
                )}
            </div>
            {navigation === 'VIDEO' && (
                <>
                    <Accordion
                        item={
                            courseContent?.chapters?.map((value) => ({
                                title: value.chapter_name,
                                jsxContent: (
                                    <SylabbusContent
                                        id={value.chapter_id}
                                        slug={slug}
                                    />
                                ),
                                onClick: () => {
                                    tracker?.genericTrack(
                                        'Click Chapter Accordion',
                                        {
                                            'Course Slug': id,
                                            'Chapter Name': value.chapter_name
                                        }
                                    );
                                }
                            })) ?? []
                        }
                    />
                    {isLoadingCourse && (
                        <div className="flex flex-col w-full gap-2">
                            <Skeleton className="h-14" repeat={5} />
                        </div>
                    )}
                </>
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
        </div>
    );
};

export default Sylabbus;
