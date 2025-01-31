import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import LearningToolsHeader from '../components/LearningToolsHeader';
import LearningToolsContent from '../components/LearningToolsContent';
import Filter from 'commons/components/elements/Filter';
import Sort from 'commons/components/elements/Sort';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import {
    useGetLearningToolsContentQuery,
    useGetLearningToolsQuery,
    useGetPublicLearningToolsContentQuery,
    useGetPublicLearningToolsQuery
} from '../redux/api/learningToolsApi';

export const LEARNING_TOOLS_SORT_OPTIONS = [
    { value: 'latest', label: 'Terbaru' },
    { value: 'popularity', label: 'Paling Populer' },
    { value: 'trending', label: 'Trending' }
];

const LearningToolsEntrypoint = (): JSX.Element => {
    const router = useRouter();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const {
        type = 'all',
        sort = 'latest',
        page: pageQuery = '1'
    } = router.query;
    const { isMobileBreakpoints } = useWindowBreakpoints();

    const [selectedType, setSelectedType] = useState<
        'all' | 'quiz' | 'flashcard'
    >((type as 'all' | 'quiz' | 'flashcard') || 'all');
    const [currentPage, setCurrentPage] = useState(Number(pageQuery));
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        setCurrentPage(Number(pageQuery));
    }, [pageQuery]);

    const { data: publicToolsData, isLoading: isPublicToolsLoading } =
        useGetPublicLearningToolsQuery(undefined, { skip: isAuthenticated });
    const { data: publicContentData, isLoading: isPublicContentLoading } =
        useGetPublicLearningToolsContentQuery(
            {
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                type: selectedType,
                sort: sort as 'latest' | 'popularity' | 'trending'
            },
            { skip: isAuthenticated }
        );

    const { data: privateToolsData, isLoading: isPrivateToolsLoading } =
        useGetLearningToolsQuery(undefined, { skip: !isAuthenticated });
    const { data: privateContentData, isLoading: isPrivateContentLoading } =
        useGetLearningToolsContentQuery(
            {
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                type: selectedType,
                sort: sort as 'latest' | 'popularity' | 'trending'
            },
            { skip: !isAuthenticated }
        );

    const toolsData = isAuthenticated ? privateToolsData : publicToolsData;
    const contentData = isAuthenticated
        ? privateContentData
        : publicContentData;
    const isLoading = isAuthenticated
        ? isPrivateToolsLoading || isPrivateContentLoading
        : isPublicToolsLoading || isPublicContentLoading;

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
            <div className="flex gap-4 items-center my-4 w-full">
                <Filter
                    options={filterOptions}
                    defaultSelected={selectedType}
                    onChange={handleTypeChange}
                    fullWidth={isMobileBreakpoints}
                />
                <Sort
                    options={LEARNING_TOOLS_SORT_OPTIONS}
                    defaultSelected={sort as string}
                    fullWidth={isMobileBreakpoints}
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
