import LearnLayout from 'commons/learnLayout';
import moment from 'moment';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ArticleJsonLd } from 'next-seo';
import React from 'react';
import TextbookSolution from 'courses/containers/learn/astronotes/textbook';
import {
    getBookDetail,
    getTextbookSolution
} from 'courses/redux/api/astronotesApi';
import { ThunkDispatch } from 'redux-thunk';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import { wrapper } from 'redux/store';
import { getTextbookProblemRecommendations } from 'courses/redux/api/learningExperienceApi';

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
            dispatch(getTextbookSolution.initiate({ slug, problemSlug }));
            dispatch(
                getTextbookProblemRecommendations.initiate({
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
            if (book.category.toLowerCase() !== 'textbook') {
                return {
                    notFound: true
                };
            }

            const textbook = payload[1].data as TextbookSolution;
            const recommendations = payload[2]
                .data as GetProblemRecommendationsResponse;

            const section = textbook.problem.section? textbook.problem.section : textbook.problem.chapter
            const title = `Pembahasan Soal & Kunci Jawaban ${section}`;
            const description = 'Temukan pembahasan soal-soal dari buku ajar perkuliahan yang disusun oleh dosen-dosen terbaik. Solusi yang mendalam dan komprehensif dapat meningkatkan kemampuan kamu.';

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
        }
);
