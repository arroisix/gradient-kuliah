import Skeleton from 'commons/components/elements/Skeleton';
import {
    useGetPublicTableContentsQuery,
    useGetTableContentsQuery
} from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React from 'react';
import { MdClose } from 'react-icons/md';
import ChapterContentItem from '../../ListOfContents/ChapterContentItem';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

const ListOfContentsMenu = (): JSX.Element => {
    const { setNavigation } = useAstronotes();
    const router = useRouter();
    const { slug } = router.query;
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

    return (
        <dialog className="modal modal-bottom modal-open">
            <div className="modal-box p-0 bg-[#F6F5F8] dark:bg-[#1D1D1D]">
                <div className="flex justify-between px-5 pt-5 pb-3">
                    <span className="inline-block font-extrabold text-base pt-[2px]">
                        Daftar Isi
                    </span>
                    <MdClose
                        size={24}
                        className="btn btn-xs btn-circle btn-ghost"
                        onClick={() => setNavigation('CLOSE')}
                    />
                </div>
                <div className="h-[calc(100vh-16rem)] overflow-y-auto px-5 py-3 flex flex-col gap-2">
                    {isLoading && (
                        <Skeleton repeat={4} className="h-[20px] p-0 mb-0" />
                    )}
                    {data?.data?.map((value) => (
                        <ChapterContentItem key={value.id} value={value} />
                    ))}
                </div>
            </div>
        </dialog>
    );
};

export default ListOfContentsMenu;
