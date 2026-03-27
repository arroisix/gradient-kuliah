import axios from 'axios';
import Layout from 'commons/layout';
import withAnon from 'commons/withAnon';
import { GridProvider } from 'courses/contexts/GridProvider';
import LandingContainer from 'landing/containers';
import { CorporateContactJsonLd, DatasetJsonLd } from 'next-seo';
import React from 'react';
import config from 'redux/api/config';

type LandingPageProps = {
    pricingData?: ResponseData<PacketOffer>;
    classesData?: ResponseData<Course>;
    popularBooksData?: GetLandingPopularBooksResponseData;
    description: string;
};

const RevampedLandingPage = ({
    classesData,
    popularBooksData,
    pricingData,
    description
}: LandingPageProps): JSX.Element => {
    return (
        <>
            <GridProvider>
                <Layout
                    withoutK12Paywall
                    withoutMaxWidthContainer
                    withoutNavbar
                    withoutFooter>
                    <LandingContainer
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
                    'https://www.tiktok.com/@gradient_idn'
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
        pricingData: ResponseData<PacketOffer> | null;
        classesData: ResponseData<Course> | null;
        popularBooksData: GetLandingPopularBooksResponseData | null;
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
    // Temporarily disable API calls for local testing
    let classesData = null;
    let popularBooksData = null;
    let pricingData = null;

    try {
        const classesRes = await axios.get(
            `${config.API_BASE_URL}courses/v2/public/?major=all`
        );
        classesData = classesRes.data;

        const booksRes = await axios.get(
            `${config.API_BASE_URL}books/landing/popular/?major=all`
        );
        popularBooksData = booksRes.data;

        const pricingRes = await axios.get(
            `${config.API_BASE_URL}subscriptions/packet-offer/`
        );
        pricingData = pricingRes.data;
    } catch (error) {
        console.log('API not available, using empty data for testing');
    }

    const META_TITLE =
        'Platform Belajar Materi Kuliah Online #1 di Indonesia | Gradient';
    const META_DESCRIPTION =
        'Situs belajar online membantu Kamu meningkatkan pengetahuan dan keterampilan dalam memahami setiap materi perkuliahan melalui kelas & latihan soal yang interaktif.';

    return {
        props: {
            pricingData,
            classesData,
            popularBooksData,
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
