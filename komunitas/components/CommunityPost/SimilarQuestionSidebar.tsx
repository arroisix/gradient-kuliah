import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import { cn } from 'commons/utils';
import { useKomunitas } from 'komunitas/contexts/KomunitasProvider';
import {
    useGetExploreQuestionQuery,
    useGetPublicExploreQuestionQuery
} from 'komunitas/redux/api/komunitasApi';
import React from 'react';
import { useSelector } from 'react-redux';
import SimilarQuestion from './SimilarQuestion';

type SimilarQuestionSidebarProps = {
    category?: {
        id: string;
        name: string;
    };
} & PropsWithClassName;

const SimilarQuestionSidebar = ({
    category,
    className
}: SimilarQuestionSidebarProps): JSX.Element => {
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
                'relative w-screen md:w-full h-min bg-[#121212] ml-[-16px] mb-[-40px] md:m-0 px-4 pt-5 py-8 md:p-5 md:sticky md:top-20 md:rounded-lg',
                className
            )}>
            <h4 className="pb-5 font-extrabold">Pertanyaan Serupa</h4>
            <div className="flex flex-col gap-4 pb-8">
                {similiars ? (
                    similiars?.questions?.map((question) => (
                        <SimilarQuestion
                            key={question.id}
                            question={question}
                        />
                    ))
                ) : (
                    <Skeleton repeat={3} className="h-16 !mb-0" />
                )}
            </div>
            <Button
                variant="custom"
                className="w-full text-xs font-extrabold text-center bg-neutral-700"
                eventName='Click "Lihat di Komunitas" Button'
                href="/komunitas">
                Lihat di Komunitas
            </Button>
        </div>
    );
};

export default SimilarQuestionSidebar;
