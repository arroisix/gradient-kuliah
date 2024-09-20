import { GetStaticPaths, GetStaticProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import AstronotesDetail from 'courses/containers/learn/astronotes/detail';
import { wrapper } from 'redux/store';
import { ThunkDispatch } from 'redux-thunk';
import { getBookDetail } from 'courses/redux/api/astronotesApi';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import { getBookRecommendations } from 'courses/redux/api/learningExperienceApi';

const AstronotesDetailPage = ({
    slug,
    astronotes,
    recommendations
}: {
    slug: string;
    astronotes: BookDetailInterface;
    recommendations: GetBookRecommendationResponse;
}): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <AstronotesDetail
                slug={slug}
                astronotes={astronotes}
                recommendations={recommendations}
            />
        </LearnLayout>
    );
};

AstronotesDetailPage.displayName = 'Astronotes Detail';
export default AstronotesDetailPage;

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true
    };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    (store) =>
        async ({ params }) => {
            const { slug } = params as { slug: string };
            const dispatch = store.dispatch as ThunkDispatch<
                RootState,
                never,
                never
            >;
            dispatch(getBookDetail.initiate({ slug }));
            dispatch(
                getBookRecommendations.initiate({
                    category: 'astronotes',
                    slug
                })
            );

            const payload = await Promise.all(
                dispatch(getRunningQueriesThunk())
            );

            if (payload[0].error) {
                return {
                    notFound: true
                };
            }

            const data = payload[0].data as GetBookDetailResponse;
            const recommendations = payload[1]
                .data as GetBookRecommendationResponse;
            if (data.book.category.toLowerCase() !== 'catatan') {
                return {
                    notFound: true
                };
            }

            const META_TITLE = `Daftar Isi Diktat/Buku ${data.book.title}`;
            const META_DESCRIPTION = `Baca diktat E-book ${data.book.title} untuk menghemat waktu belajar, dan meningkatkan performa akademik. Mulai belajar lebih praktis & terstruktur sekarang.`;

            return {
                revalidate: 300,
                props: {
                    slug: params?.slug,
                    astronotes: data.book,
                    recommendations,
                    canonical: `https://gradient.academy/perpustakaan/astronotes/${params?.slug}`,
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    openGraph: {
                        type: 'website',
                        title: META_TITLE,
                        description: META_DESCRIPTION,
                        url: `https://gradient.academy/perpustakaan/astronotes/${params?.slug}`,
                        images: [
                            {
                                url: data.book.cover_url,
                                width: 162,
                                height: 232,
                                alt: `${data.book.category} ${data.book.title}`
                            },
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
        }
);
