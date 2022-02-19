import Layout from 'src/commons/layout';
import LandingContainer from 'src/landing/containers';

export default function Home(): JSX.Element {
    return (
        <Layout shouldTransparent>
            <LandingContainer />
        </Layout>
    );
}
