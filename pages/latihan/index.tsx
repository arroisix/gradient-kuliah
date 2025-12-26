import LearnLayout from 'commons/learnLayout';
import LatihanEntrypoint from 'exercises/containers/LatihanEntrypoint';
import { GetStaticProps } from 'next';
import { useTracker } from '../../tracker/tracker';
import { useEffect } from 'react';
import { useAuth } from 'authentication/contexts/AuthProvider';
import dynamic from 'next/dynamic';

const SetTargetDrawer = dynamic(
    () => import('exercises/components/Entrypoint/SetTargetDrawer')
);

const LatihanPage = (): JSX.Element => {
    const tracker = useTracker();
    const { profile, isLoadingProfile } = useAuth();

    useEffect(() => {
        tracker?.genericTrack('Visit Latihan Landing Page');
    }, [tracker]);

    if (isLoadingProfile === undefined || isLoadingProfile) {
        return (
            <LearnLayout showSidebar fullHeightSidebar>
                <></>
            </LearnLayout>
        );
    }

    if (profile?.current_role === 'K12') {
        return (
            <LearnLayout showSidebar fullHeightSidebar>
                <SetTargetDrawer>
                    <LatihanEntrypoint />
                </SetTargetDrawer>
            </LearnLayout>
        );
    }

    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <LatihanEntrypoint />
        </LearnLayout>
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
