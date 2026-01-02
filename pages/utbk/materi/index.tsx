import { useAuth } from 'authentication/contexts/AuthProvider';
import LearnLayout from 'commons/learnLayout';
import Layout from 'commons/utbkLayout';
import { MateriEntrypoint } from 'courses/components/utbk/MateriEntrypoint';
import type { GetStaticProps } from 'next';

const MateriPage = (): JSX.Element => {
    const { isLoadingProfile, isAuthenticated } = useAuth();

    // it's necessary to prevent glitch
    // proper loading state will be addressed later
    if (isLoadingProfile === undefined || isLoadingProfile) {
        return <></>;
    }

    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="w-full max-w-5xl mx-auto px-6 pt-[calc(92px+32px)]">
                    <MateriEntrypoint />
                </div>
            </Layout>
        );
    }

    return (
        <LearnLayout showSidebar fullHeightSidebar className="relative">
            <div className="w-full max-w-5xl mx-auto mt-8">
                <MateriEntrypoint />
            </div>
        </LearnLayout>
    );
};

MateriPage.displayName = 'Materi';
export default MateriPage;

export const getStaticProps: GetStaticProps = () => {
    const META_TITLE = 'Materi Persiapan UTBK 2026';
    const META_DESCRIPTION =
        'Akses ratusan jam konten video yang dibawakan langsung oleh mahasiswa dari UI, ITB, dan lainnya. Penjelasan santai, mudah dimengerti, dan to-the-point.';

    return {
        props: {
            title: META_TITLE,
            description: META_DESCRIPTION,
            canonical: `https://gradient.academy/utbk/materi`,
            openGraph: {
                type: 'website',
                title: META_TITLE,
                description: META_DESCRIPTION,
                url: `https://gradient.academy/utbk`,
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
};
