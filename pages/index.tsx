import axios from 'axios';
import Layout from 'commons/layout';
import withAnon from 'commons/withAnon';
import RevampedLandingContainer from 'landing/containers/revamped';
import React from 'react';
import config from 'redux/api/config';

type LandingPageProps = {
    pricingData?: ResponseData<PacketOffer>;
    classesData?: ResponseData<Course>;
    majorData?: ResponseData<MajorOptions>;
};

const RevampedLandingPage = ({
    pricingData,
    classesData,
    majorData
}: LandingPageProps): JSX.Element => {
    return (
        <Layout shouldTransparent>
            <RevampedLandingContainer
                majorData={majorData?.data}
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
        majorData: ResponseData<MajorOptions>;
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
    revalidate?: number;
}> {
    const { data: pricingData }: { data: ResponseData<PacketOffer> } =
        await axios.get(`${config.API_BASE_URL}subscriptions/packet-offer/`);
    const { data: classesData }: { data: ResponseData<Course> } =
        await axios.get(`${config.API_BASE_URL}courses/public/?limit=4`);
    const { data: majorData }: { data: ResponseData<MajorOptions> } =
        await axios.get(
            `${config.API_BASE_URL}courses/public/major-recommendations/`
        );

    return {
        props: {
            pricingData,
            classesData,
            majorData,
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
        }
    };
}

RevampedLandingPage.displayName = 'Main Landing';
export default withAnon(RevampedLandingPage);
