import { useThemeContext } from 'commons/contexts/ThemeProvider';
import LearnLayout from 'commons/learnLayout';
import Astronotes from 'courses/containers/learn/astronotes';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import config from 'redux/api/config';
import axios from 'axios';
import { ArticleJsonLd } from 'next-seo';
import moment from 'moment';
import CryptoJS from 'crypto-js';

const DUMMY_DATE = moment().startOf('year').format();

interface AstronotesPageProps {
    slug: string;
    page: number;
    book: GetBookDetailResponse['book'];
    content: string;
}

const AstroNotesPage = ({
    book,
    slug,
    page,
    content
}: AstronotesPageProps): JSX.Element => {
    const { theme } = useThemeContext();

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
                url={`https://gradient.academy/astronotes/${slug}/${page}`}
                images={[
                    book?.cover_url,
                    'https://assets.gradient.academy/assets/gradient-G-icon.png'
                ]}
                isAccessibleForFree={page == 1 || book.is_free}
            />
            <LearnLayout lightMode={theme === 'light'} showSubscriptionReminder>
                <Astronotes content={content} book={book} key={page} />
            </LearnLayout>
        </>
    );
};

AstroNotesPage.displayName = 'Books Reader';
export default AstroNotesPage;

export const getStaticPaths: GetStaticPaths = async () => {
    const { data: response } = await axios.get<ListResponseData<string>>(
        `${config.API_BASE_URL}books/list-slug/`
    );

    const paths = response.data.flatMap((slug) => [
        { params: { slug, page: '1' } },
        { params: { slug, page: '2' } },
        { params: { slug, page: '3' } }
    ]);

    return {
        paths,
        fallback: 'blocking'
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug, page } = params as { slug: string; page: string };
    let isError = false;
    const [getBookContent, getBookDetail] = await Promise.all([
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
            })
    ]);

    if (isError || !getBookContent || !getBookDetail) {
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
            canonical: `https://gradient.academy/astronotes/${slug}/${page}`,
            title: `Halaman ${page} | ${book?.category} ${book?.title} | Catatan, Rangkuman dan Bank Soal`,
            description: `Belajar dan Paham dengan baca ${book?.category} ${book?.title} hanya di Gradient`,
            openGraph: {
                type: 'website',
                title: `Halaman ${page} | ${book?.category} ${book?.title} | Catatan, Rangkuman dan Bank Soal`,
                description: `Belajar dan Paham dengan baca ${book?.category} ${book?.title} hanya di Gradient`,
                url: `https://gradient.academy/astronotes/${slug}/${page}`,
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
