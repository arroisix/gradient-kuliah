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
        <div className="w-[230px] h-[calc(100vh-88px)] bg-[#F6F5F8] dark:bg-[#121212] rounded-lg text-black dark:text-white">
            <div className="flex justify-around pl-4 pr-2 pt-[10px] dark:border-b dark:border-[#2D2D2D]">
                <div className="flex gap-4 w-full items-center justify-center">
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
            <div className="h-[calc(100vh-126px)] overflow-y-auto px-2 py-[10px] flex flex-col gap-2">
                {selected === 'BOOKMARK' && isLoadingBookmark && (
                    <Skeleton repeat={4} className="h-[20px] p-0 mb-0" />
                )}
                {selected === 'BOOKMARK' &&
                    bookmarkData?.data?.map((value, index) => (
                        <BookmarkItem key={index} data={value} />
                    ))}
            </div>
        </div>
    );
};

export default BookmarkSidebar;
