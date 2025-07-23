import React from 'react';
import HorizontalProductCard from './HorizontalProductCard';
import VerticalProductCard from './VerticalProductCard';

const ProductCard = ({
    orientation,
    category,
    ...props
}: ProductCardProps): JSX.Element => {
    console.log('ProductCard category:', category);
    const categoryLabel: { [key: string]: string } = {
        [category]: category,
        Catatan: 'Astronotes',
        Textbook: 'Textbook Solution',
        BankSoal: 'Bank Soal',
    };

    return orientation == 'horizontal' ? (
        <HorizontalProductCard {...props} category={categoryLabel[category]} />
    ) : (
        <VerticalProductCard {...props} category={categoryLabel[category]} />
    );
};

export default ProductCard;
