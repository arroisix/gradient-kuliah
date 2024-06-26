import axios from 'axios';
import Layout from 'commons/layout';
import withAnon from 'commons/withAnon';
import { GridProvider } from 'courses/contexts/GridProvider';
import LandingContainer from 'landing/containers';
import { CorporateContactJsonLd, DatasetJsonLd } from 'next-seo';
import React from 'react';
import config from 'redux/api/config';

type LandingPageProps = {
    majorData?: ResponseData<MajorOptions>;
    pricingData?: ResponseData<PacketOffer>;
    classesData?: ResponseData<Course>;
    popularBooksData?: GetLandingPopularBooksResponseData;
    description: string;
};

const RevampedLandingPage = ({
    majorData,
    classesData,
    popularBooksData,
    pricingData,
    description
}: LandingPageProps): JSX.Element => {
    return (
        <>
            <GridProvider>
                <Layout shouldTransparent>
                    <LandingContainer
                        majorData={majorData?.data}
                        classesData={classesData?.data}
                        popularBooksData={popularBooksData?.books}
                        pricingData={pricingData?.data}
                    />
                </Layout>
            </GridProvider>

            <CorporateContactJsonLd
                type="EducationalOrganization"
                name="Gradient"
                url="https://gradient.academy/"
                logo="https://assets.gradient.academy/assets/gradient-G-icon.png"
                alternateName="PT CERDASKAN KEHIDUPAN BANGSA"
                sameAs={[
                    'https://www.instagram.com/gradient_idn/',
                    'https://x.com/gradient_idn?lang=en',
                    'https://www.youtube.com/@gradient3012',
                    'https://www.linkedin.com/company/gradient-idn/',
                    'https://www.tiktok.com/@gradientacademy'
                ]}
                contactPoint={[
                    {
                        '@type': 'ContactPoint',
                        telephone: '+6285179893859',
                        contactType: 'customer service',
                        email: 'business@gradient.academy',
                        areaServed: 'ID',
                        availableLanguage: ['id']
                    }
                ]}
            />

            <DatasetJsonLd
                type="WebSite"
                name="Gradient Academy"
                url="https://gradient.academy/"
                description={description}
            />
        </>
    );
};

export async function getStaticProps(): Promise<{
    props: {
        pricingData: ResponseData<PacketOffer>;
        classesData: ResponseData<Course>;
        popularBooksData: GetLandingPopularBooksResponseData;
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
    const { data: majorData }: { data: ResponseData<MajorOptions> } =
        await axios.get(
            `${config.API_BASE_URL}courses/public/major-recommendations/`
        );
    const { data: classesData }: { data: ResponseData<Course> } =
        await axios.get(`${config.API_BASE_URL}courses/v2/public/?major=all`);
    const {
        data: popularBooksData
    }: { data: GetLandingPopularBooksResponseData } = await axios.get(
        `${config.API_BASE_URL}books/landing/popular/?major=all`
    );
    const { data: pricingData }: { data: ResponseData<PacketOffer> } =
        await axios.get(`${config.API_BASE_URL}subscriptions/packet-offer/`);

    const META_TITLE =
        'Platform Belajar Materi Kuliah Online #1 di Indonesia | Gradient';
    const META_DESCRIPTION =
        'Situs belajar online membantu Kamu meningkatkan pengetahuan dan keterampilan dalam memahami setiap materi perkuliahan melalui kelas & latihan soal yang interaktif.';

    return {
        props: {
            pricingData,
            classesData,
            popularBooksData,
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
