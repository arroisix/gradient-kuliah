'use client';
import CreditCardItem from './CreditCardItem';
import AddCardButton from './AddCardButton';
import { useGetAllUserCardsQuery } from 'payment/redux/api/transactionApi';
import Skeleton from 'commons/components/elements/Skeleton';
import { useMemo } from 'react';

export const CreditCardList = (): JSX.Element => {
    const {
        data: creditCardsData,
        isLoading,
        error
    } = useGetAllUserCardsQuery();

    // Sort by created_at
    const sortedCards = useMemo(() => {
        const cards = creditCardsData?.cards || [];
        return [...cards].sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateA - dateB; // ascending: oldest first
        });
    }, [creditCardsData?.cards]);

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
    return (
        <div>
            <div className="max-h-[70vh] overflow-y-auto">
                {sortedCards.map((card) => (
                    <CreditCardItem key={card.id} card={card} />
                ))}

                <AddCardButton />
            </div>
        </div>
    );
};

export default CreditCardList;
