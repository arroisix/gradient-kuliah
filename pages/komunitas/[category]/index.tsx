import { useFeatureIsOn } from '@growthbook/growthbook-react';
import axios from 'axios';
import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import KomunitasContainer from 'komunitas/containers';
import { KomunitasProvider } from 'komunitas/contexts/KomunitasProvider';
import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import config from 'redux/api/config';

type KomunitasProps = {
    data: CommunityPostResponse & {
        count_items: number;
        next_page?: number;
        previous_page?: number;
    };
};

const KomunitasByCategory = ({ data }: KomunitasProps): JSX.Element => {
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

KomunitasByCategory.displayName = 'Community By Category Explore';
export default withAnon(KomunitasByCategory);

export const getStaticPaths: GetStaticPaths = async () => {
    const { data: response } = await axios.get<SubjectCategoriesResponse>(
        `${config.API_BASE_URL}communities/public/subject-category/`
    );

    const paths = response.categories.flatMap(({ slug }) => ({
        params: { category: slug }
    }));

    return {
        paths,
        fallback: true
    };
};

export const getStaticProps: GetStaticProps = async ({
    params
}): Promise<
    GetStaticPropsResult<
        KomunitasProps & {
            title: string;
            description: string;
            canonical: string;
            openGraph: { [key: string]: unknown };
        }
    >
> => {
    const { category } = params as { category: string };
    const { data }: { data: KomunitasProps['data'] } = await axios.get(
        `${config.API_BASE_URL}communities/public/post/?category_slug=${category}`
    );

    const metaTitle =
        'Forum Diskusi Mahasiswa Tanya Jawab Pesoalan Kuliah | Gradient';
    const metaDescription =
        'Temukan jawaban atas pertanyaan-pertanyaan dari materi kuliah serta saling bertukar informasi agar dapat meningkatkan pemahaman secara bersama-sama.';

    return {
        props: {
            data,
            canonical: `https://gradient.academy/komunitas/${category}`,
            title: metaTitle,
            description: metaDescription,
            openGraph: {
                type: 'website',
                title: metaTitle,
                description: metaDescription,
                url: `https://gradient.academy/komunitas/${category}`,
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
