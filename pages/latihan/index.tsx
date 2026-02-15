import LatihanEntrypoint from 'exercises/containers/LatihanEntrypoint';
import { GetStaticProps } from 'next';
import { useTracker } from '../../tracker/tracker';
import { useEffect } from 'react';
import { Layout } from 'commons/components/Layout';
import LearnLayout from 'commons/learnLayout';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { cn } from 'commons/utils';

const LatihanPage = (): JSX.Element => {
    const { profile } = useAuth();
    const tracker = useTracker();

    useEffect(() => {
        tracker?.genericTrack('Visit Latihan Landing Page');
    }, [tracker]);

    if (!profile) {
        return (
            <LearnLayout fullHeightSidebar>
                <LatihanEntrypoint />
            </LearnLayout>
        );
    }

    return (
        <Layout>
            <div className={cn('m-4', 'lg:mx-12 lg:my-8')}>
                <LatihanEntrypoint />
            </div>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = () => {
    const META_TITLE =
        'Try Out UTS dan UAS Online Materi Kuliah Bersama Gradient';
    const META_DESCRIPTION =
        'Try Out Latihan Soal yang dikurasi oleh Gradient agar kamu bisa belajar materi kuliah dengan mudah dan nyaman.';

    return {
        props: {
            title: META_TITLE,
            description: META_DESCRIPTION,
            canonical: `https://gradient.academy/latihan`,
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

LatihanPage.displayName = 'Latihan';
export default LatihanPage;
