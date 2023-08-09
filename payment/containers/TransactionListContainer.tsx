import TransactionCard from '../components/TransactionCard';
import useAllTransaction from '../hooks/useAllTransaction';

const TransactionListContainer = (): JSX.Element => {
    const { data } = useAllTransaction();

    return (
        <section className="min-h-screen pt-24 px-4 md:px-[7.5rem]">
            <h1 className="sm:text-2xl text-center font-bold mb-6 sm:mb-8">
                Riwayat Pembelian
            </h1>
            <div className="flex flex-col gap-[18px]">
                {(data?.data as [Transaction])?.map(
                    (transaction: Transaction) => (
                        <TransactionCard
                            isList
                            transaction={transaction}
                            key={transaction.id}
                        />
                    )
                )}
            </div>
            <div className="mb-16" />
        </section>
    );
};

export default TransactionListContainer;
