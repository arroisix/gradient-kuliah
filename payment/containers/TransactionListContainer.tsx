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
import { checkExpiry } from 'payment/utils';

type Tab = 'SEMUA' | 'PENDING' | 'BERHASIL' | 'GAGAL';

const tabs: { key: Tab; label: string }[] = [
    { key: 'SEMUA', label: 'Semua' },
    { key: 'PENDING', label: 'Menunggu Pembayaran' },
    { key: 'BERHASIL', label: 'Berhasil' },
    { key: 'GAGAL', label: 'Gagal' }
];

const TransactionListContainer = (): JSX.Element => {
    const [activeTransaction, setActiveTransaction] = useState<Transaction[]>();
    const [upcomingSubscription, setUpcomingSubscription] =
        useState<Transaction[]>();
    const [inactiveTransaction, setInactiveTransaction] =
        useState<Transaction[]>();
    const [activeTab, setActiveTab] = useState<Tab>('SEMUA');

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

    const waitingTransactions = inactiveTransaction?.filter(
        (tx) => tx.status === 'WAITING'
    );
    const successExpired = inactiveTransaction?.filter(
        (tx) => tx.status === 'SUCCESS'
    );
    const expiredTransactions =
        inactiveTransaction?.filter(
            (tx) =>
                checkExpiry(tx.deadline as string) && tx.status !== 'SUCCESS'
        ) || [];

    const renderByTab = (): JSX.Element => {
        switch (activeTab) {
            case 'SEMUA':
                return (
                    <>
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
                    </>
                );

            case 'PENDING':
                return (
                    <TransactionList
                        header="Tidak Aktif"
                        transactions={waitingTransactions}
                        hasUpcoming={upcomingSubscription?.length != 0}
                    />
                );

            case 'BERHASIL':
                return (
                    <>
                        <TransactionList
                            isActive
                            header="Aktif"
                            transactions={activeTransaction}
                            hasUpcoming={upcomingSubscription?.length !== 0}
                        />
                        <TransactionList
                            isActive
                            header="Mendatang"
                            transactions={upcomingSubscription}
                            hasUpcoming={upcomingSubscription?.length != 0}
                        />
                        <TransactionList
                            header="Tidak Aktif"
                            transactions={successExpired}
                            hasUpcoming={upcomingSubscription?.length != 0}
                        />
                    </>
                );

            case 'GAGAL':
                return (
                    <TransactionList
                        header="Tidak Aktif"
                        transactions={expiredTransactions}
                        hasUpcoming={upcomingSubscription?.length != 0}
                    />
                );

            default:
                return <></>;
        }
    };

    const isEmpty =
        !loading &&
        {
            SEMUA: data?.data ?? [],
            PENDING: waitingTransactions ?? [],
            BERHASIL: [
                ...(activeTransaction ?? []),
                ...(upcomingSubscription ?? []),
                ...(successExpired ?? [])
            ],
            GAGAL: expiredTransactions
        }[activeTab].length === 0;

    return (
        <section className="min-h-screen py-24 space-y-6 px-4 md:px-[7.5rem]">
            <h1 className="mb-6 font-bold text-center sm:text-2xl sm:mb-8">
                Riwayat Pembelian
            </h1>
            {loading && <Skeleton className="h-[150px]" repeat={3} />}

            {/* Responsive Tabs */}
            <div
                className={`
      overflow-x-auto
      -mx-4 px-4
      sm:mx-0 sm:px-0
      mb-8
    `}>
                <div
                    className="
        inline-flex
        space-x-4
        whitespace-nowrap
      ">
                    {tabs.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`
            flex-shrink-0
            px-4 py-2 font-medium
            ${
                activeTab === key
                    ? 'border-b-2 border-purple-500 text-purple-500'
                    : 'text-gray-400'
            }
            text-sm sm:text-base
          `}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>
            {!loading && renderByTab()}
            {isEmpty && <EmptyState />}
            <ReferralModal
                isOpen={isReferralModalOpen}
                setOpen={setIsReferralModalOpen}
            />
        </section>
    );
};

export default TransactionListContainer;
