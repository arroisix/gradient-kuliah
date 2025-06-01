import LearnLayout from 'commons/learnLayout';
import moment from 'moment';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ArticleJsonLd } from 'next-seo';
import React from 'react';
import TextbookSolution from 'courses/containers/learn/astronotes/textbook';
import axios from 'axios';
import config from 'redux/api/config';

const DUMMY_DATE = moment().startOf('year').format();
interface TextbookSolutionProblemPageProps {
    slug: string;
    problemSlug: string;
    content: TextbookSolution;
    title: string;
    description: string;
    recommendations: GetProblemRecommendationsResponse;
}

const TextbookSolutionProblemPage = ({
    slug,
    problemSlug,
    content,
    title,
    description,
    recommendations
}: TextbookSolutionProblemPageProps): JSX.Element => {
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
                <TextbookSolution
                    data={content}
                    recommendations={recommendations}
                />
            </LearnLayout>
        </>
    );
};

TextbookSolutionProblemPage.displayName = 'Textbook Reader';
export default TextbookSolutionProblemPage;

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

        // Fetch book details, textbook solution, and recommendations in parallel
        const [bookResponse, textbookResponse, recommendationsResponse] =
            await Promise.all([
                axios.get<GetBookDetailResponse>(
                    `${config.API_BASE_URL}books/${slug}/detail/`
                ),
                axios.get<TextbookSolution>(
                    `${config.API_BASE_URL}books/textbook/${slug}/problems/${problemSlug}/`
                ),
                axios.get<GetProblemRecommendationsResponse>(
                    `${config.API_BASE_URL}learning-experiences/recommendations/textbook/problems/${problemSlug}/`
                )
            ]);

        const { book } = bookResponse.data;

        if (book.category.toLowerCase() !== 'textbook') {
            return {
                notFound: true
            };
        }

        const textbook = textbookResponse.data;
        const recommendations = recommendationsResponse.data;

        const section = textbook.problem.section
            ? textbook.problem.section
            : textbook.problem.chapter;
        const title = `Pembahasan Soal & Kunci Jawaban ${section}`;
        const description =
            'Temukan pembahasan soal-soal dari buku ajar perkuliahan yang disusun oleh dosen-dosen terbaik. Solusi yang mendalam dan komprehensif dapat meningkatkan kemampuan kamu.';

        return {
            revalidate: 300,
            props: {
                slug,
                problemSlug,
                content: textbook,
                recommendations,
                canonical: `https://gradient.academy/perpustakaan/textbook/${slug}/${problemSlug}`,
                title,
                description,
                openGraph: {
                    type: 'website',
                    title,
                    description,
                    url: `https://gradient.academy/perpustakaan/textbook/${slug}/${problemSlug}`,
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
        console.error('Error fetching textbook solution:', error);
        return {
            notFound: true
        };
    }
};
