import Layout from 'commons/layout';
import LandingContainer from 'landing/containers';
import withAnon from 'commons/withAnon';
import axios from 'axios';
import config from 'redux/api/config';
import { NextSeo } from 'next-seo';

const Home = ({ data }: { data: PacketOffer[] }): JSX.Element => {
    return (
        <>
            <NextSeo
                title="Platform Belajar Kuliah  No. 1 di Indonesia"
                description="Tempat belajar materi kuliah nomor 1 di Indonesia. Lengkap materi dan pembahasan soal"
                openGraph={{
                    type: 'website',
                    title: `Platform Belajar Kuliah  No. 1 di Indonesia`,
                    description: `Tempat belajar materi kuliah nomor 1 di Indonesia. Lengkap materi dan pembahasan soal`,
                    url: `https://gradient.academy`
                }}
            />
            <Layout shouldTransparent>
                <LandingContainer pricingData={data} />
            </Layout>
        </>
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
