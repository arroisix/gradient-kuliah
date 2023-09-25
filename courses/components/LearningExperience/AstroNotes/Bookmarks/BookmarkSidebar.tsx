import Skeleton from 'commons/components/elements/Skeleton';
import { useGetBookmarksQuery } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import BookmarkItem from './BookmarkItem';

type BookmarkSidebarProps = {
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
};

const BookmarkSidebar = ({
    setNavigation
}: BookmarkSidebarProps): JSX.Element => {
    const [selected, setSelected] = useState<'HIGHLIGHT' | 'BOOKMARK'>(
        'BOOKMARK'
    );

    const router = useRouter();
    const { slug } = router.query;
    const { data: bookmarkData, isLoading: isLoadingBookmark } =
        useGetBookmarksQuery({ slug: slug as string }, { skip: !slug });

    return (
        <div className="w-60 bg-[#F6F5F8] dark:bg-[#121212] rounded-box text-black dark:text-white">
            <div className="flex justify-around px-3 py-2">
                <div className="flex items-center justify-center w-full gap-4">
                    <span
                        className={`inline-block font-body text-xs pb-[7px] cursor-pointer ${
                            selected === 'BOOKMARK' &&
                            'text-[#7264EB] dark:text-[#B6A6F3] border-b-2 border-[#7264EB] dark:border-[#C4B9FF]'
                        }`}
                        onClick={() => setSelected('BOOKMARK')}
                        aria-hidden>
                        BOOKMARK
                    </span>
                </div>
                <IoMdClose
                    size={18}
                    className="text-[#333333] hover:text-black dark:hover:text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh_-_10rem)] py-4 px-3 flex flex-col gap-2">
                {selected === 'BOOKMARK' && isLoadingBookmark ? (
                    <Skeleton repeat={4} className="h-4 mb-0" />
                ) : (
                    bookmarkData?.data?.map((value, index) => (
                        <BookmarkItem key={index} data={value} />
                    ))
                )}
            </div>
        </div>
    );
};

export default BookmarkSidebar;
