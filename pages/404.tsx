import Button from 'commons/components/elements/Button';
import Layout from 'commons/layout';

const NotFound = (): JSX.Element => {
    return (
        <Layout>
            <div className="flex flex-col h-screen justify-center items-center gap-4">
                <h1 className="text-5xl font-bold">404 Not Found</h1>
                <Button href="/" variant="primary">
                    Kembali
                </Button>
            </div>
        </Layout>
    );
};

export default NotFound;
