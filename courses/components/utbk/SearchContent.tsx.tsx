import { useSearchSubchapter } from 'courses/hooks/useSearchSubchapter';
import Button from 'commons/components/elements/Button';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import { ChapterAccordion } from './ChapterAccordion';

function SearchEmpty() {
    return (
        <div className="w-full max-w-xs mx-auto">
            <div className="mb-6 w-fit h-fit mx-auto">
                <Image
                    src={`${CDN_URL}/assets/utbk/materi_not_found.png`}
                    alt="Materi Not Found"
                    width={160}
                    height={160}
                />
            </div>

            <h2 className="text-white text-center font-semibold mb-2">
                Materi Tidak Ditemukan
            </h2>
            <p className="text-[#999999] text-center text-sm">
                Coba gunakan kata kunci lain atau cari topik yang lebih umum.
            </p>
        </div>
    );
}

function SearchContent() {
    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const {
        searchResult,
        isSearchingLoading,
        isSearchingFetching,
        handleSearch
    } = useSearchSubchapter();

    return (
        <div className="mt-6">
            <div className="space-y-4">
                {isSearchingLoading || isSearchingFetching ? (
                    <div className="animate-pulse space-y-2 mt-6">
                        <div className="bg-[#333333] h-[72px] w-full rounded-lg"></div>
                        <div className="bg-[#333333] h-[72px] w-full rounded-lg"></div>
                        <div className="bg-[#333333] h-[72px] w-full rounded-lg"></div>
                    </div>
                ) : (searchResult?.subchapters.contents.length ?? 0) > 0 ? (
                    searchResult?.subchapters?.contents?.map((value) => (
                        <ChapterAccordion
                            key={value.chapter}
                            title={`${value.chapter} (${searchResult.subchapters.contents.length})`}
                            chapter_slug={value.chapter} // TODO: change with chapter_slug
                            toggleable={false}
                            initialOpen={true}
                            subchapterSearch={value.items as any}
                        />
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

export default SearchContent;
