import Skeleton from 'commons/components/elements/Skeleton';
import { useGetTableContentsQuery } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction } from 'react';
import { MdClose } from 'react-icons/md';
import ChapterContentItem from '../../ListOfContents/ChapterContentItem';

type ListOfContentsMenuProps = {
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
};

const ListOfContentsMenu = ({
    setNavigation
}: ListOfContentsMenuProps): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;
    const { data, isLoading } = useGetTableContentsQuery(
        { slug: slug as string },
        { skip: !slug }
    );

    return (
        <div className="absolute left-[-20px] bottom-[-24px] w-screen h-[calc(100vh-200px)] bg-[#F6F5F8] dark:bg-[#1D1D1D] z-10">
            <div className="flex justify-between p-5">
                <span className="inline-block font-extrabold text-base pt-[2px]">
                    Daftar Isi
                </span>
                <MdClose
                    size={24}
                    className="text-black dark:text-white cursor-pointer"
                    onClick={() => setNavigation('CLOSE')}
                />
            </div>
            <div className="h-[calc(100vh-266px)] overflow-y-auto px-5 py-3 flex flex-col gap-2">
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

export default ListOfContentsMenu;
