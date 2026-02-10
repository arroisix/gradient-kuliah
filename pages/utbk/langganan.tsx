import Layout from 'commons/layout';
import Langganan from 'landing/components/utbk/Langganan';

const Subscribe = (): JSX.Element => {
    return (
        <Layout paymentPage>
            <section className="py-4 lg:py-24 px-[18px] m-auto max-w-[1064px] w-full">
                <Langganan removeFree />
            </section>
        </Layout>
    );
};

Subscribe.displayName = 'Subscribe';
export default Subscribe;
