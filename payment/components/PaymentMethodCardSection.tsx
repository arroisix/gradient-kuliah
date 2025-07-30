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
    const { paymentMethod, cardId } = usePayment();
    const { data: cardsData, isLoading } = useGetAllUserCardsQuery();

    if (isLoading || !cardsData) {
        return <Spinner size="medium" />;
    }

    const cards = cardsData.cards;

    return (
        <div className="flex flex-col space-y-3 mb-6">
            <h3 className="text-white font-semibold text-base px-4">
                Credit/Debit Card
            </h3>
            <div className="flex flex-col mx-4 rounded-lg overflow-hidden">
                {cards.map((card) => (
                    <PaymentMethodItem
                        key={card.id}
                        isSelected={
                            paymentMethod.startsWith('CARD_') &&
                            cardId === card.id
                        }
                        methodCode={
                            `CARD_${card.brand.toUpperCase()}` as PaymentMethod
                        }
                        cardId={card.id}
                        cardName={card.name}
                    />
                ))}
                <AddCardButton bottomBorder={false} isTemporary={true} />
            </div>
        </div>
    );
};

export default PaymentMethodCardSection;
