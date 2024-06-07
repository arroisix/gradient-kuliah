import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import Spinner from 'commons/components/elements/Spinner';
import { useSearchSubchapter } from 'courses/hooks/useSearchSubchapter';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { useTracker } from 'tracker/tracker';
import ChapterDetail from './ChapterDetail';
import ListSubchapter from './ListSubchapter';
import { getBookBaseHref } from 'courses/utils';

const SearchList = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const [navigation, setNavigation] = useState<'SEARCH_LIST' | 'SUBCHAPTER'>(
        'SEARCH_LIST'
    );
    const [chapterDetail, setChapterDetail] = useState<CourseChapter>(
        {} as CourseChapter
    );
    const tracker = useTracker();
    const {
        searchResult,
        searchKeyword,
        isSearchingLoading,
        isSearchingFetching,
        handleSearch
    } = useSearchSubchapter();

    return (
        <>
            {isSearchingFetching && !isSearchingLoading && (
                <Spinner size="small" />
            )}
            {isSearchingLoading && <Skeleton className="h-[30px]" repeat={3} />}
            {!isSearchingLoading && navigation === 'SEARCH_LIST' && (
                <>
                    <div className="pb-6 border-b border-[#2D2D2D]">
                        <span className="inline-block font-extrabold text-sm pb-[18px]">
                            Video
                        </span>
                        <div className="flex flex-col gap-[10px]">
                            {searchResult?.subchapters.contents.length ===
                                0 && (
                                <span className="inline-block text-xs font-body">
                                    Video tidak ditemukan
                                </span>
                            )}
                            {searchResult?.subchapters?.contents?.map(
                                (value) => (
                                    <>
                                        <span className="inline-block text-xs font-extrabold text-neutral-400">
                                            {value.chapter}
                                        </span>
                                        <div className="flex flex-col gap-[14px]">
                                            {value.items.map((item) => (
                                                <ListSubchapter
                                                    key={item.id}
                                                    item={item}
                                                    onClick={() => {
                                                        tracker?.genericTrack(
                                                            'Click Video Section Search Result',
                                                            {
                                                                Query: searchKeyword,
                                                                'Course Slug':
                                                                    id,
                                                                'Video Title':
                                                                    item.subchapter_name
                                                            }
                                                        );
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )
                            )}
                        </div>
                        {searchResult?.subchapters.next_page && (
                            <div className="flex justify-center">
                                <Button
                                    onClick={() =>
                                        handleSearch({
                                            type: 'SUBCHAPTER',
                                            page: searchResult?.subchapters
                                                .next_page as number
                                        })
                                    }
                                    variant="custom"
                                    className="mt-6 mx-auto font-bold text-xs bg-[#272727] rounded-[70px]">
                                    Muat lebih
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="pb-6 border-b border-[#2D2D2D]">
                        <span className="inline-block font-extrabold text-sm py-[18px]">
                            Buku
                        </span>
                        <div className="flex flex-col gap-[14px]">
                            {searchResult?.books.contents.length === 0 && (
                                <span className="inline-block text-xs font-body">
                                    Buku tidak ditemukan
                                </span>
                            )}
                            {searchResult?.books.contents.map((value) => (
                                <div
                                    key={value.book_id}
                                    className="flex items-center gap-5 cursor-pointer"
                                    onClick={() => {
                                        tracker?.genericTrack(
                                            'Click Book Section Search Result',
                                            {
                                                Query: searchKeyword,
                                                'Course Slug': id,
                                                'Book Title': value.title
                                            }
                                        );
                                        router.push(
                                            `${getBookBaseHref(
                                                value.category
                                            )}/${value.slug}/1`
                                        );
                                    }}
                                    aria-hidden>
                                    <Image
                                        src={
                                            value.book_cover_url ??
                                            'https://assets.gradient.academy/assets/astronotes-kalkulus2-placeholder.jpg'
                                        }
                                        width={79}
                                        height={113}
                                        className="object-contain rounded"
                                    />
                                    <div className="flex flex-col gap-[6px]">
                                        <span className="inline-block text-lg font-body text-neutral-200">
                                            {value.title}
                                        </span>
                                        <div>
                                            <span className="inline-block text-base font-body text-neutral-600">
                                                {`oleh ${value.authors}`}
                                            </span>
                                            <span className="flex items-center gap-[2px] font-body text-xs text-neutral-600">
                                                {value.rating !== 0 && (
                                                    <>
                                                        <AiFillStar />
                                                        {
                                                            +value.rating.toFixed(
                                                                1
                                                            )
                                                        }
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {searchResult?.books.next_page && (
                            <div className="flex justify-center">
                                <Button
                                    onClick={() =>
                                        handleSearch({
                                            type: 'BOOK',
                                            page: searchResult?.books
                                                .next_page as number
                                        })
                                    }
                                    variant="custom"
                                    className="mt-6 mx-auto font-bold text-xs bg-[#272727] rounded-[70px]">
                                    Muat lebih
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="py-[18px]">
                        <span className="inline-block font-extrabold text-sm pb-[18px]">
                            Bab
                        </span>
                        <div className="flex flex-col gap-[14px]">
                            {searchResult?.chapters.contents.length === 0 && (
                                <span className="inline-block text-xs font-body">
                                    Bab tidak ditemukan
                                </span>
                            )}
                            {searchResult?.chapters.contents.map((value) => (
                                <div
                                    key={value.chapter_id}
                                    className="bg-[#1D1D1D] hover:bg-[#272727] rounded"
                                    onClick={() => {
                                        tracker?.genericTrack(
                                            'Click Chapter Section Search Result',
                                            {
                                                Query: searchKeyword,
                                                'Course Slug': id,
                                                'Chapter Title':
                                                    value.chapter_name
                                            }
                                        );
                                        setChapterDetail(value);
                                        setNavigation('SUBCHAPTER');
                                    }}
                                    aria-hidden>
                                    <div
                                        className={`flex justify-between gap-2 p-3 cursor-pointer`}
                                        onClick={() => null}
                                        aria-hidden>
                                        <div className="w-[85%] flex items-center gap-2">
                                            <span className="inline-block overflow-hidden text-sm font-extrabold whitespace-nowrap text-ellipsis">
                                                {value.chapter_name}
                                            </span>
                                        </div>
                                        <HiOutlineChevronDown
                                            size={18}
                                            className={`w-[18px] h-[18px] text-white rotate-[-90deg] transition-all`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {searchResult?.chapters.next_page && (
                            <div className="flex justify-center">
                                <Button
                                    onClick={() =>
                                        handleSearch({
                                            type: 'CHAPTER',
                                            page: searchResult?.chapters
                                                .next_page as number
                                        })
                                    }
                                    variant="custom"
                                    className="mt-6 mx-auto font-bold text-xs bg-[#272727] rounded-[70px]">
                                    Muat lebih
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}
            {navigation === 'SUBCHAPTER' && (
                <ChapterDetail
                    chapterDetail={chapterDetail}
                    setNavigation={setNavigation}
                />
            )}
        </>
    );
};

export default SearchList;
