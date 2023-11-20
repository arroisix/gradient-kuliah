import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import { cn } from 'commons/utils';
import { useKomunitas } from 'komunitas/contexts/KomunitasProvider';
import {
    useGetExploreQuestionQuery,
    useGetPublicExploreQuestionQuery
} from 'komunitas/redux/api/komunitasApi';
import Link from 'next/link';
import React from 'react';
import { MdChevronRight } from 'react-icons/md';
import { useSelector } from 'react-redux';

type RightSidebarProps = {
    category?: {
        id: string;
        name: string;
    };
} & PropsWithClassName;

const RightSidebar = ({
    category,
    className
}: RightSidebarProps): JSX.Element => {
    const { detailQuestion } = useKomunitas();

    const isAuthenticated = useSelector(getIsAuthenticated);
    const privateExploreQuestionResult = useGetExploreQuestionQuery(
        {
            category_id: category?.id,
            current_post: detailQuestion?.id
        },
        { skip: !isAuthenticated || !category?.id || !detailQuestion?.id }
    );
    const publicExploreQuestionResult = useGetPublicExploreQuestionQuery(
        {
            category_id: category?.id,
            current_post: detailQuestion?.id
        },
        { skip: isAuthenticated || !category?.id || !detailQuestion?.id }
    );
    const { data: similiars } = isAuthenticated
        ? privateExploreQuestionResult
        : publicExploreQuestionResult;

    return (
        <div
            className={cn(
                'relative w-screen md:w-full h-[350px] bg-[#121212] ml-[-16px] mb-[-40px] md:m-0 px-[18px] py-5 md:rounded-lg overflow-hidden',
                className
            )}>
            <h4 className="font-extrabold pb-[20px]">Pertanyaan Serupa</h4>
            <div className="flex flex-col gap-2 px-[10px] py-[10px] bg-[#1D1D1D] rounded">
                {similiars ? (
                    similiars?.questions?.map(({ slug, content }) => (
                        <Link
                            key={slug}
                            href={`/komunitas/${encodeURIComponent(slug)}`}>
                            <div className="flex justify-between items-center gap-2 py-1 cursor-pointer z-[1]">
                                <span className="overflow-hidden text-xs whitespace-nowrap text-ellipsis">
                                    {content}
                                </span>
                                <div>
                                    <MdChevronRight
                                        className="text-neutral-600"
                                        size={18}
                                    />
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <Skeleton repeat={3} className="h-3 !mb-0" />
                )}
            </div>
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-[#121212] to-[#121212] z-[1]"></div>
                <div className="absolute bottom-0 left-0 w-full px-[18px] z-[1]">
                    <Button
                        variant="custom"
                        className="w-full text-xs font-extrabold text-center bg-neutral-800"
                        eventName='Click "Lihat di Komunitas" Button'
                        href="/komunitas">
                        Lihat di Komunitas
                    </Button>
                    <div className="w-full h-[48px] md:h-[20px] bg-[#121212]"></div>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;
