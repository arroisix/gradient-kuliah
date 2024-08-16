import ProductCard from 'commons/components/elements/ProductCard';
import React from 'react';
import PopularProducts from './PopularProducts';
import { getBookBaseHref } from 'courses/utils';
import Skeleton from 'commons/components/elements/Skeleton';

type PopularBookProps = {
    isLoading?: boolean;
    books?: PopularBook[];
};

const PopularBook = ({ isLoading, books }: PopularBookProps): JSX.Element => {
    if (isLoading)
        return (
            <PopularProducts title="Astronotes Terpopuler">
                <Skeleton
                    className="h-64 carousel-item w-60"
                    isCustomSize
                    repeat={5}
                />
            </PopularProducts>
        );

    if (!books) return <></>;

    return (
        <PopularProducts title="Astronotes Terpopuler">
            {books?.map((book) => (
                <ProductCard
                    key={book.id}
                    orientation="vertical"
                    href={`${getBookBaseHref(book.category)}/${book.book_slug}`}
                    category={book.category ?? ''}
                    eventName="Test"
                    product={{
                        title: book.book_title,
                        thumbnail: book.book_cover_url,
                        inProgress: false,
                        latestProgress: 0
                    }}
                    className="carousel-item w-60"
                    imageClassname="min-w-16"
                />
            ))}
        </PopularProducts>
    );
};

export default PopularBook;
