import axios from 'axios';
import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import DetailSection from 'komunitas/containers/DetailSection';
import { KomunitasProvider } from 'komunitas/contexts/KomunitasProvider';
import { GetStaticProps, GetStaticPaths } from 'next';
import config from 'redux/api/config';

type DetailKomunitasProps = {
    data: CommunityPostDetailResponse;
};

const DetailKomunitas = ({ data }: DetailKomunitasProps): JSX.Element => {
    return (
        <KomunitasProvider initialDetailData={data}>
            <LearnLayout showSidebar fullHeightSidebar>
                <DetailSection initialDetailData={data} />
            </LearnLayout>
        </KomunitasProvider>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const communitySlug = await fetch(
        `${config.API_BASE_URL}communities/public/post/list/`
    );

    const result: { questions: Pick<CommunityPost, 'slug'>[] } =
        await communitySlug.json();

    return {
        paths: result.questions.map((question) => ({
            params: { id: question.slug }
        })),
        fallback: true // can also be true or 'blocking'
    };
};

export const getStaticProps: GetStaticProps = async ({
    params
}): Promise<{
    props: {
        data: CommunityPostDetailResponse;
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
}> => {
    const { data }: { data: CommunityPostDetailResponse } = await axios.get(
        `${config.API_BASE_URL}communities/public/post/${params?.id}/`
    );

    return {
        props: {
            data,
            title: `${data.category}: ${data.content}`,
            description: data.content,
            openGraph: {
                type: 'website',
                title: `${data.category}: ${data.content}`,
                description: data.content,
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
        revalidate: 60 * 60 * 5 // 5 hours
    };
};

DetailKomunitas.displayName = 'Community Detail';
export default withAnon(DetailKomunitas);
