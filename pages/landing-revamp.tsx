import axios from 'axios';
import Layout from 'commons/layout';
import withAnon from 'commons/withAnon';
import RevampedLandingContainer from 'landing/containers/revamped';
import React from 'react';
import config from 'redux/api/config';

type LandingPageProps = {
    pricingData?: ResponseData<PacketOffer>;
    classesData?: ResponseData<Course>;
};

const RevampedLandingPage = ({
    pricingData,
    classesData
}: LandingPageProps): JSX.Element => {
    return (
        <Layout shouldTransparent>
            <RevampedLandingContainer
                pricingData={pricingData?.data}
                classData={classesData?.data}
            />
        </Layout>
    );
};

export async function getStaticProps(): Promise<{
    props: {
        pricingData: ResponseData<PacketOffer>;
        classesData: ResponseData<Course>;
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
    const { data: pricingData }: { data: ResponseData<PacketOffer> } =
        await axios.get(`${config.API_BASE_URL}subscriptions/packet-offer/`);
    const { data: classesData }: { data: ResponseData<Course> } =
        await axios.get(`${config.API_BASE_URL}courses/public/?limit=4`);

    return {
        props: {
            pricingData,
            classesData,
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
