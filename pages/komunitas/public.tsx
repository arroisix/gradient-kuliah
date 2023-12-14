import { useFeatureIsOn } from '@growthbook/growthbook-react';
import axios from 'axios';
import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import KomunitasContainer from 'komunitas/containers';
import { KomunitasProvider } from 'komunitas/contexts/KomunitasProvider';
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
            <LearnLayout showSidebar fullHeightSidebar>
                <KomunitasContainer initialData={data} />
            </LearnLayout>
        </KomunitasProvider>
    ) : (
        <></>
    );
};

export async function getStaticProps(): Promise<{
    props: {
        data: KomunitasProps['data'];
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
    revalidate: number;
}> {
    const { data }: { data: KomunitasProps['data'] } = await axios.get(
        `${config.API_BASE_URL}communities/public/post/`
    );

    return {
        props: {
            data,
            title: 'Tanya Jawab, Diskusi Materi Kuliah di Gradient',
            description:
                'Tempat belajar materi kuliah nomor 1 di Indonesia. Lengkap materi dan pembahasan soal',
            openGraph: {
                type: 'website',
                title: `Tanya Jawab, Diskusi Materi Kuliah di Gradient`,
                description: `Tempat belajar materi kuliah nomor 1 di Indonesia. Lengkap materi dan pembahasan soal`,
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
        },
        revalidate: 60
    };
}

Komunitas.displayName = 'Community Explore';
export default withAnon(Komunitas);
