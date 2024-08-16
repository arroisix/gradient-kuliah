import ProductCard from 'commons/components/elements/ProductCard';
import { useRouter } from 'next/router';
import React from 'react';
import PopularProducts from '../SearchLanding/PopularProducts';
import Skeleton from 'commons/components/elements/Skeleton';

const CourseResults = ({
    result,
    isLoading
}: SearchResultsProps): JSX.Element => {
    const router = useRouter();
    const { type } = router.query as { type: string };

    if (!type || type == 'all') return <></>;

    if (isLoading)
        return (
            <PopularProducts title="Kelas Terkait" className="mt-2 mb-4">
                <Skeleton className="carousel-item h-52 w-80" repeat={5} />
            </PopularProducts>
        );

    if (!result || !result.found) return <></>;

    return (
        <PopularProducts title="Kelas Terkait" className="mt-2 mb-4">
            {result.hits?.map((hit) => {
                const doc = hit.document;

                return (
                    <ProductCard
                        key={doc.id}
                        orientation="vertical"
                        category="kelas"
                        eventName=""
                        href={`/kelas/${doc.course_slug}`}
                        className="carousel-item w-80"
                        product={{
                            thumbnail: doc.thumbnail,
                            title: doc.course_name,
                            inProgress: false,
                            latestProgress: 0
                        }}
                    />
                );
            })}
        </PopularProducts>
    );
};

export default CourseResults;
