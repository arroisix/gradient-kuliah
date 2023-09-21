import Skeleton from 'commons/components/elements/Skeleton';
import { useGetTableContentsQuery } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction } from 'react';
import { IoMdClose } from 'react-icons/io';
import ChapterContentItem from './ChapterContentItem';

type ListOfContentsSidebarProps = {
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
};

const ListOfContentsSidebar = ({
    setNavigation
}: ListOfContentsSidebarProps): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;
    const { data, isLoading } = useGetTableContentsQuery(
        { slug: slug as string },
        { skip: !slug }
    );

    return (
        <div className="relative w-[230px] h-[calc(100vh-88px)] bg-[#F6F5F8] dark:bg-[#121212] rounded-lg text-black dark:text-white">
            <div className="flex justify-between p-2 border-b border-[#c0c0c0] dark:border-[#2D2D2D]">
                <span className="inline-block font-body text-xs pt-[2px]">
                    Daftar Isi
                </span>
                <IoMdClose
                    size={18}
                    className="text-[#333333] hover:text-black dark:hover:text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="h-[calc(100vh-126px)] overflow-y-auto px-2 py-[10px] flex flex-col gap-2">
                {isLoading && (
                    <Skeleton repeat={4} className="h-[20px] p-0 mb-0" />
                )}
                {data?.data?.map((value) => (
                    <ChapterContentItem key={value.id} value={value} />
                ))}
            </div>
        </div>
    );
};

export default ListOfContentsSidebar;
