import React from 'react';
import TransactionCard from '../TransactionCard';

type TransactionListProps = {
    transactions?: Transaction[];
    isActive?: boolean;
    hasUpcoming?: boolean;
    header?: 'Aktif' | 'Tidak Aktif' | 'Mendatang';
};

const TransactionList = ({
    transactions = [],
    header,
    hasUpcoming,
    isActive
}: TransactionListProps): JSX.Element => {
    if (transactions.length === 0) return <></>;

    return (
        <>
            <h3 className="font-body text-sm mb-[18px]">{header}</h3>
            <div className="space-y-4 md:space-y-6">
                {transactions?.map((transaction: Transaction) => (
                    <TransactionCard
                        active={isActive}
                        isList
                        hasUpcoming={hasUpcoming}
                        transaction={transaction}
                        key={transaction.id}
                    />
                ))}
            </div>
        </>
    );
};

export default TransactionList;
