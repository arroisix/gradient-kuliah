import LearnLayout from 'commons/learnLayout';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import { ArticleJsonLd } from 'next-seo';
import moment from 'moment';
import BankSoalContainer from 'courses/containers/learn/astronotes/bankSoal';
import { getBankSoal, getBookDetail } from 'courses/redux/api/astronotesApi';
import { wrapper } from 'redux/store';
import { ThunkDispatch } from 'redux-thunk';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import { getBankSoalProblemRecommendations } from 'courses/redux/api/learningExperienceApi';

const DUMMY_DATE = moment().startOf('year').format();

interface BankSoalProblemPageProps {
    slug: string;
    problemSlug: string;
    content: BankSoal;
    title: string;
    description: string;
    recommendations: GetProblemRecommendationsResponse;
}

const BankSoalPage = ({
    slug,
    problemSlug,
    content,
    title,
    description,
    recommendations
}: BankSoalProblemPageProps): JSX.Element => {
    return (
        <>
            <ArticleJsonLd
                title={title}
                description={description}
                authorName={[
                    {
                        name: 'Tutor Gradient',
                        url: 'https://gradient.academy'
                    }
                ]}
                datePublished={DUMMY_DATE}
                url={`https://gradient.academy/perpustakaan/textbook/${slug}/${problemSlug}`}
                images={[
                    'https://assets.gradient.academy/assets/gradient-G-icon.png'
                ]}
                isAccessibleForFree={false}
            />
            <LearnLayout noPadding>
                <BankSoalContainer
                    data={content as unknown as BankSoal}
                    recommendations={recommendations}
                />
            </LearnLayout>
        </>
    );
};

BankSoalPage.displayName = 'Question Bank Reader';
export default BankSoalPage;

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    (store) =>
        async ({ params }) => {
            const { slug, problemSlug } = params as {
                slug: string;
                problemSlug: string;
            };
            const dispatch = store.dispatch as ThunkDispatch<
                RootState,
                never,
                never
            >;

            dispatch(getBookDetail.initiate({ slug }));
            dispatch(getBankSoal.initiate({ slug, problemSlug }));
            dispatch(
                getBankSoalProblemRecommendations.initiate({
                    slug: problemSlug
                })
            );

            const payload = await Promise.all(
                dispatch(getRunningQueriesThunk())
            );

            if (payload.some((response) => response.isError)) {
                return {
                    notFound: true
                };
            }

            const { book } = payload[0].data as GetBookDetailResponse;
            if (book.category.toLowerCase() !== 'bank soal') {
                return {
                    notFound: true
                };
            }

            const bankSoal = payload[1].data as BankSoal;
            const recommendations = payload[2]
                .data as GetProblemRecommendationsResponse;

            const title =
                bankSoal.problem.title.length > 70
                    ? `${bankSoal.problem.title.substring(0, 70)} ...`
                    : bankSoal.problem.title;
            const description =
                'Persiapkan diri kamu untuk menghadapi ujian dengan kumpuan soal-soal UTS, UAS, ujian, dan bank soal dari universitas ternama. Pelajari setiap soal dengan detail!';

            return {
                revalidate: 300,
                props: {
                    slug,
                    problemSlug,
                    book,
                    content: bankSoal,
                    recommendations,
                    canonical: `https://gradient.academy/perpustakaan/bank-soal/${slug}/${problemSlug}`,
                    title,
                    description,
                    openGraph: {
                        type: 'website',
                        title,
                        description,
                        url: `https://gradient.academy/perpustakaan/bank-soal/${slug}/${problemSlug}`,
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
        }
);
