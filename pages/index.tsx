import Layout from 'commons/layout';
import LandingContainer from 'landing/containers';
import withAnon from 'commons/withAnon';

const Home = (): JSX.Element => {
    return (
        <Layout shouldTransparent>
            <LandingContainer />
        </Layout>
    );
};

export default withAnon(Home);
