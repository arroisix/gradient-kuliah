import axios from 'axios';
import Layout from 'commons/layout';
import withAnon from 'commons/withAnon';
import RevampedLandingContainer from 'landing/containers/revamped';
import React from 'react';
import config from 'redux/api/config';

const RevampedLandingPage = ({
    data
}: {
    data: { data: PacketOffer[] };
}): JSX.Element => {
    return (
        <Layout shouldTransparent>
            <RevampedLandingContainer pricingData={data.data} />
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
                'Tempat belajar materi kuliah nomor 1 di Indonesia. Lengkap materi dan pembahasan soal',
            openGraph: {
                type: 'website',
                title: `Platform Belajar Kuliah  No. 1 di Indonesia`,
                description: `Tempat belajar materi kuliah nomor 1 di Indonesia. Lengkap materi dan pembahasan soal`,
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

RevampedLandingPage.displayName = 'Main Landing';
export default withAnon(RevampedLandingPage);
