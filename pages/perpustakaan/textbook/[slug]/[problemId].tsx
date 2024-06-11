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

const DUMMY_DATE = moment().startOf('year').format();
interface TextbookSolutionProblemPageProps {
    slug: string;
    problemId: string;
    content: TextbookSolution;
    title: string;
    description: string;
}

const TextbookSolutionProblemPage = ({
    slug,
    problemId,
    content,
    title,
    description
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
                url={`https://gradient.academy/perpustakaan/textbook/${slug}/${problemId}`}
                images={[
                    'https://assets.gradient.academy/assets/gradient-G-icon.png'
                ]}
                isAccessibleForFree={false}
            />
            <LearnLayout>
                <TextbookSolution data={content} />
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
            const { slug, problemId } = params as {
                slug: string;
                problemId: string;
            };
            const dispatch = store.dispatch as ThunkDispatch<
                RootState,
                never,
                never
            >;

            dispatch(getBookDetail.initiate({ slug }));
            dispatch(getTextbookSolution.initiate({ slug, problemId }));

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

            const title = `Pembahasan Soal ${textbook.problem.title} | ${book.title}`;
            const description = title;

            return {
                revalidate: 300,
                props: {
                    slug,
                    problemId,
                    content: textbook,
                    canonical: `https://gradient.academy/perpustakaan/textbook/${slug}/${problemId}`,
                    // TODO(angga): replace SEO title and descriptions
                    title,
                    description,
                    openGraph: {
                        type: 'website',
                        // TODO(angga): replace SEO title and descriptions
                        title,
                        description,
                        url: `https://gradient.academy/perpustakaan/textbook/${slug}/${problemId}`,
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
