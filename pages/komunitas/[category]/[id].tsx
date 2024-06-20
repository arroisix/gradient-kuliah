import axios from 'axios';
import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import DetailSection from 'komunitas/containers/DetailSection';
import { KomunitasProvider } from 'komunitas/contexts/KomunitasProvider';
import { GetStaticProps, GetStaticPaths } from 'next';
import config from 'redux/api/config';
import { wrapper } from 'redux/store';
import { ThunkDispatch } from 'redux-thunk';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import { getPublicCommunityPostDetail } from 'komunitas/redux/api/komunitasApi';

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
    const { data: response } = await axios.get<ExploreQuestionResponse>(
        `${config.API_BASE_URL}communities/public/post/list/`
    );

    return {
        paths: response.questions.map(({ category_slug, slug }) => ({
            params: { category: category_slug, id: slug }
        })),
        fallback: true // can also be true or 'blocking'
    };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    (store) =>
        async ({ params }) => {
            const { category, id } = params as { category: string; id: string };

            (store.dispatch as ThunkDispatch<RootState, never, never>)(
                getPublicCommunityPostDetail.initiate({ slug: id })
            );

            const payload = await Promise.all(
                (store.dispatch as ThunkDispatch<RootState, never, never>)(
                    getRunningQueriesThunk()
                )
            );

            if (payload[0].error) {
                return {
                    notFound: true
                };
            }

            const data = payload[0].data as CommunityPostDetailResponse;

            const META_TITLE =
                data.content.length > 60
                    ? `${data.content.substring(0, 60)} ...`
                    : data.content;
            const META_DESCRIPTION =
                data.content.length > 155
                    ? `${data.content.substring(0, 155)} ...`
                    : data.content;

            return {
                props: {
                    data,
                    canonical: `https://gradient.academy/komunitas/${category}/${id}`,
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    openGraph: {
                        type: 'website',
                        title: META_TITLE,
                        description: META_DESCRIPTION,
                        url: `https://gradient.academy/komunitas/${category}/${id}`,
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
                revalidate: 60 * 60 * 5 // 5 hours
            };
        }
);

DetailKomunitas.displayName = 'Community Detail';
export default withAnon(DetailKomunitas);
