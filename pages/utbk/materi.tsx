import { useAuth } from 'authentication/contexts/AuthProvider';
import LearnLayout from 'commons/learnLayout';
import Layout from 'commons/utbkLayout';
import { MateriComingSoon } from 'landing/components/utbk/MateriComingSoon';
import { GetStaticProps } from 'next';

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
                <div className="w-screen h-screen relative">
                    <MateriComingSoon />
                </div>
            </Layout>
        );
    }

    return (
        <LearnLayout showSidebar fullHeightSidebar className="relative">
            <div className="relative w-full h-[calc(100vh-128px)]">
                <MateriComingSoon />
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
