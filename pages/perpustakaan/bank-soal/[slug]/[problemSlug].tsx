import LearnLayout from 'commons/learnLayout';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import { ArticleJsonLd } from 'next-seo';
import moment from 'moment';
import BankSoalContainer from 'courses/containers/learn/astronotes/bankSoal';
import { getBankSoal, getBookDetail } from 'courses/redux/api/astronotesApi';
import { wrapper } from 'redux/store';
import { ThunkDispatch } from 'redux-thunk';
import { getRunningQueriesThunk } from 'redux/api/baseApi';

const DUMMY_DATE = moment().startOf('year').format();

interface BankSoalProblemPageProps {
    slug: string;
    problemSlug: string;
    content: BankSoal;
    title: string;
    description: string;
}

const BankSoalPage = ({
    slug,
    problemSlug,
    content,
    title,
    description
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
            <LearnLayout bookReader>
                <BankSoalContainer data={content as unknown as BankSoal} />
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

            const title = `Pembahasan Soal ${bankSoal.problem.chapter_name} ${bankSoal.problem.title} | ${book.title}`;
            const description = title;

            return {
                revalidate: 300,
                props: {
                    slug,
                    problemSlug,
                    book,
                    content: bankSoal,
                    canonical: `https://gradient.academy/perpustakaan/bank-soal/${slug}/${problemSlug}`,
                    // TODO(angga): replace SEO title and descriptions
                    title,
                    description,
                    openGraph: {
                        type: 'website',
                        // TODO(angga): replace SEO title and descriptions
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
