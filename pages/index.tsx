import Layout from 'commons/layout';
import LandingContainer from 'landing/containers';
import withAnon from 'commons/withAnon';
import axios from 'axios';
import config from 'redux/api/config';

const Home = ({ data }: { data: PacketOffer[] }): JSX.Element => {
    return (
        <Layout shouldTransparent>
            <LandingContainer pricingData={data} />
        </Layout>
    );
};

export async function getStaticProps(): Promise<{
    props: PacketOffer[];
    revalidate: number;
}> {
    const { data }: { data: PacketOffer[] } = await axios.get(
        `${config.API_BASE_URL}subscriptions/packet-offer/`
    );

    return {
        props: data,
        revalidate: 60
    };
}

export default withAnon(Home);
