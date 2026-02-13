import withAnon from 'commons/withAnon';
import K12Dashboard from 'dashboard/containers/K12Dashboard';
import type { GetStaticProps } from 'next';
import { Layout } from 'commons/components/Layout';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'authentication/contexts/AuthProvider';

const Dashboard = (): JSX.Element => {
    const router = useRouter();
    const { profile, isLoadingProfile } = useAuth();

    useEffect(() => {
        if (isLoadingProfile !== undefined && !isLoadingProfile && !profile) {
            router.replace('/utbk');
        }
    }, [isLoadingProfile, profile, router]);

    return (
        <Layout>
            <K12Dashboard />
        </Layout>
    );
};

export default withAnon(Dashboard);

export const getStaticProps: GetStaticProps = async () => {
    const META_TITLE = 'Materi UTBK dan Tryout Gratis UTBK 2026';
    const META_DESCRIPTION =
        'Persiapkan dirimu menghadapi UTBK 2026 dengan tryout UTBK gratis dari Gradient. Dapatkan pengalaman ujian sesungguhnya dan analisis hasil untuk meningkatkan performa belajarmu.';

    try {
        return {
            props: {
                title: META_TITLE,
                description: META_DESCRIPTION,
                canonical: `https://gradient.academy/utbk/dashboard`,
                openGraph: {
                    type: 'website',
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    url: `https://gradient.academy/utbk/dashboard`,
                    images: [
                        {
                            url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                            width: 48,
                            height: 48,
                            alt: 'Gradient UTBK'
                        }
                    ]
                }
            },
            revalidate: 60
        };
    } catch (error) {
        console.error('getStaticProps error for', error);

        // Transient error (network, 5xx, timeouts) -> return a safe fallback props
        // and a short revalidate so ISR retries soon
        return {
            props: {
                courses: [],
                // you can pass an error flag/message to the page
                __errorMessage: 'Could not load data, please try again later'
            } as any,
            revalidate: 30 // retry in 30s
        };
    }
};
