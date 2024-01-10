import Layout from 'commons/layout';
import LandingContainer from 'landing/containers';
import withAnon from 'commons/withAnon';
import axios from 'axios';
import config from 'redux/api/config';

const Home = ({ data }: { data: { data: PacketOffer[] } }): JSX.Element => {
    return (
        <Layout shouldTransparent>
            <LandingContainer pricingData={data.data} />
        </Layout>
    );
};

export async function getStaticProps(): Promise<{
    props: {
        data: PacketOffer[];
        title: string;
        description: string;
        openGraph: {
            type: string;
            title: string;
            description: string;
            url: string;
            images: {
                url: string;
                width: number;
                height: number;
                alt: string;
            }[];
        };
    };
    revalidate: number;
}> {
    const { data }: { data: PacketOffer[] } = await axios.get(
        `${config.API_BASE_URL}subscriptions/packet-offer/`
    );

    return {
        props: {
            data,
            title: 'Platform Belajar Kuliah  No. 1 di Indonesia',
            description:
                'Belajar dari dosen bermutu, bareng pelajar se-Indonesia. Materi kuliah dan pembahasan soal lengkap',
            openGraph: {
                type: 'website',
                title: `Platform Belajar Kuliah  No. 1 di Indonesia`,
                description:
                    'Belajar dari dosen bermutu, bareng pelajar se-Indonesia. Materi kuliah dan pembahasan soal lengkap',
                url: `https://gradient.academy`,
                images: [
                    {
                        url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                        width: 48,
                        height: 48,
                        alt: 'Gradient Logo'
                    }
                ]
            }
        },
        revalidate: 60
    };
}

Home.displayName = 'Main Landing';
export default withAnon(Home);
