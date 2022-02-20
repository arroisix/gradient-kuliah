import TransactionCard from '../components/TransactionCard';
import useAllTransaction from '../hooks/useAllTransaction';

const TransactionListContainer = (): JSX.Element => {
    const { data } = useAllTransaction();

    return (
        <section className="min-h-screen pt-24 px-[7.5rem]">
            <h1 className="text-5xl font-bold mb-16">Riwayat Pembelian</h1>
            {(data?.transactions as [Transaction])?.map(
                (transaction: Transaction) => (
                    <TransactionCard
                        isList
                        transaction={transaction}
                        key={transaction.id}
                    />
                )
            )}
            <div className="mb-16" />
        </section>
    );
};

export default TransactionListContainer;
