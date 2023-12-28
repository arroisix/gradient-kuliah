import { useEffect, useState } from 'react';
import TransactionCard from '../components/TransactionCard';
import moment from 'moment';
import Skeleton from 'commons/components/elements/Skeleton';
import ReferralModal from 'referral/components/ReferralModal';
import { useRouter } from 'next/router';
import { useGetAllTransactionQuery } from 'payment/redux/api/transactionApi';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';

const TransactionListContainer = (): JSX.Element => {
    const [activeTransaction, setActiveTransaction] = useState<Transaction[]>();
    const [inactiveTransaction, setInactiveTransaction] =
        useState<Transaction[]>();

    const isAuthenticated = useSelector(getIsAuthenticated);
    const { isLoading: loading, data } = useGetAllTransactionQuery(undefined, {
        refetchOnMountOrArgChange: true,
        skip: !isAuthenticated
    });

    const router = useRouter();
    const { checkout } = router.query;
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

    useEffect(() => {
        if (checkout === 'success') setIsReferralModalOpen(true);
    }, [checkout]);

    useEffect(() => {
        if (data) {
            // saves transaction with latest activation date before today
            const activeTransaction_ = [];
            const inactiveTransactions_ = [];
            for (const transaction of data.data) {
                const isSuccess = transaction.status === 'SUCCESS';
                const isSubscriptionActive =
                    moment(transaction.subscriber.deactivate_after)
                        .endOf('day')
                        .unix() > moment().unix();
                if (isSuccess && isSubscriptionActive)
                    activeTransaction_.push(transaction);
                else inactiveTransactions_.push(transaction);
            }
            setActiveTransaction(activeTransaction_);
            setInactiveTransaction(inactiveTransactions_);
        }
    }, [data]);

    return (
        <section className="min-h-screen pt-24 px-4 md:px-[7.5rem]">
            <h1 className="mb-6 font-bold text-center sm:text-2xl sm:mb-8">
                Riwayat Pembelian
            </h1>
            {loading && <Skeleton className="h-[150px]" repeat={3} />}
            {activeTransaction && activeTransaction.length !== 0 && (
                <>
                    <span className="inline-block font-body text-sm mb-[18px]">
                        Aktif
                    </span>
                    <div className="space-y-4 md:space-y-6">
                        {activeTransaction?.map((transaction: Transaction) => (
                            <TransactionCard
                                active
                                isList
                                transaction={transaction}
                                key={transaction.id}
                            />
                        ))}
                    </div>
                </>
            )}
            {inactiveTransaction && inactiveTransaction.length !== 0 && (
                <>
                    <span className="inline-block font-body text-sm mb-[18px] mt-6 sm:mt-10">
                        Tidak Aktif
                    </span>
                    <div className="space-y-4 md:space-y-6">
                        {inactiveTransaction?.map(
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
