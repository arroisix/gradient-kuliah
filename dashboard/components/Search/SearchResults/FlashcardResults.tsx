import React from 'react';
import PopularProducts from '../SearchLanding/PopularProducts';
import Skeleton from 'commons/components/elements/Skeleton';
import FlashcardCard from '../../../../flashcard/components/Entrypoint/FlashcardCard';
import { useRouter } from 'next/router';

const FlashcardResults = ({
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
                if (
                    !doc.flashcard_slug ||
                    !doc.flashcard_title ||
                    doc.card_count === undefined
                ) {
                    return null;
                }
                return (
                    <FlashcardCard
                        key={doc.id}
                        slug={doc.flashcard_slug}
                        title={doc.flashcard_title}
                        totalCards={doc.card_count}
                        author={
                            doc.lecturers_or_authors?.[0]
                                ? {
                                      name: doc.lecturers_or_authors[0],
                                      photo_profile: doc.photo_profile || ''
                                  }
                                : undefined
                        }
                        className="carousel-item w-60"
                        cardType="allFlashcards"
                    />
                );
            })}
        </PopularProducts>
    );
};

export default FlashcardResults;
