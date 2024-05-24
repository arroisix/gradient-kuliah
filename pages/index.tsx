import axios from 'axios';
import Layout from 'commons/layout';
import withAnon from 'commons/withAnon';
import LandingContainer from 'landing/containers';
import { NextSeo } from 'next-seo';
import React from 'react';
import config from 'redux/api/config';

type LandingPageProps = {
    pricingData?: ResponseData<PacketOffer>;
    classesData?: ResponseData<Course>;
    majorData?: ResponseData<MajorOptions>;
};

const RevampedLandingPage = ({ pricingData }: LandingPageProps): JSX.Element => {
    return (
        <>
            <NextSeo canonical="https://gradient.academy/" />

            <Layout shouldTransparent>
                <LandingContainer pricingData={pricingData?.data} />
            </Layout>
        </>
    );
};

export async function getStaticProps(): Promise<{
    props: {
        pricingData: ResponseData<PacketOffer>;
        classesData: ResponseData<Course>;
        majorData: ResponseData<MajorOptions>;
        canonical: string;
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

    const META_TITLE =
        'Platform Belajar Materi Kuliah Online #1 di Indonesia | Gradient';
    const META_DESCRIPTION =
        'Situs belajar online membantu Kamu meningkatkan pengetahuan dan keterampilan dalam memahami setiap materi perkuliahan melalui kelas & latihan soal yang interaktif.';

    return {
        props: {
            pricingData,
            classesData,
            majorData,
            canonical: 'https://gradient.academy/',
            title: META_TITLE,
            description: META_DESCRIPTION,
            openGraph: {
                type: 'website',
                title: META_TITLE,
                description: META_DESCRIPTION,
                url: `https://gradient.academy`,
                images: [
                    {
                        url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                        width: 48,
                        height: 48,
                        alt: 'Gradient Academy'
                    }
                ]
            }
        }
    };
}

RevampedLandingPage.displayName = 'Main Landing';
export default withAnon(RevampedLandingPage);
