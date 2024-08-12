import { GetStaticPaths, GetStaticProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import AstronotesDetail from 'courses/containers/learn/astronotes/detail';
import { wrapper } from 'redux/store';
import { ThunkDispatch } from 'redux-thunk';
import axios from 'axios';
import config from 'redux/api/config';
import { getBookDetail } from 'courses/redux/api/astronotesApi';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import { getBookRecommendations } from 'courses/redux/api/learningExperienceApi';

const BankSoalDetailPage = ({
    slug,
    astronotes,
    recommendations
}: {
    slug: string;
    astronotes: BookDetailInterface;
    recommendations: GetBookRecommendationResponse;
}): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar noPadding>
            <AstronotesDetail
                slug={slug}
                astronotes={astronotes}
                recommendations={recommendations}
            />
        </LearnLayout>
    );
};

BankSoalDetailPage.displayName = 'Question Bank Detail';
export default BankSoalDetailPage;

export const getStaticPaths: GetStaticPaths = async () => {
    const { data: response } = await axios.get<ListResponseData<string>>(
        `${config.API_BASE_URL}books/list-slug/`,
        { params: { category: 'Bank Soal' } }
    );

    const paths = response.data.flatMap((slug) => ({ params: { slug } }));

    return {
        paths,
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
                getBookRecommendations.initiate({ category: 'bank-soal', slug })
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
            if (data.book.category.toLowerCase() !== 'bank soal') {
                return {
                    notFound: true
                };
            }

            const META_TITLE = `${data.book.title} Beserta Pembahasannya`
            const META_DESCRIPTION = `Raih prestasi akademis lebih tinggi melalui latihan soal ${data.book.title} beserta solusi lengkap untuk setiap pertanyaan yang akan mudah untuk Kamu pahami.`

            return {
                revalidate: 300,
                props: {
                    slug: params?.slug,
                    astronotes: data.book,
                    recommendations,
                    canonical: `https://gradient.academy/perpustakaan/bank-soal/${params?.slug}`,
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    openGraph: {
                        type: 'website',
                        title: META_TITLE,
                        description: META_DESCRIPTION,
                        url: `https://gradient.academy/perpustakaan/bank-soal/${params?.slug}`,
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
