import { useFeatureIsOn } from '@growthbook/growthbook-react';
import axios from 'axios';
import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import KomunitasContainer from 'komunitas/containers';
import { KomunitasProvider } from 'komunitas/contexts/KomunitasProvider';
import { GetStaticProps } from 'next';
import config from 'redux/api/config';

type KomunitasProps = {
    data: CommunityPostResponse & {
        count_items: number;
        next_page?: number;
        previous_page?: number;
    };
};

const Komunitas = ({ data }: KomunitasProps): JSX.Element => {
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    return isLandingPageRevampOn ? (
        <KomunitasProvider initialData={data}>
            <LearnLayout showSidebar fullHeightSidebar showSubscriptionReminder>
                <KomunitasContainer initialData={data} />
            </LearnLayout>
        </KomunitasProvider>
    ) : (
        <></>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const { data }: { data: KomunitasProps['data'] } = await axios.get(
        `${config.API_BASE_URL}communities/public/post/`
    );

    const metaTitle =
        'Forum Diskusi Mahasiswa Tanya Jawab Persoalan Kuliah | Gradient';
    const metaDescription =
        'Temukan jawaban atas pertanyaan-pertanyaan dari materi kuliah serta saling bertukar informasi agar dapat meningkatkan pemahaman secara bersama-sama.';

    return {
        props: {
            data,
            canonical: 'https://gradient.academy/komunitas',
            title: metaTitle,
            description: metaDescription,
            openGraph: {
                type: 'website',
                title: metaTitle,
                description: metaDescription,
                url: 'https://gradient.academy/komunitas',
                images: [
                    {
                        url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                        width: 48,
                        height: 48,
                        alt: 'Gradient Academy'
                    }
                ]
            }
        },
        revalidate: 60
    };
};

Komunitas.displayName = 'Community Explore';
export default withAnon(Komunitas);
