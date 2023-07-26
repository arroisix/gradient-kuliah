import Accordion from 'commons/components/elements/Accordion';
import GreenCheck from 'commons/components/elements/Icons/GreenCheck';
import Play from 'commons/components/elements/Icons/Play';
import Skeleton from 'commons/components/elements/Skeleton';
import Link from 'next/link';
import { useState } from 'react';
import { IoIosSearch, IoMdClose } from 'react-icons/io';
import { ListBooks } from '../CourseDetailBox';
import {
    useGetCourseContentQuery,
    useGetSubchapterQuery,
    useLazyGetSearchCourseContentQuery
} from 'courses/redux/api/courseApi';
import SearchList from '../CourseDetailBox/SearchList';
import { useRouter } from 'next/router';

const SylabbusContent = ({
    id,
    slug
}: GradientBaseComponentWithId & { slug: string }): JSX.Element => {
    const { data: subchapters, isLoading } = useGetSubchapterQuery(
        {
            chapterId: id
        },
        {
            selectFromResult: ({ data, isLoading }) => ({
                data: data?.subchapters.filter(({ type }) => type === 'video'),
                isLoading: isLoading
            })
        }
    );

    return (
        <div className="flex flex-col gap-2">
            {isLoading && (
                <>
                    <div className='flex items-center gap-4 w-full relative"'>
                        <Skeleton className="h-[98px] w-[240px]" />
                        <div className="w-full">
                            <Skeleton className="h-4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                    <div className='flex items-center gap-4 w-full relative"'>
                        <Skeleton className="h-[98px] w-[240px]" />
                        <div className="w-full">
                            <Skeleton className="h-4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                    <div className='flex items-center gap-4 w-full relative"'>
                        <Skeleton className="h-[98px] w-[240px]" />
                        <div className="w-full">
                            <Skeleton className="h-4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                    <div className='flex items-center gap-4 w-full relative"'>
                        <Skeleton className="h-[98px] w-[240px]" />
                        <div className="w-full">
                            <Skeleton className="h-4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                </>
            )}
            {subchapters?.map((subchapter: SubChapter) => (
                <Link
                    key={subchapter.id}
                    href={`/kelas/${slug}/belajar/video/${id}/${subchapter.id}`}>
                    <button className="flex items-center gap-4 w-full relative">
                        <div className="h-[98px] min-w-[163px]">
                            <img
                                src={subchapter.thumbnail}
                                className="h-[98px] w-[163px] overflow-hidden rounded-lg object-cover"
                                alt="Video Thumbnail"
                            />
                        </div>
                        <div>
                            {subchapter.is_finished ? <GreenCheck /> : <Play />}
                        </div>
                        <div className="flex flex-col text-left">
                            <p className="text-lg text-neutral-200">
                                {subchapter.subchapter_name}
                            </p>
                            <p className="text-lg text-neutral-600">
                                {subchapter.duration}
                            </p>
                        </div>
                        <span className="sr-only">
                            {`/kelas/${slug}/belajar/video/${id}/${subchapter.id}`}
                        </span>
                    </button>
                </Link>
            ))}
        </div>
    );
};

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
    }

    return (
        <div className="px-5 w-screen flex flex-col lg:w-5/12">
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
                        className="text-white cursor-pointer ml-2"
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
                            onClick={() => setNavigation('VIDEO')}
                            aria-hidden>
                            VIDEO
                        </span>
                        <span
                            className={`inline-block w-full text-center text-sm pb-[6px] cursor-pointer ${
                                navigation === 'BOOK'
                                    ? 'border-b-2 border-[#C4B9FF] font-extrabold text-[#C4B9FF]'
                                    : 'font-medium text-[#CCCCCC] border-b border-[#272727] hover:text-neutral-500'
                            }`}
                            onClick={() => setNavigation('BOOK')}
                            aria-hidden>
                            BUKU
                        </span>
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
                                )
                            })) ?? []
                        }
                    />
                    {isLoadingCourse && (
                        <div className="flex flex-col gap-2 w-full">
                            <Skeleton className="h-14" />
                            <Skeleton className="h-14" />
                            <Skeleton className="h-14" />
                            <Skeleton className="h-14" />
                            <Skeleton className="h-14" />
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
