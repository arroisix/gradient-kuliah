import { useSearchSubchapter } from 'courses/hooks/useSearchSubchapter';
import ListSubchapter from '../CourseDetailBox/SearchList/ListSubchapter';
import Button from 'commons/components/elements/Button';
import { useTracker } from 'tracker/tracker';
import { useRouter } from 'next/router';

function SearchSkeleton() {
    return (
        <div className="animate-pulse mt-2">
            <div className="bg-[#333333] h-3 w-32 rounded-full mb-4"></div>
            <div className="space-y-3">
                <div className="bg-[#333333] h-9 w-full rounded-md"></div>
                <div className="bg-[#333333] h-9 w-full rounded-md"></div>
                <div className="bg-[#333333] h-9 w-full rounded-md"></div>
            </div>
        </div>
    );
}

function SearchEmpty() {
    return (
        <p className="text-xs font-body w-full text-center mt-2">
            Video tidak ditemukan
        </p>
    );
}

function SearchContent() {
    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const tracker = useTracker();

    const {
        searchResult,
        searchKeyword,
        isSearchingLoading,
        isSearchingFetching,
        handleSearch
    } = useSearchSubchapter();

    return (
        <div className="mt-6">
            <h3 className="text-neutral-400 font-extrabold text-sm mb-2">
                Video
            </h3>

            <div className="space-y-4">
                {isSearchingLoading || isSearchingFetching ? (
                    <SearchSkeleton />
                ) : (searchResult?.subchapters.contents.length ?? 0) > 0 ? (
                    searchResult?.subchapters?.contents?.map((value) => (
                        <div key={value.chapter}>
                            <span className="inline-block text-xs font-extrabold text-neutral-400 mb-4">
                                {value.chapter}
                            </span>
                            <div className="flex flex-col gap-3">
                                {value.items.map((item) => (
                                    <ListSubchapter
                                        key={item.id}
                                        item={item}
                                        onClick={() => {
                                            tracker?.genericTrack(
                                                'Click Video Section Search Result',
                                                {
                                                    Query: searchKeyword,
                                                    'Course Slug': slug_subtest,
                                                    'Video Title':
                                                        item.subchapter_name
                                                }
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <SearchEmpty />
                )}
            </div>

            {searchResult?.subchapters.next_page && (
                <div className="flex justify-center">
                    <Button
                        onClick={() =>
                            handleSearch({
                                type: 'SUBCHAPTER',
                                page: searchResult?.subchapters
                                    .next_page as number,
                                slug: slug_subtest
                            })
                        }
                        variant="custom"
                        className="mt-6 mx-auto font-bold text-xs bg-[#272727] rounded-[70px]">
                        Muat lebih
                    </Button>
                </div>
            )}
        </div>
    );
}

export { SearchContent };
