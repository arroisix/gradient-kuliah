import Accordion from 'commons/components/elements/Accordion';
import Skeleton from 'commons/components/elements/Skeleton';
import { useState } from 'react';
import { IoIosSearch, IoMdClose } from 'react-icons/io';
import { useGetCourseContentQuery } from 'courses/redux/api/courseApi';
import SearchList from '../../CourseDetailBox/SearchList';
import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';
import SylabbusContent from './SylabbusContent';
import ListBooks from 'courses/components/CourseDetailBox/ListBooks';
import { useSearchSubchapter } from 'courses/hooks/useSearchSubchapter';

const Sylabbus = ({ slug }: GradientBaseComponentWithSlug): JSX.Element => {
    const { data: courseContent, isLoading: isLoadingCourse } =
        useGetCourseContentQuery({
            slug: slug as string
        });
    const { handleSearch } = useSearchSubchapter();

    const router = useRouter();
    const { id } = router.query;
    const [isSearch, setIsSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [navigation, setNavigation] = useState<
        'VIDEO' | 'BOOK' | 'EXAM' | 'ON_SEARCH'
    >('VIDEO');
    const tracker = useTracker();

    const onSubmitSearch: UseSearchSubchapter['handleSearch'] = (params) => {
        handleSearch(params);
        setNavigation('ON_SEARCH');
    };

    function keyDown(): void {
        setIsSearch(true);
        onSubmitSearch({});
        tracker?.genericTrack('Search Class Material', {
            'Course Slug': slug,
            Query: search
        });
    }

    const onChangeTracker = (tab: string): void => {
        tracker?.genericTrack(`Click ${tab} Tab`);
    };

    // Add this to handle tab switching with state
    const handleTabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tabValue = e.target.value;
        onChangeTracker(tabValue);

        if (tabValue === 'video') {
            setNavigation('VIDEO');
        } else if (tabValue === 'book') {
            setNavigation('BOOK');
        }
    };

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
                        onSubmitSearch({});
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
            <div
                role="tablist"
                className="flex flex-wrap pt-4 pb-4 tabs tabs-bordered md:pt-6">
                {!isSearch && (
                    <>
                        {/* Video Tab */}
                        <div className="flex w-full tabs-header">
                            <label
                                className={`tab border-b-2 ${
                                    navigation === 'VIDEO'
                                        ? 'border-b-graphite-100'
                                        : 'border-b-graphite-700'
                                } has-[:checked]:font-bold flex-1 text-center text-sm pb-3 uppercase`}>
                                <input
                                    role="tab"
                                    type="radio"
                                    name="course-details-tab"
                                    value="video"
                                    className="hidden"
                                    defaultChecked
                                    onChange={(e) => handleTabChange(e)}
                                    id="tab-video"
                                />
                                <h2>Video</h2>
                            </label>
                            {(courseContent?.books.length ?? 0) > 0 && (
                                <label
                                    className={`tab border-b-2 ${
                                        navigation === 'BOOK'
                                            ? 'border-b-graphite-100'
                                            : 'border-b-graphite-700'
                                    } has-[:checked]:font-bold flex-1 text-center text-sm pb-3 uppercase`}>
                                    <input
                                        role="tab"
                                        type="radio"
                                        name="course-details-tab"
                                        value="book"
                                        className="hidden"
                                        onChange={(e) => handleTabChange(e)}
                                        id="tab-book"
                                    />
                                    <h2>Buku</h2>
                                </label>
                            )}
                        </div>

                        {/* Tab Content */}
                        <div className="w-full">
                            {/* Video Content */}
                            <div
                                className="py-4 tab-content"
                                style={{
                                    display:
                                        navigation === 'VIDEO'
                                            ? 'block'
                                            : 'none'
                                }}>
                                <Accordion
                                    item={
                                        courseContent?.chapters?.map(
                                            (value) => ({
                                                title: value.chapter_name,
                                                isHeading: true,
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
                                                            'Chapter Name':
                                                                value.chapter_name
                                                        }
                                                    );
                                                }
                                            })
                                        ) ?? []
                                    }
                                />
                                {isLoadingCourse && (
                                    <div className="flex flex-col w-full gap-2">
                                        <Skeleton className="h-14" repeat={5} />
                                    </div>
                                )}
                            </div>

                            {/* Book Content */}
                            <div
                                className="py-4 tab-content"
                                style={{
                                    display:
                                        navigation === 'BOOK' ? 'block' : 'none'
                                }}>
                                <ListBooks
                                    books={courseContent?.books as Book[]}
                                    isLoading={isLoadingCourse}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            {navigation === 'ON_SEARCH' && <SearchList />}
        </div>
    );
};

export default Sylabbus;
