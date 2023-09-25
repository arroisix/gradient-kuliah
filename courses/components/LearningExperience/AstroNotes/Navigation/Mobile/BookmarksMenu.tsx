import Skeleton from 'commons/components/elements/Skeleton';
import { useGetBookmarksQuery } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import BookmarkItem from '../../Bookmarks/BookmarkItem';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';

const BookmarksMenu = (): JSX.Element => {
    const { setNavigation } = useAstronotes();
    const [selected, setSelected] = useState<'HIGHLIGHT' | 'BOOKMARK'>(
        'BOOKMARK'
    );

    const router = useRouter();
    const { slug } = router.query;
    const { data: bookmarkData, isLoading: isLoadingBookmark } =
        useGetBookmarksQuery({ slug: slug as string }, { skip: !slug });

    return (
        <div className="absolute left-[-20px] bottom-[-24px] w-screen h-[calc(100vh-200px)] bg-[#F6F5F8] dark:bg-[#1D1D1D] z-10">
            <div className="flex justify-between p-5">
                <div className="flex gap-8">
                    <span
                        className={`inline-block font-extrabold text-base pb-[6px] cursor-pointer ${
                            selected === 'HIGHLIGHT' &&
                            'text-[#B6A6F3] border-b-2 border-[#C4B9FF]'
                        }`}
                        onClick={() => setSelected('HIGHLIGHT')}
                        aria-hidden>
                        Highlight
                    </span>
                    <span
                        className={`inline-block font-extrabold text-base pb-[6px] cursor-pointer ${
                            selected === 'BOOKMARK' &&
                            'text-[#B6A6F3] border-b-2 border-[#C4B9FF]'
                        }`}
                        onClick={() => setSelected('BOOKMARK')}
                        aria-hidden>
                        Bookmark
                    </span>
                </div>
                <MdClose
                    size={24}
                    className="text-black cursor-pointer dark:text-white"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="h-[calc(100vh-272px)] overflow-y-auto px-5 py-3 flex flex-col gap-2">
                {selected === 'BOOKMARK' && isLoadingBookmark ? (
                    <Skeleton repeat={4} className="h-5" />
                ) : (
                    bookmarkData?.data?.map((value, index) => (
                        <BookmarkItem key={index} data={value} />
                    ))
                )}
            </div>
        </div>
    );
};

export default BookmarksMenu;
