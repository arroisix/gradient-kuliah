'use client';
import CreditCardItem from './CreditCardItem';
import AddCardButton from './AddCardButton';
import { useGetAllUserCardsQuery } from 'payment/redux/api/transactionApi';
import Skeleton from 'commons/components/elements/Skeleton';

export const KartuKreditForm = (): JSX.Element => {
    const {
        data: creditCardsData,
        isLoading,
        error
    } = useGetAllUserCardsQuery();

    const handleCardClick = (cardId: string) => {
        console.log('Card clicked:', cardId);
    };

    if (isLoading) {
        return <Skeleton repeat={4} />;
    }

    if (error) {
        const message =
            'status' in error
                ? 'Terjadi kesalahan: ' + (error.data as any)?.message ||
                  error.status
                : error.message;

        return (
            <div className="p-4 text-red-500 bg-red-100 rounded">{message}</div>
        );
    }

    const cards = creditCardsData?.cards || [];

    return (
        <div>
            <div className="max-h-[70vh] overflow-y-auto">
                {cards.map((card) => (
                    <CreditCardItem
                        key={card.id}
                        card={card}
                        onClick={() => handleCardClick(card.id)}
                    />
                ))}

                {/* Add Card Button */}
                <AddCardButton />
            </div>
        </div>
    );
};

export default KartuKreditForm;
