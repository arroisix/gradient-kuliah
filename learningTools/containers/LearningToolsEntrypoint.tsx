import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Add this
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import LearningToolsHeader from '../components/LearningToolsHeader';
import LearningToolsContent from '../components/LearningToolsContent';
import {
    useGetLearningToolsQuery,
    useGetLearningToolsContentQuery
} from 'commons/redux/api/commonApi';
import Filter from 'commons/components/elements/Filter';

const LearningToolsEntrypoint = (): JSX.Element => {
    const router = useRouter();
    const { type = 'all', page: pageQuery = '1' } = router.query;

    const [selectedType, setSelectedType] = useState<
        'all' | 'quiz' | 'flashcard'
    >((type as 'all' | 'quiz' | 'flashcard') || 'all');
    const [currentPage, setCurrentPage] = useState(Number(pageQuery));
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        setCurrentPage(Number(pageQuery));
    }, [pageQuery]);

    const { data: toolsData } = useGetLearningToolsQuery();
    const { data: contentData, isLoading } = useGetLearningToolsContentQuery({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        type: selectedType
    });

    const filterOptions = [
        { value: 'all', label: 'Semua' },
        { value: 'quiz', label: 'Kuis' },
        { value: 'flashcard', label: 'Flashcard' }
    ];

    const handleTypeChange = (type: string) => {
        router.push(
            {
                query: {
                    ...router.query,
                    type,
                    page: 1
                }
            },
            undefined,
            { shallow: true }
        );
        setSelectedType(type as 'all' | 'quiz' | 'flashcard');
    };

    const handlePageChange = (page: number) => {
        router.push(
            {
                query: {
                    ...router.query,
                    page
                }
            },
            undefined,
            { shallow: true }
        );
    };

    return (
        <div className="w-full">
            <Breadcrumb className="w-full pb-5" />
            <LearningToolsHeader
                tools={toolsData?.learning_tools || []}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
            />
            <div className="flex items-center gap-4 my-4">
                <Filter
                    options={filterOptions}
                    defaultSelected={selectedType}
                    onChange={handleTypeChange}
                />
            </div>
            <LearningToolsContent
                isLoading={isLoading}
                content={contentData?.data || []}
                totalItems={contentData?.count_items || 0}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                limit={ITEMS_PER_PAGE}
            />
        </div>
    );
};

export default LearningToolsEntrypoint;
