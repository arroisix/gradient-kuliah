import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import Spinner from 'commons/components/elements/Spinner';
import { useGetSubchapterQuery } from 'courses/redux/api/courseApi';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { HiOutlineChevronDown, HiPlay } from 'react-icons/hi';

const ListSubchapter = ({
    item
}: {
    item:
        | {
              id: string;
              subchapter_name: string;
              order: string;
              duration: string;
              last_duration: string;
          }
        | SubChapter;
}): JSX.Element => {
    const router = useRouter();
    const { id, chapter } = router.query;
    const totalDuration = item?.duration
        ?.split(':')
        ?.reverse()
        ?.reduce((prev, curr, i) => +prev + +curr * +Math.pow(60, i), 0);

    return (
        <div
            key={item.id}
            className="flex justify-between px-3 py-[10px] cursor-pointer bg-[#1D1D1D] hover:bg-[#272727] rounded"
            onClick={() =>
                router.push(`/kelas/${id}/belajar/video/${chapter}/${item.id}`)
            }
            aria-hidden>
            <div className={`w-[80%] flex items-center gap-[10px]`}>
                <div className="w-[18px] h-[18px]">
                    <HiPlay size={18} className="text-[#FFFFFF33]" />
                </div>
                <span className="inline-block font-body text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.subchapter_name}
                </span>
            </div>
            <div className="flex gap-1 font-body text-xs">
                {item.duration && (
                    <span className="inline-block text-[#FFFFFF80]">
                        {moment
                            .utc((totalDuration as number) * 1000)
                            .format('mm:ss')}
                    </span>
                )}
            </div>
        </div>
    );
};

const ChapterDetail = ({
    chapterDetail,
    setNavigation
}: {
    chapterDetail: CourseChapter;
    setNavigation: Dispatch<SetStateAction<'SUBCHAPTER' | 'SEARCH_LIST'>>;
}): JSX.Element => {
    const { data, isLoading } = useGetSubchapterQuery(
        {
            chapterId: chapterDetail.chapter_id
        },
        { skip: !chapterDetail.chapter_id }
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <HiOutlineChevronDown
                    onClick={() => setNavigation('SEARCH_LIST')}
                    size={18}
                    className={`w-[18px] h-[18px] text-white rotate-90 cursor-pointer transition-all`}
                />
                <span className="inline-block font-extrabold text-sm">{`${chapterDetail.chapter_name} (${chapterDetail.subchapter_counts})`}</span>
            </div>
            {isLoading && (
                <div className="flex flex-col gap-2 p-2">
                    <Skeleton className="h-[30px] !m-0" />
                    <Skeleton className="h-[30px] !m-0" />
                    <Skeleton className="h-[30px] !m-0" />
                </div>
            )}
            {!isLoading && (
                <div className="flex flex-col gap-[14px] pb-[18px]">
                    {data?.subchapters.map((item) => (
                        <ListSubchapter key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

const SearchList = ({
    searchResult,
    handleSearch,
    isLoading,
    isFetching
}: {
    searchResult?: SearchCourseResponse;
    handleSearch: ({
        type,
        page
    }: {
        type?: 'BOOK' | 'CHAPTER' | 'SUBCHAPTER' | undefined;
        page?: number | undefined;
    }) => void;
    isLoading: boolean;
    isFetching: boolean;
}): JSX.Element => {
    const router = useRouter();
    const [navigation, setNavigation] = useState<'SEARCH_LIST' | 'SUBCHAPTER'>(
        'SEARCH_LIST'
    );
    const [chapterDetail, setChapterDetail] = useState<CourseChapter>(
        {} as CourseChapter
    );

    return (
        <>
            {isFetching && !isLoading && <Spinner size="small" />}
            {isLoading && (
                <>
                    <Skeleton className="h-[30px]" />
                    <Skeleton className="h-[30px]" />
                    <Skeleton className="h-[30px]" />
                </>
            )}
            {!isLoading && navigation === 'SEARCH_LIST' && (
                <>
                    <div className="pb-6 border-b border-[#2D2D2D]">
                        <span className="inline-block font-extrabold text-sm pb-[18px]">
                            Video
                        </span>
                        <div className="flex flex-col gap-[10px]">
                            {searchResult?.subchapters.contents.length ===
                                0 && (
                                <span className="inline-block font-body text-xs">
                                    Video tidak ditemukan
                                </span>
                            )}
                            {searchResult?.subchapters?.contents?.map(
                                (value) => (
                                    <>
                                        <span className="inline-block font-extrabold text-xs text-neutral-400">
                                            {value.chapter}
                                        </span>
                                        <div className="flex flex-col gap-[14px]">
                                            {value.items.map((item) => (
                                                <ListSubchapter
                                                    key={item.id}
                                                    item={item}
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
                                <span className="inline-block font-body text-xs">
                                    Buku tidak ditemukan
                                </span>
                            )}
                            {searchResult?.books.contents.map((value) => (
                                <div
                                    key={value.book_id}
                                    className="flex items-center gap-5 cursor-pointer"
                                    onClick={() =>
                                        router.push(
                                            `/astronotes/${value.slug}/1`
                                        )
                                    }
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
                                        <span className="inline-block font-body text-lg text-neutral-200">
                                            {value.title}
                                        </span>
                                        <div>
                                            <span className="inline-block font-body text-base text-neutral-600">
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
                                <span className="inline-block font-body text-xs">
                                    Bab tidak ditemukan
                                </span>
                            )}
                            {searchResult?.chapters.contents.map((value) => (
                                <div
                                    key={value.chapter_id}
                                    className="bg-[#1D1D1D] hover:bg-[#272727] rounded"
                                    onClick={() => {
                                        setChapterDetail(value);
                                        setNavigation('SUBCHAPTER');
                                    }}
                                    aria-hidden>
                                    <div
                                        className={`flex justify-between gap-2 p-3 cursor-pointer`}
                                        onClick={() => null}
                                        aria-hidden>
                                        <div className="w-[85%] flex items-center gap-2">
                                            <span className="inline-block font-extrabold text-sm whitespace-nowrap text-ellipsis overflow-hidden">
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
