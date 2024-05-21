import Layout from 'commons/layout';
import PrivacyPolicy from 'legal/containers/privacyPolicy';
import { GetStaticProps } from 'next';
import React from 'react';

const PrivacyPolicyPage = (): JSX.Element => {
    return (
        <Layout>
            <PrivacyPolicy />
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = () => {
    const META_TITLE = 'Kebijakan Privasi bagi Pelanggan | Gradient';
    const META_DESCRIPTION =
        'Aplikasi kami dirancang untuk bisa mencatat segala aktivitas pelangggan karena itu kami berkomitmen penuh untuk menjaga setiap kerahasian data Kamu yang terekam.';

    return {
        props: {
            canonical: 'https://gradient.academy/kebijakan-privasi',
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
                        alt: 'Gradient Logo'
                    }
                ]
            }
        }
    };
};

export default PrivacyPolicyPage;
