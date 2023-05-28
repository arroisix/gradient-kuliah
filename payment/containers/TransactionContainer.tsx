import { useRouter } from 'next/router';
import { useGetTransactionQuery } from 'payment/redux/api/transactionApi';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import TransactionCard from '../components/TransactionCard';
import TransactionGuide from '../components/TransactionGuide';

const TransactionContainer = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { isLoading, data } = useGetTransactionQuery(id as string, {
        skip: id === undefined || id === null,
        pollingInterval: 3000
    });

    useEffect(() => {
        if (data) {
            if (data.status === 'SUCCESS') {
                toast.success(`Pembayaran Sukses!`, {
                    position: toast.POSITION.TOP_CENTER
                });
                router.push('/checkout/sukses');
            }
        }
    }, [data]);

    return (
        <section className="min-h-screen pt-24 px-4 md:px-[7.5rem]">
            {isLoading && (
                <div className="p-4 h-64 w-full bg-neutral-600 animate-pulse rounded-lg mb-4" />
            )}
            {data && <TransactionCard transaction={data as Transaction} />}
            <TransactionGuide />
        </section>
    );
};

export default TransactionContainer;
