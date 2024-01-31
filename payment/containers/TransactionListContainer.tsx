import { useEffect, useState } from 'react';
import moment from 'moment';
import Skeleton from 'commons/components/elements/Skeleton';
import ReferralModal from 'referral/components/ReferralModal';
import { useRouter } from 'next/router';
import { useGetAllTransactionQuery } from 'payment/redux/api/transactionApi';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import TransactionList from 'payment/components/TransactionList';
import EmptyState from 'payment/components/TransactionList/EmptyState';

const TransactionListContainer = (): JSX.Element => {
    const [activeTransaction, setActiveTransaction] = useState<Transaction[]>();
    const [upcomingSubscription, setUpcomingSubscription] =
        useState<Transaction[]>();
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
    const isEmpty = !loading && data?.data?.length == 0;

    useEffect(() => {
        if (checkout === 'success') setIsReferralModalOpen(true);
    }, [checkout]);

    useEffect(() => {
        if (data) {
            // saves transaction with latest activation date before today
            const activeTransaction_ = [];
            const upcoming_ = [];
            const inactiveTransactions_ = [];
            for (const transaction of data.data) {
                const isSuccess = transaction.status === 'SUCCESS';
                const isSubscriptionUpcoming =
                    moment(transaction.subscriber.active_from)
                        .startOf('day')
                        .unix() > moment().unix();
                const isSubscriptionActive =
                    moment(transaction.subscriber.deactivate_after)
                        .endOf('day')
                        .unix() > moment().unix();
                if (isSuccess && isSubscriptionUpcoming)
                    upcoming_.push(transaction);
                else if (isSuccess && isSubscriptionActive)
                    activeTransaction_.push(transaction);
                else inactiveTransactions_.push(transaction);
            }
            setActiveTransaction(activeTransaction_);
            setUpcomingSubscription(upcoming_);
            setInactiveTransaction(inactiveTransactions_);
        }
    }, [data]);

    return (
        <section className="min-h-screen py-24 space-y-6 px-4 md:px-[7.5rem]">
            <h1 className="mb-6 font-bold text-center sm:text-2xl sm:mb-8">
                Riwayat Pembelian
            </h1>
            {loading && <Skeleton className="h-[150px]" repeat={3} />}
            <TransactionList
                isActive
                header="Aktif"
                transactions={activeTransaction}
                hasUpcoming={upcomingSubscription?.length != 0}
            />
            <TransactionList
                isActive
                header="Mendatang"
                transactions={upcomingSubscription}
                hasUpcoming={upcomingSubscription?.length != 0}
            />
            <TransactionList
                header="Tidak Aktif"
                transactions={inactiveTransaction}
                hasUpcoming={upcomingSubscription?.length != 0}
            />
            {isEmpty && <EmptyState />}
            <ReferralModal
                isOpen={isReferralModalOpen}
                setOpen={setIsReferralModalOpen}
            />
        </section>
    );
};

export default TransactionListContainer;
