import LearnLayout from 'commons/learnLayout';
import Astronotes from 'courses/containers/learn/astronotes';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import config from 'redux/api/config';
import axios from 'axios';
import { ArticleJsonLd } from 'next-seo';
import moment from 'moment';
import CryptoJS from 'crypto-js';

const DUMMY_DATE = moment().startOf('year').format();

const AstronotesPage = ({
    book,
    slug,
    page,
    content,
    recommendations
}: AstronotesPageProps): JSX.Element => {
    return (
        <>
            <ArticleJsonLd
                title={`Halaman ${page} | ${book.category} ${book.title} | Catatan, Rangkuman dan Bank Soal`}
                description={`Belajar dan Paham dengan baca ${book.category} ${book.title} hanya di Gradient`}
                authorName={[
                    {
                        name: 'Tutor Gradient',
                        url: 'https://gradient.academy'
                    }
                ]}
                datePublished={DUMMY_DATE}
                url={`https://gradient.academy/perpustakaan/astronotes/${slug}/${page}`}
                images={[
                    book?.cover_url,
                    'https://assets.gradient.academy/assets/gradient-G-icon.png'
                ]}
                isAccessibleForFree={page == 1 || book.is_free}
            />
            <LearnLayout noPadding showSubscriptionReminder>
                <Astronotes
                    content={content}
                    book={book}
                    key={page}
                    recommendations={recommendations}
                />
            </LearnLayout>
        </>
    );
};

AstronotesPage.displayName = 'Astronotes Reader';
export default AstronotesPage;

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug, page } = params as { slug: string; page: string };
    let isError = false;
    const [getBookContent, getBookDetail, getBookRecommendations] =
        await Promise.all([
            parseInt(page) == 1
                ? axios
                      .get<GetAstronotesContentResponse>(
                          `${config.API_BASE_URL}books/public/${slug}/preview/`
                      )
                      .catch(() => {
                          isError = true;
                      })
                : axios
                      .get<GetAstronotesContentResponse>(
                          `${config.API_BASE_URL}books/${slug}`,
                          {
                              headers: {
                                  'X-Special-Request':
                                      process.env.FRONTEND_ACCESS_TOKEN
                              }
                          }
                      )
                      .catch(() => {
                          isError = true;
                      }),
            axios
                .get<GetBookDetailResponse>(
                    `${config.API_BASE_URL}books/${slug}/detail/`
                )
                .catch(() => {
                    isError = true;
                }),
            axios
                .get<GetBookRecommendationResponse>(
                    `${config.API_BASE_URL}learning-experiences/recommendations/astronotes/${slug}/?astronotes_only=true`
                )
                .catch(() => {
                    isError = true;
                })
        ]);

    if (
        isError ||
        !getBookContent ||
        !getBookDetail ||
        !getBookRecommendations
    ) {
        return {
            notFound: true
        };
    }

    const key = process.env.FRONTEND_ACCESS_TOKEN as string;
    const encryptedContent = CryptoJS.AES.encrypt(
        JSON.stringify(getBookContent.data),
        key
    );
    const book = getBookDetail.data.book;
    const recommendations = getBookRecommendations.data;

    if (book.category.toLowerCase() !== 'catatan') {
        return {
            notFound: true
        };
    }

    const META_TITLE = getBookContent.data.chapter? `Catatan & Rangkuman ${getBookContent.data.chapter}` : `Halaman ${page} | ${book?.category} ${book?.title} | Catatan, Rangkuman dan Bank Soal`
    const META_DESCRIPTION = getBookContent.data.chapter? `Pelajari konsep-konsep penting dari materi ${getBookContent.data.chapter} melalui rangkuman yang ringkas dan mudah dipahami dengan cepat.` : `Belajar dan Paham dengan baca ${book?.category} ${book?.title} hanya di Gradient`

    return {
        revalidate: 300,
        props: {
            book,
            slug,
            page: parseInt(page),
            content:
                parseInt(page) == 1
                    ? JSON.stringify(getBookContent.data)
                    : encryptedContent.toString(),
            recommendations,
            canonical: `https://gradient.academy/perpustakaan/astronotes/${slug}/${page}`,
            title: META_TITLE,
            description: META_DESCRIPTION,
            openGraph: {
                type: 'website',
                title: META_TITLE,
                description: META_DESCRIPTION,
                url: `https://gradient.academy/perpustakaan/astronotes/${slug}/${page}`,
                images: [
                    {
                        url: book.cover_url,
                        width: 162,
                        height: 232,
                        alt: `${book?.category} ${book?.title}`
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
};
