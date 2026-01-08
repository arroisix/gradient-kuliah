import { useSearchSubchapter } from 'courses/hooks/useSearchSubchapter';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { IoIosSearch } from 'react-icons/io';

function SearchMateri(): JSX.Element {
    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const { searchKeyword, setSearchKeyword, handleSearch } =
        useSearchSubchapter();

    useEffect(() => {
        if (searchKeyword) {
            handleSearch({});
        }
    }, [handleSearch, searchKeyword, slug_subtest]);

    return (
        <div className="bg-[#2C2C2C] flex items-center gap-2 py-2 px-3 rounded-full mt-4">
            <IoIosSearch className="text-[#DADADA] w-5 h-5" />
            <input
                className="bg-transparent text-[#DADADA] placeholder:text-[#666666] text-sm w-full border-none focus:outline-none focus:ring-0 focus:appearance-none p-0"
                type="text"
                name="search"
                placeholder="Cari materi..."
                autoComplete="off"
                onChange={(event) => setSearchKeyword(event.target.value)}
            />
        </div>
    );
}

export { SearchMateri };
