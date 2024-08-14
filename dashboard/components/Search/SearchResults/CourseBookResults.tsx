import ProductCard from 'commons/components/elements/ProductCard';
import { getBookBaseHref } from 'courses/utils';
import { useRouter } from 'next/router';
import React from 'react';
import PopularProducts from '../SearchLanding/PopularProducts';
import Skeleton from 'commons/components/elements/Skeleton';

const CourseBookResults = ({
    result,
    isLoading,
    title
}: SearchResultsProps & { title: string }): JSX.Element => {
    const router = useRouter();
    const { type } = router.query as { type: string };

    if (!type || type == 'all') return <></>;

    if (isLoading)
        return (
            <PopularProducts title={title} className="mt-2 mb-4">
                <Skeleton className="h-64 carousel-item w-60" repeat={5} />
            </PopularProducts>
        );

    if (!result || !result.found) return <></>;

    return (
        <PopularProducts title={title} className="mt-2 mb-4">
            {result.hits?.map((hit) => {
                const doc = hit.document;
                return (
                    <ProductCard
                        key={doc.id}
                        orientation="vertical"
                        category={
                            doc.type === 'bank_soal_problem'
                                ? 'Bank Soal'
                                : 'Textbook Solution'
                        }
                        eventName=""
                        href={`${getBookBaseHref(doc.book_category)}${
                            doc.book_slug
                        }`}
                        className="carousel-item w-60"
                        product={{
                            thumbnail: doc.thumbnail,
                            title: doc.book_name,
                            rating: doc.book_rating,
                            inProgress: false,
                            latestProgress: 0
                        }}
                    />
                );
            })}
        </PopularProducts>
    );
};

export default CourseBookResults;
