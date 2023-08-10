import { useEffect, useState } from 'react';
import TransactionCard from '../components/TransactionCard';
import useAllTransaction from '../hooks/useAllTransaction';
import moment from 'moment';

const TransactionListContainer = (): JSX.Element => {
    const [activeTransaction, setActiveTransaction] = useState<Transaction>();
    const [inactiveTransaction, setInactiveTransaction] =
        useState<Transaction[]>();

    const { data } = useAllTransaction();

    useEffect(() => {
        data?.data.forEach((value) => {
            if (value.status === 'SUCCESS') {
                if (
                    moment(moment(value.created_at).startOf('day'))
                        .add(
                            value.subscriber.subscribed_packet?.active_duration,
                            'd'
                        )
                        .unix() > moment().unix()
                ) {
                    setActiveTransaction(value);
                } else {
                    setInactiveTransaction((prev) =>
                        prev ? [...prev, value] : [value]
                    );
                }
            } else {
                setInactiveTransaction((prev) =>
                    prev ? [...prev, value] : [value]
                );
            }
        });
    }, [data]);

    return (
        <section className="min-h-screen pt-24 px-4 md:px-[7.5rem]">
            <h1 className="sm:text-2xl text-center font-bold mb-6 sm:mb-8">
                Riwayat Pembelian
            </h1>
            {activeTransaction && (
                <>
                    <span className="inline-block font-body text-sm mb-[18px]">
                        Aktif
                    </span>
                    <TransactionCard
                        isList
                        transaction={activeTransaction as Transaction}
                    />
                </>
            )}
            {inactiveTransaction && inactiveTransaction.length !== 0 && (
                <>
                    <span className="inline-block font-body text-sm mb-[18px] mt-6 sm:mt-10">
                        Tidak Aktif
                    </span>
                    <div className="flex flex-col gap-[18px]">
                        {(inactiveTransaction as [Transaction])?.map(
                            (transaction: Transaction) => (
                                <TransactionCard
                                    isList
                                    transaction={transaction}
                                    key={transaction.id}
                                />
                            )
                        )}
                    </div>
                </>
            )}
            <div className="mb-16" />
        </section>
    );
};

export default TransactionListContainer;
