'use client';

import type React from 'react';
import PaymentMethodItem from './PaymentMethodItem';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { useGetAllUserCardsQuery } from 'payment/redux/api/transactionApi';
import Spinner from 'commons/components/elements/Spinner';
import AddCardButton from 'profile/components/kartu-kredit/AddCardButton';

interface PaymentMethodCardProps {
    children?: React.ReactNode;
}

const PaymentMethodCardSection: React.FC<PaymentMethodCardProps> = ({
    children
}) => {
    const { paymentMethod } = usePayment();
    const { data: cardsData, isLoading } = useGetAllUserCardsQuery();

    if (isLoading || !cardsData) {
        return <Spinner size="medium" />;
    }

    const cards = cardsData.cards;

    return (
        <div className="mb-6">
            <h3 className="text-white font-semibold text-base mb-3 px-4">
                Credit/Debit Card
            </h3>
            <div className="mx-4 rounded-lg overflow-hidden">
                
                <AddCardButton bottomBorder={false} isTemporary={true} />
            </div>
        </div>
    );
};

export default PaymentMethodCardSection;
