import TransactionCard from '../components/TransactionCard';
import TransactionGuide from '../components/TransactionGuide';
import { useCheckout } from '../contexts/TransactionProvider';

const TransactionContainer = (): JSX.Element => {
    const { transaction } = useCheckout();

    return (
        <section className="min-h-screen pt-24 px-4 md:px-[7.5rem]">
            <TransactionCard transaction={transaction} />
            <TransactionGuide />
        </section>
    );
};

export default TransactionContainer;
