import withAuth from 'src/commons/withAuth';
import Layout from 'src/commons/layout';
import Button from 'src/commons/components/elements/Button';

const Checkout = (): JSX.Element => {
    return (
        <Layout>
            <section className="min-h-screen pt-24 px-[7.5rem] flex justify-center items-center">
                <h1>Pembelian Sukses!</h1>
                <Button variant="primary" href="/kelas">
                    Belajar
                </Button>
            </section>
        </Layout>
    );
};

export default withAuth(Checkout);
