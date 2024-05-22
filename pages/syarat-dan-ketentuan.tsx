import Layout from 'commons/layout';
import TermsCondition from 'legal/containers/termsCondition';
import { GetStaticProps } from 'next';
import React from 'react';

const TermsConditionPage = (): JSX.Element => {
    return (
        <Layout>
            <TermsCondition />
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = () => {
    const META_TITLE = 'Syarat & Ketentuan bagi Pelanggan | Gradient';
    const META_DESCRIPTION =
        'Aplikasi kami memiliki segala bentuk syarat dan ketentuan demi bisa meningkatkan kepuasan seluruh pelanggan yang telah berkomitmen menggunakan platform kami.';

    return {
        props: {
            canonical: 'https://gradient.academy/syarat-dan-ketentuan',
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
};

export default TermsConditionPage;
