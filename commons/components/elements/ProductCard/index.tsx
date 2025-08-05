import React from 'react';
import HorizontalProductCard from './HorizontalProductCard';
import VerticalProductCard from './VerticalProductCard';

const ProductCard = ({
    orientation,
    category,
    isReference = false,
    ...props
}: ProductCardProps & { isReference?: boolean }): JSX.Element => {
    const categoryLabel: { [key: string]: string } = {
        [category]: category,
        Catatan: 'Astronotes',
        Textbook: 'Textbook Solution',
        BankSoal: 'Bank Soal',
    };

    return orientation == 'horizontal' ? (
        <HorizontalProductCard 
            {...props} 
            category={categoryLabel[category]} 
            isReference={isReference}
        />
    ) : (
        <VerticalProductCard 
            {...props} 
            category={categoryLabel[category]} 
            isReference={isReference}
        />
    );
};

export default ProductCard;