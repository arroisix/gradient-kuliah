import { useEffect, useState } from 'react';
import TransactionCard from '../components/TransactionCard';
import useAllTransaction from '../hooks/useAllTransaction';
import moment from 'moment';
import Skeleton from 'commons/components/elements/Skeleton';
import ReferralModal from 'referral/components/ReferralModal';
import { useRouter } from 'next/router';

const TransactionListContainer = (): JSX.Element => {
    const [activeTransaction, setActiveTransaction] = useState<Transaction>();
    const [inactiveTransaction, setInactiveTransaction] =
        useState<Transaction[]>();

    const { data, loading } = useAllTransaction();

    const router = useRouter();
    const { checkout } = router.query;
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

    useEffect(() => {
        if (checkout === 'success') setIsReferralModalOpen(true);
    }, []);

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
            <h1 className="mb-6 font-bold text-center sm:text-2xl sm:mb-8">
                Riwayat Pembelian
            </h1>
            {loading && <Skeleton className="h-[150px]" repeat={3} />}
            {activeTransaction && (
                <>
                    <span className="inline-block font-body text-sm mb-[18px]">
                        Aktif
                    </span>
                    <TransactionCard
                        active
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
            <ReferralModal
                isOpen={isReferralModalOpen}
                setOpen={setIsReferralModalOpen}
            />
        </section>
    );
};

export default TransactionListContainer;
