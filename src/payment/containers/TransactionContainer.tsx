import TransactionCard from '../components/TransactionCard';
import TransactionGuide from '../components/TransactionGuide';

const TransactionContainer = (): JSX.Element => {
    return (
        <section className="min-h-screen pt-24 px-[7.5rem]">
            <TransactionCard />
            <TransactionGuide />
        </section>
    );
};

export default TransactionContainer;
