import React from 'react';
import HorizontalProductCard from './HorizontalProductCard';
import VerticalProductCard from './VerticalProductCard';

const ProductCard = ({
    orientation,
    category,
    ...props
}: ProductCardProps): JSX.Element => {
    const categoryLabel: { [key: string]: string } = {
        Catatan: 'Astronotes',
        Textbook: 'Textbook Solution',
        [category]: category
    };

    return orientation == 'horizontal' ? (
        <HorizontalProductCard {...props} category={categoryLabel[category]} />
    ) : (
        <VerticalProductCard {...props} category={categoryLabel[category]} />
    );
};

export default ProductCard;
