import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useGetContentRecommendationQuery } from 'copilot/redux/api/copilotApi';
import { ContentRecommendation } from 'copilot/types/copilot';
import ProductCard from 'commons/components/elements/ProductCard';
import Paginator from 'commons/components/elements/Paginator';
import Skeleton from 'commons/components/elements/Skeleton';

const VALID_TABS = ['semua', 'kelas', 'perpustakaan'];

type ReferenceQueryParams = {
    tab?: string;
    page?: string;
};

interface ReferenceRecommendationListProps {
    search?: string;
    defaultQuery: string;
}

const ReferenceRecommendationList = ({
    search,
    defaultQuery
}: ReferenceRecommendationListProps): JSX.Element => {
    const router = useRouter();
    const { tab, page } = router.query as ReferenceQueryParams;
    const itemsPerPage = 6;

    const prevSearchRef = useRef(search);

    useEffect(() => {
        if (search !== prevSearchRef.current) {
            prevSearchRef.current = search;
            router.push({ query: { ...router.query, page: '1' } }, undefined, {
                shallow: true
            });
        }
    }, [search, router]);

    const getContentType = (currentTab?: string) => {
        if (currentTab === 'kelas') return 'course_video';
        if (currentTab === 'perpustakaan') return 'book';
        return undefined;
    };

    const queryToUse = search || defaultQuery;

    const {
        data: recommendations,
        isLoading,
        isFetching,
        error
    } = useGetContentRecommendationQuery({
        q: queryToUse,
        page: parseInt(page ?? '1'),
        per_page: itemsPerPage,
        content_type: getContentType(VALID_TABS.includes(tab ?? '') ? tab : 'semua')
    }, {
        skip: !queryToUse
    });

    const getProduct = (recommendation: ContentRecommendation): Product => {
        const getTitle = () => {
            if (recommendation.type === 'course_video') {
                return recommendation.subchapter_name || 'Video Content';
            } else if (recommendation.type === 'textbook_problem' || recommendation.type === 'astronotes_content') {
                return recommendation.book_name || 'Textbook Content';
            }
            return recommendation.problem_question || 'Question Content';
        };

        const getThumbnail = () => {
            return recommendation.thumbnail || '';
        };

        return {
            title: getTitle(),
            thumbnail: getThumbnail(),
            inProgress: false,
            latestProgress: 0,
            isComingSoon: false,
            isNew: false,
            isFree: true
        };
    };

    const getHref = (recommendation: ContentRecommendation): string => {
        if (recommendation.type === 'course_video' && recommendation.course_slug && recommendation.subchapter_slug) {
            return `/courses/${recommendation.course_slug}/${recommendation.subchapter_slug}`;
        } else if (recommendation.type === 'textbook_problem' && recommendation.book_slug) {
            const page = recommendation.book_page ? `?page=${recommendation.book_page}` : '';
            return `/library/${recommendation.book_slug}${page}`;
        } else if (recommendation.type === 'astronotes_content' && recommendation.course_slug && recommendation.subchapter_slug) {
            return `/courses/${recommendation.course_slug}/astronotes/${recommendation.subchapter_slug}`;
        } else if (recommendation.type === 'bank_soal_problem' && recommendation.problem_slug) {
            return `/exercises/${recommendation.problem_slug}`;
        }
        return '';
    };

    const getCategory = (recommendation: ContentRecommendation): string => {
        switch (recommendation.type) {
            case 'course_video':
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

    const totalPages = Math.ceil((recommendations?.count_items ?? 0) / itemsPerPage);

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

    if (!recommendations?.recommendation || recommendations.recommendation.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 26A12 12 0 1 0 14 2a12 12 0 0 0 0 24zM30 30l-6.35-6.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40" />
                        </svg>
                    </div>
                    <p className="text-white/60 mb-2">Tidak ada rekomendasi yang ditemukan</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pb-8">
                {recommendations.recommendation.map((recommendation, index) => (
                    <ProductCard
                        key={`${recommendation.type}-${recommendation.course_slug || recommendation.book_slug}-${index}`}
                        heading="h2"
                        orientation="vertical"
                        category={getCategory(recommendation)}
                        eventName="Click Reference Card"
                        href={getHref(recommendation)}
                        product={getProduct(recommendation)}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex-shrink-0 border-t border-white/10 p-6">
                    <Paginator
                        totalPages={totalPages}
                        hasNextPage={!!recommendations?.next_page}
                        hasPreviousPage={!!recommendations?.previous_page}
                        className="justify-center w-full"
                    />
                </div>
            )}
        </>
    );
};

export default ReferenceRecommendationList;