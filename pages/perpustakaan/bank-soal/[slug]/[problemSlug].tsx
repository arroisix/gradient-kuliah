import LearnLayout from 'commons/learnLayout';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import { ArticleJsonLd } from 'next-seo';
import moment from 'moment';
import BankSoalContainer from 'courses/containers/learn/astronotes/bankSoal';
import axios from 'axios';
import config from 'redux/api/config';

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
        fallback: true
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    try {
        const { slug, problemSlug } = params as {
            slug: string;
            problemSlug: string;
        };

        // Fetch book details, bank soal problem, and recommendations in parallel
        const [bookResponse, bankSoalResponse, recommendationsResponse] =
            await Promise.all([
                axios.get<GetBookDetailResponse>(
                    `${config.API_BASE_URL}books/${slug}/detail/`
                ),
                axios.get<BankSoal>(
                    `${config.API_BASE_URL}books/bank-soal/${slug}/problems/${problemSlug}/`
                ),
                axios.get<GetProblemRecommendationsResponse>(
                    `${config.API_BASE_URL}learning-experiences/recommendations/books/problems/${problemSlug}/`
                )
            ]);

        const { book } = bookResponse.data;

        if (book.category.toLowerCase() !== 'bank soal') {
            return {
                notFound: true
            };
        }

        const bankSoal = bankSoalResponse.data;
        const recommendations = recommendationsResponse.data;

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
    } catch (error) {
        console.error('Error fetching bank soal problem:', error);
        return {
            notFound: true
        };
    }
};
