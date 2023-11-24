import Skeleton from 'commons/components/elements/Skeleton';
import {
    useGetPublicTableContentsQuery,
    useGetTableContentsQuery
} from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React from 'react';
import { IoMdClose } from 'react-icons/io';
import ChapterContentItem from './ChapterContentItem';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';
import { useTracker } from 'tracker/tracker';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';

const ListOfContentsSidebar = (): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const { slug, page } = router.query;
    const isAuthenticated = useSelector(getIsAuthenticated);
    const privateQueryResult = useGetTableContentsQuery(
        { slug: slug as string },
        { skip: !isAuthenticated || !slug }
    );
    const publicQueryResult = useGetPublicTableContentsQuery(
        { slug: slug as string },
        { skip: isAuthenticated || !slug }
    );
    const { data, isLoading } = isAuthenticated
        ? privateQueryResult
        : publicQueryResult;
    const { setNavigation } = useAstronotes();

    return (
        <div className="w-60 h-full bg-[#F6F5F8] dark:bg-[#121212] rounded-box text-black dark:text-white">
            <div className="flex justify-between px-3 py-2">
                <span className="inline-block uppercase font-body text-sm pt-[2px]">
                    Daftar Isi
                </span>
                <IoMdClose
                    size={18}
                    className="text-[#333333] hover:text-black dark:hover:text-white cursor-pointer"
                    onClick={() => {
                        setNavigation('CLOSE');
                    }}
                />
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh_-_10rem)] py-4 px-3 flex flex-col gap-2">
                {isLoading && <Skeleton repeat={4} className="h-5 p-0 mb-0" />}
                {data?.data?.map((value) => (
                    <ChapterContentItem
                        key={value.id}
                        value={value}
                        onClick={(show) => {
                            if (show) {
                                tracker?.genericTrack(
                                    'Click Chapter List of Content',
                                    {
                                        'Book Slug': slug,
                                        'Book Page Query': page,
                                        'Chapter Name': value.title
                                    }
                                );
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ListOfContentsSidebar;
