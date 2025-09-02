import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useGetContentRecommendationQuery } from 'copilot/redux/api/copilotApi';
import { ContextRecommendation } from 'copilot/types/copilot';
import ProductCard from 'commons/components/elements/ProductCard';
import Paginator from 'commons/components/elements/Paginator';
import Skeleton from 'commons/components/elements/Skeleton';
import NotFound from 'commons/components/elements/Icons/NotFound';

const VALID_TABS = ['semua', 'kelas', 'perpustakaan'];

type ReferenceQueryParams = {
    tab?: string;
    p?: string;
};

interface ReferenceRecommendationListProps {
    search?: string;
    defaultQuery: string;
    onReferenceCardClick?: (recommendation: ContextRecommendation) => void;
}

const ReferenceRecommendationList = ({
    search,
    defaultQuery,
    onReferenceCardClick
}: ReferenceRecommendationListProps): JSX.Element => {
    const router = useRouter();
    const { tab, p } = router.query as ReferenceQueryParams;
    const itemsPerPage = 6;
    const [isMobile, setIsMobile] = useState(false);

    const prevSearchRef = useRef(search);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (search !== prevSearchRef.current) {
            prevSearchRef.current = search;
            router.push({ query: { ...router.query, p: '1' } }, undefined, {
                shallow: true
            });
        }
    }, [search, router]);

    const getContentType = (currentTab?: string) => {
        if (currentTab === 'kelas') return 'course';
        if (currentTab === 'perpustakaan') return 'book';
        return undefined;
    };

    const queryToUse = search || defaultQuery;
    const isSearchMode = Boolean(search);

    const {
        data: recommendations,
        isLoading,
        isFetching,
        error
    } = useGetContentRecommendationQuery(
        {
            q: queryToUse,
            page: parseInt(p ?? '1'),
            per_page: itemsPerPage,
            content_type: getContentType(
                VALID_TABS.includes(tab ?? '') ? tab : 'semua'
            ),
            is_search: isSearchMode
        },
        {
            skip: !queryToUse
        }
    );

    const getProduct = (recommendation: ContextRecommendation): Product => {
        const getTitle = () => {
            if (recommendation.type === 'course') {
                return recommendation.course_name || 'Video Content';
            }
            return recommendation.book_name || 'Book Content';
        };

        const getThumbnail = () => {
            return recommendation.thumbnail || '';
        };

        return {
            title: getTitle(),
            thumbnail: getThumbnail(),
            inProgress: false,
            latestProgress: 0
        };
    };

    const getCategory = (recommendation: ContextRecommendation): string => {
        switch (recommendation.type) {
            case 'course':
                return 'Kelas';
            case 'astronotes_content':
                return 'Catatan';
            case 'textbook_problem':
                return 'Textbook';
            case 'bank_soal_problem':
                return 'BankSoal';
            default:
                return 'Content';
        }
    };

    const handleCardClick = (recommendation: ContextRecommendation) => {
        onReferenceCardClick?.(recommendation);
    };

    const getOrientation = (category: string): 'horizontal' | 'vertical' => {
        if (!isMobile) return 'vertical';
        return category === 'Kelas' ? 'vertical' : 'horizontal';
    };

    const totalPages = Math.ceil(
        (recommendations?.count_items ?? 0) / itemsPerPage
    );

    if (isLoading || isFetching) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Skeleton repeat={6} className="w-full h-56 !mb-0" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-red-400">Gagal memberikan rekomendasi</p>
            </div>
        );
    }

    if (
        !recommendations?.recommendation ||
        recommendations.recommendation.length === 0
    ) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <NotFound className="w-48 h-48 mx-auto my-8" />
                    <p className="text-white/60 mb-2">
                        {isSearchMode
                            ? 'Tidak ada hasil pencarian yang ditemukan'
                            : 'Tidak ada rekomendasi yang ditemukan'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8 items-stretch">
                {recommendations.recommendation.map((recommendation, index) => {
                    const product = getProduct(recommendation);
                    const category = getCategory(recommendation);
                    const orientation = getOrientation(category);

                    return (
                        <button
                            key={`${recommendation.type}-${
                                recommendation.course_slug ||
                                recommendation.book_slug
                            }-${index}`}
                            onClick={() => handleCardClick(recommendation)}
                            className="cursor-pointer w-full text-left"
                            type="button">
                            <ProductCard
                                heading="h2"
                                orientation={orientation}
                                category={category}
                                eventName="Click Reference Card"
                                href="#"
                                product={product}
                                isReference={true}
                            />
                        </button>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <Paginator
                    totalPages={totalPages}
                    hasNextPage={!!recommendations?.next_page}
                    hasPreviousPage={!!recommendations?.previous_page}
                    className="justify-center w-full pb-2"
                    pageParamName="p"
                />
            )}
        </>
    );
};

export default ReferenceRecommendationList;
